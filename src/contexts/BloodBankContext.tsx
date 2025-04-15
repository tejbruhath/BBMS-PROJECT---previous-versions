
import React, { createContext, useContext, useState, useEffect } from "react";
import { BloodGroup, BlockchainRecord, DonorInfo, InventoryItem, RecipientInfo, TransfusionEvent, TransfusionStatus } from "@/types/blood";
import { generateId, generateMockBlockchain, generateMockDonors, generateMockInventory, generateMockRecipients, generateMockTransfusions, getExpiryDate } from "@/services/mockData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BloodBankContextType {
  donors: DonorInfo[];
  inventory: InventoryItem[];
  recipients: RecipientInfo[];
  transfusions: TransfusionEvent[];
  blockchain: BlockchainRecord[];
  addDonor: (donor: Omit<DonorInfo, "id" | "donationDate">) => Promise<string>;
  addRecipient: (recipient: Omit<RecipientInfo, "id" | "requestDate">) => string;
  findMatchingDonors: (recipient: RecipientInfo) => InventoryItem[];
  createTransfusion: (donorId: string, recipientId: string, bloodGroup: BloodGroup, location: string) => string;
  updateTransfusionStatus: (id: string, status: TransfusionStatus, notes?: string) => void;
  verifyBloodUnit: (donorId: string) => boolean;
  searchBlockchain: (donorId: string) => BlockchainRecord[];
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<DonorInfo[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipients, setRecipients] = useState<RecipientInfo[]>([]);
  const [transfusions, setTransfusions] = useState<TransfusionEvent[]>([]);
  const [blockchain, setBlockchain] = useState<BlockchainRecord[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if we already have data in Supabase
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('blood_inventory')
          .select('*');

        if (inventoryError) {
          console.error('Error fetching inventory:', inventoryError);
        }

        const { data: donorsData, error: donorsError } = await supabase
          .from('donors')
          .select('*');

        if (donorsError) {
          console.error('Error fetching donors:', donorsError);
        }

        if ((inventoryData && inventoryData.length > 0) || (donorsData && donorsData.length > 0)) {
          // We have data in Supabase already
          console.log('Using existing Supabase data');
          
          // Map donors data
          if (donorsData && donorsData.length > 0) {
            const mappedDonors: DonorInfo[] = donorsData.map(donor => ({
              id: donor.id,
              name: donor.name,
              age: donor.age,
              location: donor.location,
              bloodGroup: donor.blood_group,
              rhFactor: donor.rh_factor,
              isSmoker: donor.is_smoker,
              isAlcoholConsumer: donor.is_alcohol_consumer,
              smokingConsent: donor.smoking_consent,
              alcoholConsent: donor.alcohol_consent,
              donationDate: donor.donation_date
            }));
            setDonors(mappedDonors);
          }

          // Map inventory data
          if (inventoryData && inventoryData.length > 0) {
            const mappedInventory: InventoryItem[] = inventoryData.map(item => ({
              donorId: item.donor_id,
              bloodGroup: item.blood_group,
              rhFactor: item.rh_factor,
              location: item.location,
              donationDate: item.donation_date,
              expiryDate: item.expiry_date
            }));
            setInventory(mappedInventory);
          }
        } else {
          // No data in Supabase yet, seed with mock data
          console.log('Seeding Supabase with mock data');
          await seedSupabaseWithMockData();
        }

        // Fetch recipient data
        const { data: recipientsData, error: recipientsError } = await supabase
          .from('recipients')
          .select('*');

        if (recipientsError) {
          console.error('Error fetching recipients:', recipientsError);
        } else if (recipientsData) {
          const mappedRecipients: RecipientInfo[] = recipientsData.map(recipient => ({
            id: recipient.id,
            name: recipient.name,
            age: recipient.age,
            location: recipient.location,
            bloodGroup: recipient.blood_group,
            rhFactor: recipient.rh_factor,
            urgency: recipient.urgency,
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
          const mappedTransfusions: TransfusionEvent[] = transfusionsData.map(transfusion => ({
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

        // Generate blockchain records
        const blockchainRecords = generateMockBlockchain(inventory, transfusions);
        setBlockchain(blockchainRecords);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    const seedSupabaseWithMockData = async () => {
      try {
        // Generate mock data
        const mockDonors = generateMockDonors(15);
        
        // Insert donors into Supabase
        for (const donor of mockDonors) {
          const { error } = await supabase
            .from('donors')
            .insert([{
              id: donor.id,
              name: donor.name,
              age: donor.age,
              location: donor.location,
              blood_group: donor.bloodGroup,
              rh_factor: donor.rhFactor,
              is_smoker: donor.isSmoker,
              is_alcohol_consumer: donor.isAlcoholConsumer,
              smoking_consent: donor.smokingConsent,
              alcohol_consent: donor.alcoholConsent,
              donation_date: donor.donationDate
            }]);
          
          if (error) {
            console.error('Error inserting donor:', error);
          }
        }

        // Generate mock inventory based on donors
        const mockInventory = generateMockInventory(mockDonors);
        
        // Insert inventory into Supabase
        for (const item of mockInventory) {
          const { error } = await supabase
            .from('blood_inventory')
            .insert([{
              donor_id: item.donorId,
              blood_group: item.bloodGroup,
              rh_factor: item.rhFactor,
              location: item.location,
              donation_date: item.donationDate,
              expiry_date: item.expiryDate,
              status: 'Available'
            }]);
          
          if (error) {
            console.error('Error inserting inventory item:', error);
          }
        }

        // Update local state with mock data
        setDonors(mockDonors);
        setInventory(mockInventory);

        // Generate and set mock recipients
        const mockRecipients = generateMockRecipients(10);
        setRecipients(mockRecipients);

        // Generate and set mock transfusions
        const mockTransfusions = generateMockTransfusions(mockInventory, mockRecipients, 5);
        setTransfusions(mockTransfusions);
        
        // Insert mock recipients into Supabase
        for (const recipient of mockRecipients) {
          const { error } = await supabase
            .from('recipients')
            .insert([{
              id: recipient.id,
              name: recipient.name,
              age: recipient.age,
              location: recipient.location,
              blood_group: recipient.bloodGroup,
              rh_factor: recipient.rhFactor,
              urgency: recipient.urgency,
              request_date: recipient.requestDate
            }]);
          
          if (error) {
            console.error('Error inserting recipient:', error);
          }
        }
        
        // Insert mock transfusions into Supabase
        for (const transfusion of mockTransfusions) {
          const { error } = await supabase
            .from('transfusions')
            .insert([{
              id: transfusion.id,
              donor_id: transfusion.donorId,
              recipient_id: transfusion.recipientId,
              status: transfusion.status,
              transfusion_date: transfusion.date,
              blood_group: transfusion.bloodGroup,
              location: transfusion.location,
              notes: transfusion.notes
            }]);
          
          if (error) {
            console.error('Error inserting transfusion:', error);
          }
        }

        // Generate blockchain records
        const mockBlockchain = generateMockBlockchain(mockInventory, mockTransfusions);
        setBlockchain(mockBlockchain);
      } catch (error) {
        console.error('Error seeding Supabase with mock data:', error);
      }
    };

    initializeData();
  }, []);

  // Add a new donor and update inventory
  const addDonor = async (donorData: Omit<DonorInfo, "id" | "donationDate">) => {
    try {
      // Map the donor data to match Supabase table structure
      const supabaseDonorData = {
        name: donorData.name,
        age: donorData.age,
        location: donorData.location,
        blood_group: donorData.bloodGroup,
        rh_factor: donorData.rhFactor,
        is_smoker: donorData.isSmoker,
        is_alcohol_consumer: donorData.isAlcoholConsumer,
        smoking_consent: donorData.smokingConsent,
        alcohol_consent: donorData.alcoholConsent
      };

      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .insert([supabaseDonorData])
        .select()
        .single();

      if (donorError) {
        console.error('Error adding donor:', donorError);
        toast({
          title: "Error",
          description: "Failed to register donor: " + donorError.message,
          variant: "destructive",
        });
        return '';
      }

      // Add to blood inventory
      const inventoryItem = {
        donor_id: donor.id,
        blood_group: donorData.bloodGroup,
        rh_factor: donorData.rhFactor,
        location: donorData.location,
        donation_date: new Date().toISOString(),
        expiry_date: getExpiryDate(new Date().toISOString()),
        status: 'Available'
      };

      const { error: inventoryError } = await supabase
        .from('blood_inventory')
        .insert([inventoryItem]);

      if (inventoryError) {
        console.error('Error adding to inventory:', inventoryError);
        toast({
          title: "Warning",
          description: "Donor registered but failed to add to inventory: " + inventoryError.message,
          variant: "destructive",
        });
      }

      // Update local state with the new donor
      const newDonor: DonorInfo = {
        id: donor.id,
        name: donorData.name,
        age: donorData.age,
        location: donorData.location,
        bloodGroup: donorData.bloodGroup,
        rhFactor: donorData.rhFactor,
        isSmoker: donorData.isSmoker,
        isAlcoholConsumer: donorData.isAlcoholConsumer,
        smokingConsent: donorData.smokingConsent,
        alcoholConsent: donorData.alcoholConsent,
        donationDate: new Date().toISOString()
      };
      
      setDonors(prev => [...prev, newDonor]);

      // Update inventory state
      if (!inventoryError) {
        const newInventoryItem: InventoryItem = {
          donorId: donor.id,
          bloodGroup: donorData.bloodGroup,
          rhFactor: donorData.rhFactor,
          location: donorData.location,
          donationDate: new Date().toISOString(),
          expiryDate: getExpiryDate(new Date().toISOString())
        };
        
        setInventory(prev => [...prev, newInventoryItem]);
      }

      toast({
        title: "Donor Registration Successful",
        description: "Your donation information has been recorded",
      });

      return donor.id;
    } catch (error) {
      console.error("Error in addDonor:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return '';
    }
  };

  // Add a new recipient
  const addRecipient = (recipientData: Omit<RecipientInfo, "id" | "requestDate">) => {
    const id = generateId();
    const requestDate = new Date().toISOString().split('T')[0];
    
    const newRecipient: RecipientInfo = {
      ...recipientData,
      id,
      requestDate
    };
    
    setRecipients(prev => [...prev, newRecipient]);
    
    toast({
      title: "Recipient Registered",
      description: `Recipient ID: ${id} has been registered`,
      duration: 5000,
    });
    
    return id;
  };

  // Find matching donors using a simplified KNN algorithm
  const findMatchingDonors = (recipient: RecipientInfo): InventoryItem[] => {
    // Blood type compatibility matrix
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
    
    // Filter inventory based on blood type compatibility
    const compatibleInventory = inventory.filter(item => 
      compatibilityMatrix[recipient.bloodGroup].includes(item.bloodGroup)
    );
    
    // Sort by location proximity (simplified - exact match first)
    const sortedInventory = [...compatibleInventory].sort((a, b) => {
      // Exact location match gets highest priority
      if (a.location === recipient.location && b.location !== recipient.location) {
        return -1;
      }
      if (a.location !== recipient.location && b.location === recipient.location) {
        return 1;
      }
      
      // Exact blood type match gets next priority
      if (a.bloodGroup === recipient.bloodGroup && b.bloodGroup !== recipient.bloodGroup) {
        return -1;
      }
      if (a.bloodGroup !== recipient.bloodGroup && b.bloodGroup === recipient.bloodGroup) {
        return 1;
      }
      
      // Sort by donation date (fresher blood first)
      return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
    });
    
    return sortedInventory;
  };

  // Create a new transfusion event
  const createTransfusion = (donorId: string, recipientId: string, bloodGroup: BloodGroup, location: string) => {
    const id = generateId();
    const date = new Date().toISOString().split('T')[0];
    
    const newTransfusion: TransfusionEvent = {
      id,
      donorId,
      recipientId,
      status: "Pending",
      date,
      bloodGroup,
      location
    };
    
    setTransfusions(prev => [...prev, newTransfusion]);
    
    // Add to blockchain
    const newBlockchainRecord: BlockchainRecord = {
      blockId: generateId(),
      timestamp: new Date().toISOString(),
      donorId,
      recipientId,
      transactionType: "Transfusion",
      status: "Pending",
      bloodGroup,
      location
    };
    
    setBlockchain(prev => [newBlockchainRecord, ...prev]);
    
    toast({
      title: "Transfusion Initiated",
      description: `Transfusion ID: ${id} has been created`,
      duration: 5000,
    });
    
    return id;
  };

  // Update transfusion status
  const updateTransfusionStatus = (id: string, status: TransfusionStatus, notes?: string) => {
    setTransfusions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status, notes: notes || t.notes } 
          : t
      )
    );
    
    // If completed, remove from inventory
    if (status === "Completed") {
      const transfusion = transfusions.find(t => t.id === id);
      if (transfusion) {
        setInventory(prev => prev.filter(i => i.donorId !== transfusion.donorId));
        
        // Update blockchain
        const newBlockchainRecord: BlockchainRecord = {
          blockId: generateId(),
          timestamp: new Date().toISOString(),
          donorId: transfusion.donorId,
          recipientId: transfusion.recipientId,
          transactionType: "Transfusion",
          status: "Valid",
          bloodGroup: transfusion.bloodGroup,
          location: transfusion.location
        };
        
        setBlockchain(prev => [newBlockchainRecord, ...prev]);
      }
    }
    
    toast({
      title: "Transfusion Updated",
      description: `Transfusion status updated to: ${status}`,
      duration: 5000,
    });
  };

  // Verify blood unit in blockchain
  const verifyBloodUnit = (donorId: string): boolean => {
    // Find donation record
    const donationRecord = blockchain.find(
      record => 
        record.donorId === donorId && 
        record.transactionType === "Donation" &&
        record.status === "Valid"
    );
    
    // Find transfusion record
    const transfusionRecord = blockchain.find(
      record => 
        record.donorId === donorId && 
        record.transactionType === "Transfusion" &&
        record.status === "Valid"
    );
    
    // If there's a donation but no transfusion, the unit should still be in inventory
    const shouldBeInInventory = !!donationRecord && !transfusionRecord;
    
    // Check if it's actually in inventory
    const isInInventory = inventory.some(item => item.donorId === donorId);
    
    // Create verification record
    const newBlockchainRecord: BlockchainRecord = {
      blockId: generateId(),
      timestamp: new Date().toISOString(),
      donorId,
      transactionType: "Verification",
      status: shouldBeInInventory === isInInventory ? "Valid" : "Invalid",
      bloodGroup: donationRecord?.bloodGroup || "O+", // Fallback
      location: "System"
    };
    
    setBlockchain(prev => [newBlockchainRecord, ...prev]);
    
    return shouldBeInInventory === isInInventory;
  };

  // Search blockchain for records related to a donor ID
  const searchBlockchain = (donorId: string): BlockchainRecord[] => {
    return blockchain.filter(record => record.donorId === donorId);
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
        findMatchingDonors,
        createTransfusion,
        updateTransfusionStatus,
        verifyBloodUnit,
        searchBlockchain
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
