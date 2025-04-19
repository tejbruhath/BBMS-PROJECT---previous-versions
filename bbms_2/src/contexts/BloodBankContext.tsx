import React, { createContext, useContext, useState, useEffect } from "react";
import { BloodGroup, BlockchainRecord, DonorInfo, InventoryItem, RecipientInfo, TransfusionEvent, TransfusionStatus } from "@/types/blood";
import { toast } from "@/hooks/use-toast";

// API URL
const API_URL = 'http://localhost:5000/api';

interface BloodBankContextType {
  donors: DonorInfo[];
  inventory: InventoryItem[];
  recipients: RecipientInfo[];
  transfusions: TransfusionEvent[];
  blockchain: BlockchainRecord[];
  addDonor: (donor: Omit<DonorInfo, "id" | "donationDate">) => Promise<string>;
  addRecipient: (recipient: Omit<RecipientInfo, "id" | "requestDate">) => Promise<string>;
  findMatchingDonors: (recipient: RecipientInfo) => Promise<InventoryItem[]>;
  createTransfusion: (donorId: string, recipientId: string, bloodGroup: BloodGroup, location: string) => Promise<string>;
  updateTransfusionStatus: (id: string, status: TransfusionStatus, notes?: string) => Promise<void>;
  verifyBloodUnit: (donorId: string) => Promise<boolean>;
  searchBlockchain: (donorId: string) => Promise<BlockchainRecord[]>;
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<DonorInfo[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipients, setRecipients] = useState<RecipientInfo[]>([]);
  const [transfusions, setTransfusions] = useState<TransfusionEvent[]>([]);
  const [blockchain, setBlockchain] = useState<BlockchainRecord[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch donors
        const donorsResponse = await fetch(`${API_URL}/donors`);
        const donorsData = await donorsResponse.json();
        // Transform donor data to match frontend types
        const transformedDonors = donorsData.map((donor: any) => ({
          id: donor._id,
          name: donor.name,
          age: donor.age,
          location: donor.location,
          bloodGroup: donor.bloodGroup,
          rhFactor: donor.rhFactor,
          isSmoker: donor.isSmoker,
          isAlcoholConsumer: donor.isAlcoholConsumer,
          smokingConsent: donor.smokingConsent,
          alcoholConsent: donor.alcoholConsent,
          donationDate: donor.donationDate,
        }));
        setDonors(transformedDonors);

        // Fetch inventory
        const inventoryResponse = await fetch(`${API_URL}/inventory`);
        const inventoryData = await inventoryResponse.json();
        // Transform inventory data
        const transformedInventory = inventoryData.map((item: any) => ({
          donorId: item.donorId,
          bloodGroup: item.bloodGroup,
          rhFactor: item.rhFactor,
          location: item.location,
          donationDate: item.donationDate,
          expiryDate: item.expiryDate,
        }));
        setInventory(transformedInventory);

        // Fetch recipients
        const recipientsResponse = await fetch(`${API_URL}/recipients`);
        const recipientsData = await recipientsResponse.json();
        // Transform recipient data
        const transformedRecipients = recipientsData.map((recipient: any) => ({
          id: recipient._id,
          name: recipient.name,
          age: recipient.age,
          location: recipient.location,
          bloodGroup: recipient.bloodGroup,
          rhFactor: recipient.rhFactor,
          urgency: recipient.urgency,
          requestDate: recipient.requestDate,
        }));
        setRecipients(transformedRecipients);

        // Fetch transfusions
        const transfusionsResponse = await fetch(`${API_URL}/transfusions`);
        const transfusionsData = await transfusionsResponse.json();
        // Transform transfusion data
        const transformedTransfusions = transfusionsData.map((transfusion: any) => ({
          id: transfusion._id,
          donorId: transfusion.donorId?._id || transfusion.donorId,
          recipientId: transfusion.recipientId?._id || transfusion.recipientId,
          status: transfusion.status,
          date: transfusion.date,
          bloodGroup: transfusion.bloodGroup,
          location: transfusion.location,
          notes: transfusion.notes,
        }));
        setTransfusions(transformedTransfusions);

        // Fetch blockchain
        const blockchainResponse = await fetch(`${API_URL}/blockchain`);
        const blockchainData = await blockchainResponse.json();
        // Transform blockchain data
        const transformedBlockchain = blockchainData.map((record: any) => ({
          blockId: record.blockId,
          timestamp: record.timestamp,
          donorId: record.donorId?._id || record.donorId,
          recipientId: record.recipientId?._id || record.recipientId,
          transactionType: record.transactionType,
          status: record.status,
          bloodGroup: record.bloodGroup,
          location: record.location,
        }));
        setBlockchain(transformedBlockchain);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data from the server. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    fetchData();
  }, []);

  // Add a new donor
  const addDonor = async (donorData: Omit<DonorInfo, "id" | "donationDate">) => {
    try {
      const response = await fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData),
      });

      if (!response.ok) {
        throw new Error('Failed to add donor');
      }

      const donor = await response.json();
      
      // Transform the returned donor data
      const transformedDonor = {
        id: donor._id,
        name: donor.name,
        age: donor.age,
        location: donor.location,
        bloodGroup: donor.bloodGroup,
        rhFactor: donor.rhFactor,
        isSmoker: donor.isSmoker,
        isAlcoholConsumer: donor.isAlcoholConsumer,
        smokingConsent: donor.smokingConsent,
        alcoholConsent: donor.alcoholConsent,
        donationDate: donor.donationDate,
      };
      
      // Update local state
      setDonors(prev => [...prev, transformedDonor]);
      
      // Fetch updated inventory
      const inventoryResponse = await fetch(`${API_URL}/inventory`);
      const inventoryData = await inventoryResponse.json();
      const transformedInventory = inventoryData.map((item: any) => ({
        donorId: item.donorId,
        bloodGroup: item.bloodGroup,
        rhFactor: item.rhFactor,
        location: item.location,
        donationDate: item.donationDate,
        expiryDate: item.expiryDate,
      }));
      setInventory(transformedInventory);
      
      // Fetch updated blockchain
      const blockchainResponse = await fetch(`${API_URL}/blockchain`);
      const blockchainData = await blockchainResponse.json();
      const transformedBlockchain = blockchainData.map((record: any) => ({
        blockId: record.blockId,
        timestamp: record.timestamp,
        donorId: record.donorId?._id || record.donorId,
        recipientId: record.recipientId?._id || record.recipientId,
        transactionType: record.transactionType,
        status: record.status,
        bloodGroup: record.bloodGroup,
        location: record.location,
      }));
      setBlockchain(transformedBlockchain);
      
      toast({
        title: "Donation Successful",
        description: `Donor ID: ${donor._id} has been registered`,
        duration: 5000,
      });
      
      return donor._id;
    } catch (error) {
      console.error('Error adding donor:', error);
      toast({
        title: "Error",
        description: "Failed to add donor. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  // Add a new recipient
  const addRecipient = async (recipientData: Omit<RecipientInfo, "id" | "requestDate">) => {
    try {
      const response = await fetch(`${API_URL}/recipients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientData),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipient');
      }

      const recipient = await response.json();
      
      // Transform the returned recipient data
      const transformedRecipient = {
        id: recipient._id,
        name: recipient.name,
        age: recipient.age,
        location: recipient.location,
        bloodGroup: recipient.bloodGroup,
        rhFactor: recipient.rhFactor,
        urgency: recipient.urgency,
        requestDate: recipient.requestDate,
      };
      
      // Update local state
      setRecipients(prev => [...prev, transformedRecipient]);
      
      toast({
        title: "Recipient Registered",
        description: `Recipient ID: ${recipient._id} has been registered`,
        duration: 5000,
      });
      
      return recipient._id;
    } catch (error) {
      console.error('Error adding recipient:', error);
      toast({
        title: "Error",
        description: "Failed to add recipient. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  // Find matching donors for a recipient
  const findMatchingDonors = async (recipient: RecipientInfo): Promise<InventoryItem[]> => {
    try {
      const response = await fetch(`${API_URL}/recipients/${recipient.id}/matches`);
      
      if (!response.ok) {
        throw new Error('Failed to find matching donors');
      }

      const matchingDonors = await response.json();
      return matchingDonors;
    } catch (error) {
      console.error('Error finding matching donors:', error);
      toast({
        title: "Error",
        description: "Failed to find matching donors. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      return [];
    }
  };

  // Create a new transfusion
  const createTransfusion = async (donorId: string, recipientId: string, bloodGroup: BloodGroup, location: string) => {
    try {
      const response = await fetch(`${API_URL}/transfusions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId,
          recipientId,
          bloodGroup,
          location
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create transfusion');
      }

      const transfusion = await response.json();
      
      // Transform the returned transfusion data
      const transformedTransfusion = {
        id: transfusion._id,
        donorId: transfusion.donorId?._id || transfusion.donorId,
        recipientId: transfusion.recipientId?._id || transfusion.recipientId,
        status: transfusion.status,
        date: transfusion.date,
        bloodGroup: transfusion.bloodGroup,
        location: transfusion.location,
        notes: transfusion.notes,
      };
      
      // Update local state
      setTransfusions(prev => [...prev, transformedTransfusion]);
      
      // Fetch updated blockchain
      const blockchainResponse = await fetch(`${API_URL}/blockchain`);
      const blockchainData = await blockchainResponse.json();
      const transformedBlockchain = blockchainData.map((record: any) => ({
        blockId: record.blockId,
        timestamp: record.timestamp,
        donorId: record.donorId?._id || record.donorId,
        recipientId: record.recipientId?._id || record.recipientId,
        transactionType: record.transactionType,
        status: record.status,
        bloodGroup: record.bloodGroup,
        location: record.location,
      }));
      setBlockchain(transformedBlockchain);
      
      toast({
        title: "Transfusion Created",
        description: `Transfusion ID: ${transfusion._id} has been created`,
        duration: 5000,
      });
      
      return transfusion._id;
    } catch (error) {
      console.error('Error creating transfusion:', error);
      toast({
        title: "Error",
        description: "Failed to create transfusion. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  // Update transfusion status
  const updateTransfusionStatus = async (id: string, status: TransfusionStatus, notes?: string) => {
    try {
      const response = await fetch(`${API_URL}/transfusions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transfusion status');
      }

      const updatedTransfusion = await response.json();
      
      // Transform the returned transfusion data
      const transformedTransfusion = {
        id: updatedTransfusion._id,
        donorId: updatedTransfusion.donorId?._id || updatedTransfusion.donorId,
        recipientId: updatedTransfusion.recipientId?._id || updatedTransfusion.recipientId,
        status: updatedTransfusion.status,
        date: updatedTransfusion.date,
        bloodGroup: updatedTransfusion.bloodGroup,
        location: updatedTransfusion.location,
        notes: updatedTransfusion.notes,
      };
      
      // Update local state
      setTransfusions(prev => 
        prev.map(t => t.id === id ? transformedTransfusion : t)
      );
      
      // If completed, update inventory
      if (status === 'Completed') {
        // Fetch updated inventory
        const inventoryResponse = await fetch(`${API_URL}/inventory`);
        const inventoryData = await inventoryResponse.json();
        const transformedInventory = inventoryData.map((item: any) => ({
          donorId: item.donorId,
          bloodGroup: item.bloodGroup,
          rhFactor: item.rhFactor,
          location: item.location,
          donationDate: item.donationDate,
          expiryDate: item.expiryDate,
        }));
        setInventory(transformedInventory);
      }
      
      // Fetch updated blockchain
      const blockchainResponse = await fetch(`${API_URL}/blockchain`);
      const blockchainData = await blockchainResponse.json();
      const transformedBlockchain = blockchainData.map((record: any) => ({
        blockId: record.blockId,
        timestamp: record.timestamp,
        donorId: record.donorId?._id || record.donorId,
        recipientId: record.recipientId?._id || record.recipientId,
        transactionType: record.transactionType,
        status: record.status,
        bloodGroup: record.bloodGroup,
        location: record.location,
      }));
      setBlockchain(transformedBlockchain);
      
      toast({
        title: "Status Updated",
        description: `Transfusion status has been updated to ${status}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error updating transfusion status:', error);
      toast({
        title: "Error",
        description: "Failed to update transfusion status. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Verify blood unit in blockchain
  const verifyBloodUnit = async (donorId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/blockchain/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ donorId }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify blood unit');
      }

      const result = await response.json();
      
      // Fetch updated blockchain
      const blockchainResponse = await fetch(`${API_URL}/blockchain`);
      const blockchainData = await blockchainResponse.json();
      setBlockchain(blockchainData);
      
      return result.verified;
    } catch (error) {
      console.error('Error verifying blood unit:', error);
      toast({
        title: "Error",
        description: "Failed to verify blood unit. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }
  };

  // Search blockchain for records related to a donor ID
  const searchBlockchain = async (donorId: string): Promise<BlockchainRecord[]> => {
    try {
      const response = await fetch(`${API_URL}/blockchain/donor/${donorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to search blockchain');
      }

      const blockchainRecords = await response.json();
      
      // Transform the blockchain records
      const transformedRecords = blockchainRecords.map((record: any) => ({
        blockId: record.blockId,
        timestamp: record.timestamp,
        donorId: record.donorId?._id || record.donorId,
        recipientId: record.recipientId?._id || record.recipientId,
        transactionType: record.transactionType,
        status: record.status,
        bloodGroup: record.bloodGroup,
        location: record.location,
      }));
      
      return transformedRecords;
    } catch (error) {
      console.error('Error searching blockchain:', error);
      toast({
        title: "Error",
        description: "Failed to search blockchain records. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      return [];
    }
  };

  return (
    <BloodBankContext.Provider value={{
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
    }}>
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBank = () => {
  const context = useContext(BloodBankContext);
  if (context === undefined) {
    throw new Error('useBloodBank must be used within a BloodBankProvider');
  }
  return context;
};
