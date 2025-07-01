
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMood } from "@/context/MoodContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarUpload from "@/components/AvatarUpload";
import { Smile, Cloud, Frown, AlertCircle, Trash2, UserX } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import DOMPurify from "dompurify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  
  const { user, deleteAccount } = useAuth();
  const { mood, setMood } = useMood();
  const { theme, setTheme } = useTheme();
  
  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setFullName(profileData.full_name || "");
        setAvatarUrl(profileData.avatar_url || "");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast('Error loading your profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const sanitizedFullName = DOMPurify.sanitize(fullName);
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: sanitizedFullName, avatar_url: avatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      toast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const deleteFullName = async () => {
    if (!user) return;

    try {
      setDeleteLoading(true);
      
      const { error } = await supabase.functions.invoke('delete-user-data', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setFullName("");
      toast("Full name deleted successfully!");
    } catch (error) {
      console.error("Error deleting full name:", error);
      toast('Error deleting full name.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteAccountLoading(true);
      await deleteAccount();
      toast("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast('Error deleting account. Please try again.');
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  const getMoodIcon = () => {
    switch (mood) {
      case 'happy':
        return <Smile className="h-6 w-6 text-green-500" />;
      case 'sad':
        return <Frown className="h-6 w-6 text-blue-500" />;
      case 'angry':
        return <AlertCircle className="h-6 w-6 text-orange-500" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <AvatarUpload
              url={avatarUrl}
              onUpload={setAvatarUrl}
              size="lg"
            />
            
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">Full Name</Label>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Name
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Full Name</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your full name from our database. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deleteFullName}
                          disabled={deleteLoading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mood & Appearance</CardTitle>
          <CardDescription>Personalize your experience based on your mood.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="mood">Current Mood</Label>
              <div>{getMoodIcon()}</div>
            </div>
            <Select 
              value={mood} 
              onValueChange={(value) => setMood(value as any)}
            >
              <SelectTrigger id="mood">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">
                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 mr-2" />
                    <span>Neutral</span>
                  </div>
                </SelectItem>
                <SelectItem value="happy">
                  <div className="flex items-center">
                    <Smile className="h-4 w-4 mr-2 text-green-500" />
                    <span>Happy</span>
                  </div>
                </SelectItem>
                <SelectItem value="sad">
                  <div className="flex items-center">
                    <Frown className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Sad</span>
                  </div>
                </SelectItem>
                <SelectItem value="angry">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Angry</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Your app's appearance will change based on your mood.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="theme">App Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
                disabled={deleteAccountLoading}
              >
                <UserX className="h-4 w-4 mr-2" />
                {deleteAccountLoading ? "Deleting Account..." : "Delete My Account"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your entire account and all associated data including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your profile information</li>
                    <li>All chat history</li>
                    <li>Settings and preferences</li>
                    <li>Statistics and progress data</li>
                  </ul>
                  <br />
                  <strong>This action cannot be undone.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteAccountLoading ? "Deleting..." : "Yes, Delete My Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
