
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export default function AvatarUpload({ 
  url, 
  onUpload,
  size = "lg" 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map size to pixel values
  const sizeMap = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32"
  };
  
  // Generate initials for fallback
  const getInitials = () => {
    if (!user) return "U";
    return ((user.email || "")
      .charAt(0) || "").toUpperCase();
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      // Create a proper folder structure that matches the RLS policy
      const filePath = `${user!.id}/${Math.random()}.${fileExt}`;

      console.log('Uploading file to path:', filePath);

      // Upload file to storage
      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type,
          cacheControl: "3600"
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      console.log('Public URL:', data.publicUrl);

      onUpload(data.publicUrl);
      
      toast("Avatar updated successfully!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast("Error uploading avatar", {
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className={`${sizeMap[size]} cursor-pointer`} onClick={() => fileInputRef.current?.click()}>
        <AvatarImage src={url || undefined} alt="Avatar" />
        <AvatarFallback className="bg-primary/10">
          {url ? (
            <span className="animate-pulse">...</span>
          ) : (
            <div className="flex flex-col items-center">
              <User />
              <span className="text-xs">{getInitials()}</span>
            </div>
          )}
        </AvatarFallback>
      </Avatar>

      <div>
        <input
          style={{ display: "none" }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          ref={fileInputRef}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "Change Avatar"}
        </Button>
      </div>
    </div>
  );
}
