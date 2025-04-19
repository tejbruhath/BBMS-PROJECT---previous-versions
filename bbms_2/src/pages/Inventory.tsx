
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropletIcon, Clock } from "lucide-react";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { BloodGroup, InventoryItem } from "@/types/blood";

const BloodInventorySummary = () => {
  const { inventory } = useBloodBank();
  
  const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const getCountByBloodGroup = (bloodGroup: BloodGroup) => {
    return inventory.filter(item => item.bloodGroup === bloodGroup).length;
  };
  
  const getBloodGroupBadgeColor = (count: number) => {
    if (count === 0) return "bg-gray-200 text-gray-700";
    if (count < 3) return "bg-red-100 text-red-800 border-red-200";
    if (count < 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {bloodGroups.map((group) => {
        const count = getCountByBloodGroup(group);
        return (
          <Card key={group} className="border-l-4" style={{ borderLeftColor: count === 0 ? '#d1d5db' : '#dc2626' }}>
            <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
              <div className="text-3xl font-bold">{group}</div>
              <Badge variant="outline" className={`${getBloodGroupBadgeColor(count)} px-3 py-1`}>
                {count} units
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
};

const Inventory = () => {
  const { inventory } = useBloodBank();
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get status based on days until expiry
  const getExpiryStatus = (expiryDate: string) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft < 0) return { label: "Expired", color: "text-red-600 bg-red-100" };
    if (daysLeft < 7) return { label: `${daysLeft} days left`, color: "text-amber-600 bg-amber-100" };
    return { label: `${daysLeft} days left`, color: "text-green-600 bg-green-100" };
  };
  
  // Sort inventory by donation date (most recent first)
  const sortedInventory = [...inventory].sort((a, b) => 
    new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
  );

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="border-b bg-blood-50">
          <div className="flex items-center space-x-2">
            <DropletIcon className="h-6 w-6 text-blood-600" />
            <CardTitle>Blood Inventory Management</CardTitle>
          </div>
          <CardDescription>
            Current blood units in storage and their details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Summary</h3>
          <BloodInventorySummary />
          
          <h3 className="text-lg font-semibold mb-4 mt-8">Available Blood Units</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor ID</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>RH Factor</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Donation Date</TableHead>
                  <TableHead>Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No blood units available in inventory
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInventory.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    return (
                      <TableRow key={item.donorId}>
                        <TableCell className="font-mono">{item.donorId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blood-50 text-blood-800 border-blood-200">
                            {item.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.rhFactor}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{new Date(item.donationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={expiryStatus.color}>
                            <Clock className="h-3 w-3 mr-1" />
                            {expiryStatus.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Total units in inventory: {inventory.length}</p>
            <p className="mt-1">Blood units typically expire 42 days after donation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
