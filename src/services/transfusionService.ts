
import { supabase } from "@/integrations/supabase/client";
import { TransfusionStatus, RecipientInfo, InventoryItem, BlockchainRecord } from "@/types/blood";
import { generateId } from "./mockData";
import { toast } from "@/hooks/use-toast";

export const findMatchingDonors = (recipient: RecipientInfo, inventory: InventoryItem[]): InventoryItem[] => {
  const compatibilityMatrix: Record<BloodGroup, BloodGroup[]> = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
  };
  
  const compatibleInventory = inventory.filter(item => 
    compatibilityMatrix[recipient.bloodGroup].includes(item.bloodGroup)
  );
  
  return [...compatibleInventory].sort((a, b) => {
    if (a.bloodGroup === recipient.bloodGroup && b.bloodGroup !== recipient.bloodGroup) return -1;
    if (a.bloodGroup !== recipient.bloodGroup && b.bloodGroup === recipient.bloodGroup) return 1;
    return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
  });
};

export const updateTransfusionStatus = async (
  id: string, 
  status: TransfusionStatus, 
  notes?: string,
  onStatusUpdate?: (blockchainRecord?: BlockchainRecord) => void
) => {
  const { error } = await supabase
    .from('transfusions')
    .update({ status, notes })
    .eq('id', id);

  if (error) {
    console.error('Error updating transfusion:', error);
    toast({
      title: "Error",
      description: "Failed to update transfusion status",
      variant: "destructive",
    });
    return;
  }

  if (status === "Completed") {
    const { data: transfusion } = await supabase
      .from('transfusions')
      .select('*')
      .eq('id', id)
      .single();

    if (transfusion) {
      const newBlockchainRecord: BlockchainRecord = {
        blockId: generateId(),
        timestamp: new Date().toISOString(),
        donorId: transfusion.donor_id,
        recipientId: transfusion.recipient_id,
        transactionType: "Transfusion",
        status: "Valid",
        bloodGroup: transfusion.blood_group,
        location: transfusion.location
      };

      if (onStatusUpdate) {
        onStatusUpdate(newBlockchainRecord);
      }
    }
  }

  toast({
    title: "Transfusion Updated",
    description: `Status changed to ${status}`,
  });
};
