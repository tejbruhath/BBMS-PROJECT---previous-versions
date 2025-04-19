
import { BloodGroup, BlockchainRecord, DonorInfo, InventoryItem, RecipientInfo, RhFactor, TransfusionEvent } from "@/types/blood";

// Helper function to generate random IDs
export const generateId = () => Math.random().toString(36).substring(2, 10);

// Helper function to get a random blood group
export const getRandomBloodGroup = (): BloodGroup => {
  const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  return groups[Math.floor(Math.random() * groups.length)];
};

// Helper function to get a random RH factor
export const getRandomRhFactor = (): RhFactor => {
  return Math.random() > 0.5 ? "Positive" : "Negative";
};

// Helper function to get a random date within the last 30 days
export const getRandomRecentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split('T')[0];
};

// Helper function to get an expiry date (42 days after donation)
export const getExpiryDate = (donationDate: string) => {
  const date = new Date(donationDate);
  date.setDate(date.getDate() + 42); // Blood typically expires after 42 days
  return date.toISOString().split('T')[0];
};

// Generate mock donors
export const generateMockDonors = (count: number): DonorInfo[] => {
  const donors: DonorInfo[] = [];
  const locations = ["Memorial Hospital", "City Medical Center", "University Hospital", "Community Clinic", "Regional Medical Center"];
  
  for (let i = 0; i < count; i++) {
    const bloodGroup = getRandomBloodGroup();
    const rhFactor = getRandomRhFactor();
    const donationDate = getRandomRecentDate();
    
    donors.push({
      id: generateId(),
      name: `Donor ${i + 1}`,
      age: 20 + Math.floor(Math.random() * 40), // Age between 20 and 60
      location: locations[Math.floor(Math.random() * locations.length)],
      bloodGroup,
      rhFactor,
      isSmoker: Math.random() > 0.7,
      isAlcoholConsumer: Math.random() > 0.6,
      smokingConsent: true,
      alcoholConsent: true,
      donationDate
    });
  }
  
  return donors;
};

// Generate mock inventory based on donors
export const generateMockInventory = (donors: DonorInfo[]): InventoryItem[] => {
  return donors.map(donor => ({
    donorId: donor.id,
    bloodGroup: donor.bloodGroup,
    rhFactor: donor.rhFactor,
    location: donor.location,
    donationDate: donor.donationDate,
    expiryDate: getExpiryDate(donor.donationDate)
  }));
};

// Generate mock recipients
export const generateMockRecipients = (count: number): RecipientInfo[] => {
  const recipients: RecipientInfo[] = [];
  const locations = ["Memorial Hospital", "City Medical Center", "University Hospital", "Community Clinic", "Regional Medical Center"];
  const urgencyLevels: ("Low" | "Medium" | "High" | "Critical")[] = ["Low", "Medium", "High", "Critical"];
  
  for (let i = 0; i < count; i++) {
    recipients.push({
      id: generateId(),
      name: `Recipient ${i + 1}`,
      age: 20 + Math.floor(Math.random() * 60), // Age between 20 and 80
      location: locations[Math.floor(Math.random() * locations.length)],
      bloodGroup: getRandomBloodGroup(),
      rhFactor: getRandomRhFactor(),
      urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
      requestDate: getRandomRecentDate()
    });
  }
  
  return recipients;
};

// Generate mock transfusion events
export const generateMockTransfusions = (inventory: InventoryItem[], recipients: RecipientInfo[], count: number): TransfusionEvent[] => {
  const transfusions: TransfusionEvent[] = [];
  const statuses: ("Pending" | "Completed" | "Failed" | "Requesting Additional")[] = ["Pending", "Completed", "Failed", "Requesting Additional"];
  
  const min = Math.min(inventory.length, recipients.length, count);
  
  for (let i = 0; i < min; i++) {
    transfusions.push({
      id: generateId(),
      donorId: inventory[i].donorId,
      recipientId: recipients[i].id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: getRandomRecentDate(),
      bloodGroup: inventory[i].bloodGroup,
      location: recipients[i].location
    });
  }
  
  return transfusions;
};

// Generate mock blockchain records
export const generateMockBlockchain = (inventory: InventoryItem[], transfusions: TransfusionEvent[]): BlockchainRecord[] => {
  const blockchain: BlockchainRecord[] = [];
  
  // Add donation records
  inventory.forEach(item => {
    blockchain.push({
      blockId: generateId(),
      timestamp: new Date(item.donationDate).toISOString(),
      donorId: item.donorId,
      transactionType: "Donation",
      status: "Valid",
      bloodGroup: item.bloodGroup,
      location: item.location
    });
  });
  
  // Add transfusion records
  transfusions.forEach(event => {
    blockchain.push({
      blockId: generateId(),
      timestamp: new Date(event.date).toISOString(),
      donorId: event.donorId,
      recipientId: event.recipientId,
      transactionType: "Transfusion",
      status: event.status === "Completed" ? "Valid" : "Pending",
      bloodGroup: event.bloodGroup,
      location: event.location
    });
  });
  
  // Sort by timestamp
  blockchain.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return blockchain;
};
