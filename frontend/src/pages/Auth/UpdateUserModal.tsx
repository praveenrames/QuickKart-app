import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserDetails, fetchUser } from "@/utils/api";

interface UpdateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateUserModal = ({ open, onOpenChange }: UpdateUserModalProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile: String(user.mobile || ""),
      });
      setIsEditing(false);
    }
  }, [user, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      toast({ description: "All fields are required", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\D/g, ""))) {
      toast({ description: "Please enter a valid 10-digit mobile number", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        mobile: formData.mobile,
      };

      await updateUserDetails(payload);
      toast({ description: "Profile updated successfully" });
      setIsEditing(false);
      onOpenChange(false);
    } catch (err: any) {
      toast({
        description: err?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit your profile information" : "View your profile information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                name="firstname"
                placeholder="First name"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                name="lastname"
                placeholder="Last name"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              placeholder="Mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
