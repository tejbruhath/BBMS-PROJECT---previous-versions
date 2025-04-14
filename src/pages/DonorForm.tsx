
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Copy, CheckCircle } from "lucide-react";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { BloodGroup, RhFactor } from "@/types/blood";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  location: z.string().min(2, "Location is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const),
  rhFactor: z.enum(["Positive", "Negative"] as const),
  isSmoker: z.boolean().default(false),
  isAlcoholConsumer: z.boolean().default(false),
  smokingConsent: z.boolean().default(false),
  alcoholConsent: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const DonorForm = () => {
  const { addDonor } = useBloodBank();
  const [donorId, setDonorId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      location: "",
      bloodGroup: "O+" as BloodGroup,
      rhFactor: "Positive" as RhFactor,
      isSmoker: false,
      isAlcoholConsumer: false,
      smokingConsent: false,
      alcoholConsent: false,
    },
  });
  
  const watchIsSmoker = form.watch("isSmoker");
  const watchIsAlcoholConsumer = form.watch("isAlcoholConsumer");
  
  const onSubmit = (data: FormData) => {
    // Validate consent checkboxes
    if (data.isSmoker && !data.smokingConsent) {
      form.setError("smokingConsent", {
        type: "manual",
        message: "You must confirm you haven't smoked in the last 4 hours",
      });
      return;
    }
    
    if (data.isAlcoholConsumer && !data.alcoholConsent) {
      form.setError("alcoholConsent", {
        type: "manual",
        message: "You must confirm you haven't consumed alcohol in the last 3 days",
      });
      return;
    }
    
    // Submit form and get donor ID
    const id = addDonor({
      name: data.name,
      age: data.age,
      location: data.location,
      bloodGroup: data.bloodGroup,
      rhFactor: data.rhFactor,
      isSmoker: data.isSmoker,
      isAlcoholConsumer: data.isAlcoholConsumer,
      smokingConsent: data.smokingConsent,
      alcoholConsent: data.alcoholConsent,
    });
    
    setDonorId(id);
    setShowDialog(true);
    
    // Reset form
    form.reset();
  };
  
  const copyToClipboard = () => {
    if (donorId) {
      navigator.clipboard.writeText(donorId);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "Donor ID has been copied to clipboard",
        duration: 3000,
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="border-t-4 border-t-red-600 shadow-sm">
        <CardHeader className="bg-red-50 bg-opacity-50">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-600" />
            <CardTitle>Donor Registration</CardTitle>
          </div>
          <CardDescription>Register as a blood donor and save lives</CardDescription>
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
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                        <Input type="number" placeholder="30" {...field} />
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
                    <FormLabel>Donation Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City Hospital" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the hospital or blood bank where you're donating
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isSmoker"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I am a smoker
                        </FormLabel>
                        <FormDescription>
                          Check this if you smoke cigarettes or use tobacco products
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {watchIsSmoker && (
                  <FormField
                    control={form.control}
                    name="smokingConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 ml-6 border-l-2 border-red-200 pl-4">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm I have not smoked in the last 4 hours
                          </FormLabel>
                          <FormDescription>
                            You must abstain from smoking for at least 4 hours before donation
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="isAlcoholConsumer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I consume alcohol
                        </FormLabel>
                        <FormDescription>
                          Check this if you drink alcoholic beverages
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {watchIsAlcoholConsumer && (
                  <FormField
                    control={form.control}
                    name="alcoholConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 ml-6 border-l-2 border-red-200 pl-4">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm I have not consumed alcohol in the last 3 days
                          </FormLabel>
                          <FormDescription>
                            You must abstain from alcohol for at least 3 days before donation
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Register as Donor
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank You for Your Donation!</DialogTitle>
            <DialogDescription>
              Your contribution will help save lives. Please keep your Donor ID for reference.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md flex items-center justify-between">
            <span className="font-mono text-lg">{donorId}</span>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={copyToClipboard}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy ID"}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonorForm;
