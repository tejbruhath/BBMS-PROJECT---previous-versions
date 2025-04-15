
import { supabase } from "@/integrations/supabase/client";
import { DonorInfo } from "@/types/blood";
import { toast } from "@/hooks/use-toast";
import { getExpiryDate } from "./mockData";

export const addDonor = async (donorData: Omit<DonorInfo, "id" | "donationDate">) => {
  try {
    const supabaseDonorData = {
      name: donorData.name,
      age: donorData.age,
      location: donorData.location,
      blood_group: donorData.bloodGroup,
      rh_factor: donorData.rhFactor,
      is_smoker: donorData.isSmoker,
      is_alcohol_consumer: donorData.isAlcoholConsumer,
      smoking_consent: donorData.smokingConsent,
      alcohol_consent: donorData.alcoholConsent
    };

    const { data: donor, error: donorError } = await supabase
      .from('donors')
      .insert([supabaseDonorData])
      .select()
      .single();

    if (donorError) {
      console.error('Error adding donor:', donorError);
      toast({
        title: "Error",
        description: "Failed to register donor: " + donorError.message,
        variant: "destructive",
      });
      return '';
    }

    const inventoryItem = {
      donor_id: donor.id,
      blood_group: donorData.bloodGroup,
      rh_factor: donorData.rhFactor,
      location: donorData.location,
      donation_date: new Date().toISOString(),
      expiry_date: getExpiryDate(new Date().toISOString()),
      status: 'Available'
    };

    const { error: inventoryError } = await supabase
      .from('blood_inventory')
      .insert([inventoryItem]);

    if (inventoryError) {
      console.error('Error adding to inventory:', inventoryError);
      toast({
        title: "Warning",
        description: "Donor registered but failed to add to inventory: " + inventoryError.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Donor Registration Successful",
      description: "Your donation information has been recorded",
    });

    return donor.id;
  } catch (error) {
    console.error("Error in addDonor:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return '';
  }
};
