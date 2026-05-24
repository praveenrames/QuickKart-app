import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Lock, LogOut } from "lucide-react";
import UpdatePasswordModal from "../pages/Auth/UpdatePasswordModal";
import UpdateUserModal from "../pages/Auth/UpdateUserModal";
import { logoutUser } from "@/utils/api";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-foreground">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowUserModal(true)} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Update Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPasswordModal(true)} className="cursor-pointer">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={loading} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {loading ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdatePasswordModal open={showPasswordModal} onOpenChange={setShowPasswordModal} />
      <UpdateUserModal open={showUserModal} onOpenChange={setShowUserModal} />
    </>
  );
};

export default ProfileMenu;
