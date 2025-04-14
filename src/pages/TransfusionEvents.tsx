
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Activity, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { TransfusionEvent, TransfusionStatus } from "@/types/blood";

const TransfusionEvents = () => {
  const { transfusions, updateTransfusionStatus } = useBloodBank();
  const [selectedTransfusion, setSelectedTransfusion] = useState<TransfusionEvent | null>(null);
  const [newStatus, setNewStatus] = useState<TransfusionStatus>("Completed");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  
  // Get transfusions by status
  const getTransfusionsByStatus = (status: TransfusionStatus) => {
    return transfusions.filter(t => t.status === status);
  };
  
  const pendingTransfusions = getTransfusionsByStatus("Pending");
  const completedTransfusions = getTransfusionsByStatus("Completed");
  const failedTransfusions = getTransfusionsByStatus("Failed");
  const requestingAdditionalTransfusions = getTransfusionsByStatus("Requesting Additional");
  
  // Handle update status
  const handleUpdateStatus = () => {
    if (selectedTransfusion) {
      updateTransfusionStatus(selectedTransfusion.id, newStatus, notes);
      setSelectedTransfusion(null);
      setNotes("");
      setOpen(false);
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: TransfusionStatus) => {
    switch (status) {
      case "Pending":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Clock className="h-3 w-3 mr-1" /> };
      case "Completed":
        return { color: "bg-green-100 text-green-800 border-green-200", icon: <CheckCircle className="h-3 w-3 mr-1" /> };
      case "Failed":
        return { color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="h-3 w-3 mr-1" /> };
      case "Requesting Additional":
        return { color: "bg-amber-100 text-amber-800 border-amber-200", icon: <AlertTriangle className="h-3 w-3 mr-1" /> };
    }
  };
  
  // Render transfusion table
  const renderTransfusionTable = (transfusionList: TransfusionEvent[]) => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Donor ID</TableHead>
              <TableHead>Recipient ID</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfusionList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No transfusion events found
                </TableCell>
              </TableRow>
            ) : (
              transfusionList.map((transfusion) => {
                const statusBadge = getStatusBadge(transfusion.status);
                return (
                  <TableRow key={transfusion.id}>
                    <TableCell className="font-mono">{transfusion.id.substring(0, 6)}</TableCell>
                    <TableCell className="font-mono">{transfusion.donorId.substring(0, 6)}</TableCell>
                    <TableCell className="font-mono">{transfusion.recipientId.substring(0, 6)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blood-50 text-blood-800 border-blood-200">
                        {transfusion.bloodGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>{transfusion.location}</TableCell>
                    <TableCell>{new Date(transfusion.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge.color}>
                        <div className="flex items-center">
                          {statusBadge.icon}
                          {transfusion.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transfusion.status === "Pending" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedTransfusion(transfusion);
                            setOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-green-600" />
            <CardTitle>Transfusion Events</CardTitle>
          </div>
          <CardDescription>
            Track and manage blood transfusion events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingTransfusions.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 bg-blue-600">
                    {pendingTransfusions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
              <TabsTrigger value="requesting">Requesting Additional</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Pending Transfusions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These transfusions have been initiated but not yet completed. Update their status as they progress.
                </p>
              </div>
              {renderTransfusionTable(pendingTransfusions)}
            </TabsContent>
            <TabsContent value="completed">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Completed Transfusions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Successfully completed transfusions. These blood units have been removed from inventory.
                </p>
              </div>
              {renderTransfusionTable(completedTransfusions)}
            </TabsContent>
            <TabsContent value="failed">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Failed Transfusions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Transfusions that could not be completed due to various reasons.
                </p>
              </div>
              {renderTransfusionTable(failedTransfusions)}
            </TabsContent>
            <TabsContent value="requesting">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Requesting Additional Units</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Transfusions that require additional blood units to complete.
                </p>
              </div>
              {renderTransfusionTable(requestingAdditionalTransfusions)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Transfusion Status</DialogTitle>
            <DialogDescription>
              Change the status of this transfusion and provide any additional notes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select
                value={newStatus}
                onValueChange={(value: TransfusionStatus) => setNewStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed Successfully</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Requesting Additional">Requesting Additional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                placeholder="Add any relevant notes about this status change"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransfusionEvents;
