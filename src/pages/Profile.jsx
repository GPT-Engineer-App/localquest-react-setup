import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const profileSchema = z.object({
  displayName: z.string().min(2, "Full name must be at least 2 characters"),
  // Note: We can't update email directly with updateProfile, it requires email verification
  // photoURL can be added here if you want to allow users to set a profile picture
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
  const [interests, setInterests] = useState([]);
  const user = auth.currentUser;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({ displayName: user.displayName || "" });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      await updateProfile(auth.currentUser, data);
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

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleInterestChange = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
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
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    {...register("displayName")}
                    className={errors.displayName ? "border-red-500" : ""}
                  />
                  {errors.displayName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.displayName.message}
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
                  <strong>Full Name:</strong> {user.displayName || "Not set"}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user.email}
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