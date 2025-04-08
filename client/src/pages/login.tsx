import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/login", { 
        username, 
        password 
      });
    },
    onSuccess: async (res) => {
      const data = await res.json();
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${data.user.fullName}`
      });
      
      // Redirect to home page
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تأكد من اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
      return;
    }
    
    mutate();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md px-4">
          <Card className="w-full">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
              <CardDescription>
                أدخل بيانات حسابك لتسجيل الدخول
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    placeholder="أدخل اسم المستخدم"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Link href="/forgot-password">
                      <a className="text-sm text-primary-500 hover:underline">
                        نسيت كلمة المرور؟
                      </a>
                    </Link>
                  </div>
                  <Input
                    id="password"
                    placeholder="أدخل كلمة المرور"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit" 
                  className="w-full mb-4"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري تسجيل الدخول...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="ml-2 h-4 w-4" />
                      تسجيل الدخول
                    </span>
                  )}
                </Button>
                
                <p className="text-sm text-center text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link href="/register">
                    <a className="text-primary-500 hover:underline">
                      سجل الآن
                    </a>
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
