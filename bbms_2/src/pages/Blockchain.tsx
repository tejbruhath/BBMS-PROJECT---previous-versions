
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, SearchIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { BlockchainRecord } from "@/types/blood";

const Blockchain = () => {
  const { blockchain, verifyBloodUnit, searchBlockchain } = useBloodBank();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BlockchainRecord[]>([]);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = searchBlockchain(searchQuery);
    setSearchResults(results);
    setVerificationResult(null);
  };
  
  // Handle verification
  const handleVerify = () => {
    if (!searchQuery.trim()) return;
    
    const result = verifyBloodUnit(searchQuery);
    setVerificationResult(result);
    
    // Also search to show records
    const results = searchBlockchain(searchQuery);
    setSearchResults(results);
  };
  
  // Get transaction type badge
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "Donation":
        return { color: "bg-green-100 text-green-800 border-green-200" };
      case "Transfusion":
        return { color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "Verification":
        return { color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "Expiry":
        return { color: "bg-amber-100 text-amber-800 border-amber-200" };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Valid":
        return { color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> };
      case "Invalid":
        return { color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="h-3 w-3 mr-1" /> };
      case "Pending":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Clock className="h-3 w-3 mr-1" /> };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: null };
    }
  };

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-purple-600" />
            <CardTitle>Blockchain Verification</CardTitle>
          </div>
          <CardDescription>
            Verify blood units and explore the blockchain ledger
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Blood Unit Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Donor ID</label>
                <Input 
                  placeholder="Enter donor ID to verify or search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleSearch} className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                Search Records
              </Button>
              <Button onClick={handleVerify} className="bg-purple-600 hover:bg-purple-700">
                Verify Unit
              </Button>
            </div>
            
            {verificationResult !== null && (
              <Alert variant={verificationResult ? "default" : "destructive"} className="mb-6">
                {verificationResult ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Verification Successful</AlertTitle>
                    <AlertDescription>
                      The blood unit with Donor ID {searchQuery} has been verified in the blockchain and matches the inventory status.
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                      The blood unit with Donor ID {searchQuery} could not be verified. There may be a discrepancy between the blockchain record and inventory.
                    </AlertDescription>
                  </>
                )}
              </Alert>
            )}
            
            {searchResults.length > 0 && (
              <div className="rounded-md border mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Block ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((record) => {
                      const typeBadge = getTransactionBadge(record.transactionType);
                      const statusBadge = getStatusBadge(record.status);
                      return (
                        <TableRow key={record.blockId}>
                          <TableCell className="font-mono">{record.blockId.substring(0, 6)}</TableCell>
                          <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={typeBadge.color}>
                              {record.transactionType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusBadge.color}>
                              <div className="flex items-center">
                                {statusBadge.icon}
                                {record.status}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>{record.bloodGroup}</TableCell>
                          <TableCell>{record.location}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md border mt-8">
              <h3 className="text-md font-semibold mb-2">About Blockchain Verification</h3>
              <p className="text-sm text-gray-600 mb-2">
                Our blockchain technology ensures that every blood unit is tracked from donation to transfusion, 
                providing an immutable record of the entire blood supply chain.
              </p>
              <p className="text-sm text-gray-600">
                Each transaction (donation, transfusion, verification) is recorded as a block in the chain, 
                ensuring transparency and preventing any unauthorized modifications.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Recent Blockchain Transactions</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Donor ID</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Blood Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blockchain.slice(0, 10).map((record) => {
                  const typeBadge = getTransactionBadge(record.transactionType);
                  const statusBadge = getStatusBadge(record.status);
                  return (
                    <TableRow key={record.blockId}>
                      <TableCell className="font-mono">{record.blockId.substring(0, 6)}</TableCell>
                      <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{record.donorId.substring(0, 6)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={typeBadge.color}>
                          {record.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusBadge.color}>
                          <div className="flex items-center">
                            {statusBadge.icon}
                            {record.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{record.bloodGroup}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-2 text-right">
            <span className="text-sm text-muted-foreground">
              Showing the 10 most recent transactions out of {blockchain.length} total records
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blockchain;
