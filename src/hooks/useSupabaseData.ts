
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BloodGroup, DonorInfo, InventoryItem, RecipientInfo, TransfusionEvent } from "@/types/blood";
import { toast } from "@/hooks/use-toast";

export const useSupabaseData = () => {
  const [donors, setDonors] = useState<DonorInfo[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipients, setRecipients] = useState<RecipientInfo[]>([]);
  const [transfusions, setTransfusions] = useState<TransfusionEvent[]>([]);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // Fetch inventory data
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('blood_inventory')
        .select('*');

      if (inventoryError) {
        console.error('Error fetching inventory:', inventoryError);
      }

      // Fetch donors data
      const { data: donorsData, error: donorsError } = await supabase
        .from('donors')
        .select('*');

      if (donorsError) {
        console.error('Error fetching donors:', donorsError);
      }

      // Map donors data if exists
      if (donorsData && donorsData.length > 0) {
        const mappedDonors: DonorInfo[] = donorsData.map(donor => ({
          id: donor.id,
          name: donor.name,
          age: donor.age,
          location: donor.location,
          bloodGroup: donor.blood_group as BloodGroup,
          rhFactor: donor.rh_factor as "Positive" | "Negative",
          isSmoker: donor.is_smoker,
          isAlcoholConsumer: donor.is_alcohol_consumer,
          smokingConsent: donor.smoking_consent,
          alcoholConsent: donor.alcohol_consent,
          donationDate: donor.donation_date
        }));
        setDonors(mappedDonors);
      }

      // Map inventory data if exists
      if (inventoryData && inventoryData.length > 0) {
        const mappedInventory: InventoryItem[] = inventoryData.map(item => ({
          donorId: item.donor_id,
          bloodGroup: item.blood_group as BloodGroup,
          rhFactor: item.rh_factor as "Positive" | "Negative",
          location: item.location,
          donationDate: item.donation_date,
          expiryDate: item.expiry_date
        }));
        setInventory(mappedInventory);
      }

      // Fetch recipient data
      const { data: recipientsData, error: recipientsError } = await supabase
        .from('recipients')
        .select('*');

      if (recipientsError) {
        console.error('Error fetching recipients:', recipientsError);
      } else if (recipientsData) {
        const mappedRecipients = recipientsData.map(recipient => ({
          id: recipient.id,
          name: recipient.name,
          age: recipient.age,
          location: recipient.location,
          bloodGroup: recipient.blood_group as BloodGroup,
          rhFactor: recipient.rh_factor as "Positive" | "Negative",
          urgency: recipient.urgency as "Low" | "Medium" | "High" | "Critical",
          requestDate: recipient.request_date
        }));
        setRecipients(mappedRecipients);
      }

      // Fetch transfusion data
      const { data: transfusionsData, error: transfusionsError } = await supabase
        .from('transfusions')
        .select('*');

      if (transfusionsError) {
        console.error('Error fetching transfusions:', transfusionsError);
      } else if (transfusionsData) {
        const mappedTransfusions = transfusionsData.map(transfusion => ({
          id: transfusion.id,
          donorId: transfusion.donor_id,
          recipientId: transfusion.recipient_id,
          status: transfusion.status as TransfusionStatus,
          date: transfusion.transfusion_date,
          bloodGroup: transfusion.blood_group as BloodGroup,
          location: transfusion.location,
          notes: transfusion.notes
        }));
        setTransfusions(mappedTransfusions);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: "Error",
        description: "Failed to initialize data",
        variant: "destructive",
      });
    }
  };

  return {
    donors,
    setDonors,
    inventory,
    setInventory,
    recipients,
    setRecipients,
    transfusions,
    setTransfusions,
    refreshData: initializeData
  };
};
