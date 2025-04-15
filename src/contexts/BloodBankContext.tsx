
import React, { createContext, useContext } from "react";
import { BloodGroup, BlockchainRecord, DonorInfo, InventoryItem, RecipientInfo, TransfusionEvent, TransfusionStatus } from "@/types/blood";
import { generateId, generateMockBlockchain } from "@/services/mockData";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { addDonor } from "@/services/donorService";
import { findMatchingDonors, updateTransfusionStatus } from "@/services/transfusionService";
import { verifyBloodUnit, searchBlockchain } from "@/services/blockchainService";

interface BloodBankContextType {
  donors: DonorInfo[];
  inventory: InventoryItem[];
  recipients: RecipientInfo[];
  transfusions: TransfusionEvent[];
  blockchain: BlockchainRecord[];
  addDonor: (donor: Omit<DonorInfo, "id" | "donationDate">) => Promise<string>;
  addRecipient: (recipient: Omit<RecipientInfo, "id" | "requestDate">) => string;
  findMatchingDonors: (recipient: RecipientInfo) => InventoryItem[];
  createTransfusion: (recipientId: string) => string;
  updateTransfusionStatus: (id: string, status: TransfusionStatus, notes?: string) => void;
  verifyBloodUnit: (donorId: string) => boolean;
  searchBlockchain: (donorId: string) => BlockchainRecord[];
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    donors,
    setDonors,
    inventory,
    setInventory,
    recipients,
    setRecipients,
    transfusions,
    setTransfusions
  } = useSupabaseData();

  const [blockchain, setBlockchain] = React.useState<BlockchainRecord[]>([]);

  React.useEffect(() => {
    const blockchainRecords = generateMockBlockchain(inventory, transfusions);
    setBlockchain(blockchainRecords);
  }, [inventory, transfusions]);

  const addRecipient = (recipientData: Omit<RecipientInfo, "id" | "requestDate">) => {
    const id = generateId();
    const requestDate = new Date().toISOString();
    
    const newRecipient: RecipientInfo = {
      ...recipientData,
      id,
      requestDate
    };
    
    setRecipients(prev => [...prev, newRecipient]);
    return id;
  };

  const createTransfusion = (recipientId: string) => {
    const recipient = recipients.find(r => r.id === recipientId);
    if (!recipient) return '';
    
    const matchingDonors = findMatchingDonors(recipient, inventory);
    if (matchingDonors.length === 0) return '';
    
    const selectedDonor = matchingDonors[0];
    const id = generateId();
    
    const newTransfusion: TransfusionEvent = {
      id,
      donorId: selectedDonor.donorId,
      recipientId,
      status: "Pending",
      date: new Date().toISOString(),
      bloodGroup: selectedDonor.bloodGroup,
      location: recipient.location
    };
    
    setTransfusions(prev => [...prev, newTransfusion]);
    return id;
  };

  const handleTransfusionStatus = async (id: string, status: TransfusionStatus, notes?: string) => {
    await updateTransfusionStatus(id, status, notes, (blockchainRecord) => {
      if (blockchainRecord) {
        setBlockchain(prev => [blockchainRecord, ...prev]);
      }
    });

    if (status === "Completed") {
      const transfusion = transfusions.find(t => t.id === id);
      if (transfusion) {
        setInventory(prev => prev.filter(i => i.donorId !== transfusion.donorId));
      }
    }
  };

  return (
    <BloodBankContext.Provider
      value={{
        donors,
        inventory,
        recipients,
        transfusions,
        blockchain,
        addDonor,
        addRecipient,
        findMatchingDonors: (recipient) => findMatchingDonors(recipient, inventory),
        createTransfusion,
        updateTransfusionStatus: handleTransfusionStatus,
        verifyBloodUnit: (donorId) => verifyBloodUnit(donorId, blockchain),
        searchBlockchain: (donorId) => searchBlockchain(donorId, blockchain)
      }}
    >
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBank = () => {
  const context = useContext(BloodBankContext);
  if (context === undefined) {
    throw new Error("useBloodBank must be used within a BloodBankProvider");
  }
  return context;
};
