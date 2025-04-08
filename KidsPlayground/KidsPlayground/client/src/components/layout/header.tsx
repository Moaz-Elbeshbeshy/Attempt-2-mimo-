import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "@shared/schema";

interface HeaderProps {
  isRTL?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isRTL = true }) => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Check if user is logged in
  const { data: userData, isLoading } = useQuery<UserType | null, Error>({
    queryKey: ['/api/user'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false
  });
  
  // User data comes directly from the /api/user endpoint
  const isLoggedIn = !!userData;
  
  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setLocation('/');
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    },
  });
  
  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
  };
  
  const navLinks = [
    { title: "الرئيسية", path: "/" },
    { title: "الألعاب", path: "/games" },
    { title: "الاشتراك", path: "/subscription" },
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="flex items-center p-0 hover:bg-transparent"
            onClick={() => setLocation("/")}
          >
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold ml-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-primary-700">تعلم العربية</h1>
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.path}
              variant="ghost"
              className={`font-medium ${
                location === link.path
                  ? "text-primary-700 bg-primary-50"
                  : "text-gray-700 hover:text-primary-500"
              }`}
              onClick={() => setLocation(link.path)}
            >
              {link.title}
            </Button>
          ))}
        </nav>
        
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/profile")}
                className="flex items-center"
              >
                <User className="w-4 h-4 ml-1" />
                <span>{userData?.fullName || 'المستخدم'}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 ml-1" />
                <span>تسجيل الخروج</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost"
                onClick={() => setLocation("/auth")}
              >
                تسجيل الدخول
              </Button>
              <Button
                variant="default"
                onClick={() => setLocation("/auth?tab=register")}
              >
                إنشاء حساب
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                aria-label="القائمة"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "right" : "left"} className="w-[250px]">
              <div className="h-full flex flex-col">
                <div className="flex-1 mt-8 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Button
                      key={link.path}
                      variant="ghost"
                      className={`w-full justify-start ${
                        location === link.path 
                          ? "bg-primary-50 text-primary-700" 
                          : ""
                      }`}
                      onClick={() => {
                        setIsSheetOpen(false);
                        setLocation(link.path);
                      }}
                    >
                      {link.title}
                    </Button>
                  ))}
                </div>
                
                <div className="py-4 border-t">
                  {isLoggedIn ? (
                    <div className="flex flex-col gap-2 w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsSheetOpen(false);
                          setLocation("/profile");
                        }}
                      >
                        <User className="w-4 h-4 ml-2" />
                        <span>الملف الشخصي</span>
                      </Button>
                      <Button 
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 ml-2" />
                        <span>تسجيل الخروج</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsSheetOpen(false);
                          setLocation("/auth");
                        }}
                      >
                        تسجيل الدخول
                      </Button>
                      <Button
                        variant="default"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsSheetOpen(false);
                          setLocation("/auth?tab=register");
                        }}
                      >
                        إنشاء حساب
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
