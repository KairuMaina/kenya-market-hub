
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Settings, Menu, UserPlus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserNav = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-0 shadow-xl" align="end">
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
            <Link to="/auth" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50">
            <Link to="/auth" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Get user display name from user metadata or email
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
          <Avatar className="h-8 w-8 border-2 border-gradient-to-r from-blue-300 to-purple-300">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-0 shadow-xl" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {/* Only show admin panel for gmaina424@gmail.com */}
        {user.email === 'gmaina424@gmail.com' && (
          <DropdownMenuItem asChild className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50">
            <Link to="/admin" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut} 
          className="flex items-center hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
