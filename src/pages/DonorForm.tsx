
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Copy, Heart, AlertCircle } from "lucide-react";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { BloodGroup, RhFactor } from "@/types/blood";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Must be at least 18 years old").max(65, "Must be under 65 years old"),
  location: z.string().min(2, "Location is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const),
  rhFactor: z.enum(["Positive", "Negative"] as const),
  isSmoker: z.boolean().optional(),
  isAlcoholConsumer: z.boolean().optional(),
  smokingConsent: z.boolean().optional(),
  alcoholConsent: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const DonorForm = () => {
  const { addDonor } = useBloodBank();
  const [showDialog, setShowDialog] = useState(false);
  const [donorId, setDonorId] = useState("");
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
  
  const { watch, setValue } = form;
  const isSmoker = watch("isSmoker");
  const isAlcoholConsumer = watch("isAlcoholConsumer");
  
  const onSubmit = (data: FormData) => {
    // Validate consents
    if (data.isSmoker && !data.smokingConsent) {
      form.setError("smokingConsent", { 
        message: "You must confirm you haven't smoked in the last 4 hours" 
      });
      return;
    }
    
    if (data.isAlcoholConsumer && !data.alcoholConsent) {
      form.setError("alcoholConsent", { 
        message: "You must confirm you haven't consumed alcohol in the last 3 days" 
      });
      return;
    }
    
    // Add donor and get ID
    const id = addDonor(data);
    setDonorId(id);
    setShowDialog(true);
    
    // Reset form
    form.reset();
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(donorId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="border-t-4 border-t-blood-600 shadow-sm">
        <CardHeader className="bg-blood-50 bg-opacity-50">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blood-600" />
            <CardTitle>Blood Donation Form</CardTitle>
          </div>
          <CardDescription>Fill out this form to register as a blood donor</CardDescription>
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
                        <Input type="number" placeholder="25" {...field} />
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
                      <Input placeholder="Memorial Hospital" {...field} />
                    </FormControl>
                    <FormDescription>
                      Usually a hospital or blood donation center
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isSmoker"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Are you a smoker?
                          </FormLabel>
                          <FormDescription>
                            Check this if you smoke tobacco products
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {isSmoker && (
                    <FormField
                      control={form.control}
                      name="smokingConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-orange-50">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I confirm I haven't smoked in the last 4 hours
                            </FormLabel>
                            <FormDescription>
                              Required for donation eligibility
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isAlcoholConsumer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Do you consume alcohol?
                          </FormLabel>
                          <FormDescription>
                            Check this if you consume alcoholic beverages
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {isAlcoholConsumer && (
                    <FormField
                      control={form.control}
                      name="alcoholConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-orange-50">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I confirm I haven't consumed alcohol in the last 3 days
                            </FormLabel>
                            <FormDescription>
                              Required for donation eligibility
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <Alert variant="outline" className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription>
                  By submitting this form, you agree to donate blood and confirm all provided information is accurate. 
                  You'll receive a donor ID which is important to keep for future reference.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" className="w-full bg-blood-600 hover:bg-blood-700">
                Submit Donation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thank You for Your Donation!</DialogTitle>
            <DialogDescription>
              Your contribution will help save lives. Please keep your donor ID for future reference.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-md">
            <span className="font-mono font-medium text-lg flex-1">{donorId}</span>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button className="bg-blood-600 hover:bg-blood-700" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonorForm;
