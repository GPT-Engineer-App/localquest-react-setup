import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
});

const interestsOptions = [
  "Music",
  "Sports",
  "Art",
  "Technology",
  "Travel",
  "Food",
  "Fashion",
  "Photography",
  "Gaming",
  "Reading",
];

const Profile = () => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: interests, isLoading: interestsLoading } = useQuery({
    queryKey: ["interests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_interests")
        .select("interest");
      if (error) throw error;
      return data.map((item) => item.interest);
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("user_profiles")
        .update(data)
        .eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("profile");
      toast.success("Profile updated successfully");
      setEditMode(false);
    },
    onError: (error) => {
      toast.error(`Error updating profile: ${error.message}`);
    },
  });

  const updateInterests = useMutation({
    mutationFn: async (newInterests) => {
      const { error } = await supabase.from("user_interests").upsert(
        newInterests.map((interest) => ({
          user_id: profile.id,
          interest,
        })),
        { onConflict: ["user_id", "interest"] }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("interests");
      toast.success("Interests updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating interests: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    updateProfile.mutate(data);
  };

  const handleInterestChange = (interest) => {
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    updateInterests.mutate(newInterests);
  };

  if (profileLoading || interestsLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...register("full_name")}
                    className={errors.full_name ? "border-red-500" : ""}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    {...register("bio")}
                    className={errors.bio ? "border-red-500" : ""}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bio.message}
                    </p>
                  )}
                </div>
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="mb-2">
                  <strong>Full Name:</strong> {profile.full_name}
                </p>
                <p className="mb-4">
                  <strong>Bio:</strong> {profile.bio}
                </p>
                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {interestsOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={interests.includes(interest)}
                    onCheckedChange={() => handleInterestChange(interest)}
                  />
                  <label
                    htmlFor={interest}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;