
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type RhFactor = "Positive" | "Negative";
export type TransfusionStatus = "Pending" | "Completed" | "Failed" | "Requesting Additional";

export interface DonorInfo {
  id: string;
  name: string;
  age: number;
  location: string;
  bloodGroup: BloodGroup;
  rhFactor: RhFactor;
  isSmoker: boolean;
  isAlcoholConsumer: boolean;
  smokingConsent: boolean;
  alcoholConsent: boolean;
  donationDate: string;
}

export interface InventoryItem {
  donorId: string;
  bloodGroup: BloodGroup;
  rhFactor: RhFactor;
  location: string;
  donationDate: string;
  expiryDate: string;
}

export interface RecipientInfo {
  id: string;
  name: string;
  age: number;
  location: string;
  bloodGroup: BloodGroup;
  rhFactor: RhFactor;
  urgency: "Low" | "Medium" | "High" | "Critical";
  requestDate: string;
}

export interface TransfusionEvent {
  id: string;
  donorId: string;
  recipientId: string;
  status: TransfusionStatus;
  date: string;
  bloodGroup: BloodGroup;
  location: string;
  notes?: string;
}

export interface BlockchainRecord {
  blockId: string;
  timestamp: string;
  donorId: string;
  recipientId?: string;
  transactionType: "Donation" | "Transfusion" | "Expiry" | "Verification";
  status: "Valid" | "Invalid" | "Pending";
  bloodGroup: BloodGroup;
  location: string;
}
