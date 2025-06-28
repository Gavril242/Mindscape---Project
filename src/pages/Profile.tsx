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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarUpload from "@/components/AvatarUpload";
import { Smile, Cloud, Frown, AlertCircle } from "lucide-react";
import DOMPurify from "dompurify";

// Define the NotificationPreferences type
interface NotificationPreferences {
  daily_reminder: boolean;
  weekly_report: boolean;
  mood_suggestions?: boolean;
}

const Profile = () => {
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState("system");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { mood, setMood } = useMood();
  
  // Update the type for notificationPreferences
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    daily_reminder: true,
    weekly_report: true,
    mood_suggestions: false
  });
  
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
  
  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        if (data.theme) setTheme(data.theme);
        if (data.reminder_time) setReminderTime(data.reminder_time);
        
        // Handle notification preferences with proper type conversion
        if (data.notification_preferences) {
          try {
            // Safely parse/cast the notification preferences
            const preferences = data.notification_preferences as any;
            setNotificationPreferences({
              daily_reminder: preferences.daily_reminder ?? true,
              weekly_report: preferences.weekly_report ?? true,
              mood_suggestions: preferences.mood_suggestions ?? false
            });
          } catch (e) {
            console.error("Error parsing notification preferences:", e);
            // Set default values if parsing fails
            setNotificationPreferences({
              daily_reminder: true,
              weekly_report: true,
              mood_suggestions: false
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast('Error loading your settings');
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchSettings();
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
  
  const updateSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: theme,
          reminder_time: reminderTime,
          notification_preferences: notificationPreferences as any,
        }, { onConflict: 'user_id' });
        
      if (error) throw error;
      
      toast("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast('Error updating settings.');
    } finally {
      setLoading(false);
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
                <Label htmlFor="name">Full Name</Label>
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
          
          <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="moodSuggestions">Mood Suggestions</Label>
              <p className="text-sm text-muted-foreground">
                Receive suggestions to update your mood.
              </p>
            </div>
            <Switch
              id="moodSuggestions"
              checked={notificationPreferences.mood_suggestions ?? false}
              onCheckedChange={(checked) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  mood_suggestions: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="reminderTime">Daily Reminder Time</Label>
            <Input
              type="time"
              id="reminderTime"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="daily">Daily Reminder</Label>
              <p className="text-sm text-muted-foreground">
                Receive a daily notification.
              </p>
            </div>
            <Switch
              id="daily"
              checked={notificationPreferences.daily_reminder}
              onCheckedChange={(checked) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  daily_reminder: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="weekly">Weekly Report</Label>
              <p className="text-sm text-muted-foreground">
                Get a summary of your progress every week.
              </p>
            </div>
            <Switch
              id="weekly"
              checked={notificationPreferences.weekly_report}
              onCheckedChange={(checked) =>
                setNotificationPreferences({
                  ...notificationPreferences,
                  weekly_report: checked,
                })
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={updateSettings} disabled={loading}>
            {loading ? "Updating..." : "Update Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
