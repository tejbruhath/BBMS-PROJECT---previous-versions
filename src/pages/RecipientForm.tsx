import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBloodBank } from "@/contexts/BloodBankContext";
import { BloodGroup, RhFactor, RecipientInfo } from "@/types/blood";
import { Users } from "lucide-react";

const RecipientForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [rhFactor, setRhFactor] = useState<RhFactor>('Positive');
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High" | "Critical">('Low');
  const [recipientId, setRecipientId] = useState('');
  const [open, setOpen] = useState(false);
  const { addRecipient } = useBloodBank();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const newRecipient: Omit<RecipientInfo, "id" | "requestDate"> = {
      name: name || '',  // Ensure non-null value
      age: Number(age) || 0,  // Convert to number and ensure non-null
      location: location || '',
      bloodGroup: bloodGroup as BloodGroup || 'O+',
      rhFactor: rhFactor as RhFactor || 'Positive',
      urgency: urgency as "Low" | "Medium" | "High" | "Critical" || 'Low',
    };

    const recipientId = addRecipient(newRecipient);
    setRecipientId(recipientId);
    setOpen(true);
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-blood-50 to-blood-100">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blood-600" />
            <CardTitle>Recipient Registration</CardTitle>
          </div>
          <CardDescription>
            Register a new recipient for blood transfusion
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Recipient Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  id="age"
                  placeholder="Recipient Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                placeholder="Recipient Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={bloodGroup} onValueChange={(value: BloodGroup) => setBloodGroup(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rh Factor</Label>
                <RadioGroup defaultValue={rhFactor} onValueChange={(value: RhFactor) => setRhFactor(value)} className="flex space-x-2">
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="Positive" id="r1" />
                    <Label htmlFor="r1">Positive</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="Negative" id="r2" />
                    <Label htmlFor="r2">Negative</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={urgency} onValueChange={(value: "Low" | "Medium" | "High" | "Critical") => setUrgency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Register Recipient</Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recipient Registered</DialogTitle>
            <DialogDescription>
              Recipient has been successfully registered.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recipient ID</h3>
                <p className="text-muted-foreground">{recipientId}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipientForm;
