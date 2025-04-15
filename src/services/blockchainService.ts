
import { BlockchainRecord } from "@/types/blood";

export const verifyBloodUnit = (donorId: string, blockchain: BlockchainRecord[]): boolean => {
  const donationRecord = blockchain.find(
    record => 
      record.donorId === donorId && 
      record.transactionType === "Donation" &&
      record.status === "Valid"
  );
  
  const transfusionRecord = blockchain.find(
    record => 
      record.donorId === donorId && 
      record.transactionType === "Transfusion" &&
      record.status === "Valid"
  );
  
  const shouldBeInInventory = !!donationRecord && !transfusionRecord;
  return shouldBeInInventory;
};

export const searchBlockchain = (donorId: string, blockchain: BlockchainRecord[]): BlockchainRecord[] => {
  return blockchain.filter(record => record.donorId === donorId);
};
