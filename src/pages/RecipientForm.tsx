
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, AlertCircle, Check, MapPin } from "lucide-react";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { BloodGroup, InventoryItem, RecipientInfo, RhFactor } from "@/types/blood";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  location: z.string().min(2, "Location is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const),
  rhFactor: z.enum(["Positive", "Negative"] as const),
  urgency: z.enum(["Low", "Medium", "High", "Critical"] as const),
});

type FormData = z.infer<typeof formSchema>;

const RecipientForm = () => {
  const { addRecipient, findMatchingDonors, createTransfusion } = useBloodBank();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [matches, setMatches] = useState<InventoryItem[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      location: "",
      bloodGroup: "O+" as BloodGroup,
      rhFactor: "Positive" as RhFactor,
      urgency: "Medium",
    },
  });
  
  const onSubmit = (data: FormData) => {
    // Register recipient and get ID
    const id = addRecipient(data);
    setRecipientId(id);
    
    // Find matching donors
    const recipient: RecipientInfo = {
      ...data,
      id,
      requestDate: new Date().toISOString().split('T')[0]
    };
    
    const matchingDonors = findMatchingDonors(recipient);
    setMatches(matchingDonors);
    
    if (matchingDonors.length === 0) {
      toast({
        title: "No matches found",
        description: "Sorry, no matching blood units are currently available",
        variant: "destructive"
      });
    }
  };
  
  const handleSelectDonor = (donorId: string, bloodGroup: BloodGroup, location: string) => {
    if (!recipientId) return;
    
    // Create transfusion
    createTransfusion(donorId, recipientId, bloodGroup, location);
    
    toast({
      title: "Transfusion initiated",
      description: "Blood transfusion has been initiated successfully",
      variant: "default"
    });
    
    // Reset form and state
    form.reset();
    setRecipientId(null);
    setMatches([]);
  };
  
  const getCompatibilityLabel = (recipientBlood: BloodGroup, donorBlood: BloodGroup) => {
    if (recipientBlood === donorBlood) {
      return { label: "Ideal Match", color: "bg-green-100 text-green-800" };
    }
    return { label: "Compatible", color: "bg-blue-100 text-blue-800" };
  };
  
  const getLocationMatchLabel = (recipientLocation: string, donorLocation: string) => {
    if (recipientLocation === donorLocation) {
      return { label: "Same Location", color: "bg-purple-100 text-purple-800" };
    }
    return { label: "Different Location", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="border-t-4 border-t-indigo-600 shadow-sm mb-8">
        <CardHeader className="bg-indigo-50 bg-opacity-50">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-indigo-600" />
            <CardTitle>Recipient Registration</CardTitle>
          </div>
          <CardDescription>Register a patient who needs blood transfusion</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital/Clinic Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City Medical Center" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where the blood transfusion will take place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Blood Group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rhFactor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RH Factor</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select RH Factor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Positive">Positive</SelectItem>
                          <SelectItem value="Negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Alert variant="outline" className="bg-indigo-50 border-indigo-200">
                <AlertCircle className="h-4 w-4 text-indigo-600" />
                <AlertTitle>Finding Matches</AlertTitle>
                <AlertDescription>
                  Our KNN matching algorithm will find the best blood matches based on blood type compatibility,
                  location proximity, and freshness of donated blood.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Find Matching Donors
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {matches.length > 0 && (
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" /> 
              Matching Blood Units Found
            </CardTitle>
            <CardDescription>
              {matches.length} compatible blood units found. Select one to proceed with transfusion.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor ID</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Compatibility</TableHead>
                    <TableHead>Donation Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => {
                    const compatibility = getCompatibilityLabel(
                      form.getValues("bloodGroup"), 
                      match.bloodGroup
                    );
                    
                    const locationMatch = getLocationMatchLabel(
                      form.getValues("location"),
                      match.location
                    );
                    
                    return (
                      <TableRow key={match.donorId}>
                        <TableCell className="font-mono">{match.donorId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blood-50 text-blood-800 border-blood-200">
                            {match.bloodGroup}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            {match.location}
                          </div>
                          <Badge variant="outline" className={locationMatch.color + " mt-1 text-xs"}>
                            {locationMatch.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={compatibility.color}>
                            {compatibility.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(match.donationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => handleSelectDonor(match.donorId, match.bloodGroup, match.location)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipientForm;
