import { useState, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, LoginData, userRegistrationSchema, RegistrationData } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, setLocation] = useLocation();
  
  // Check URL for tab parameter to set active tab
  useEffect(() => {
    // Parse the current URL to check for tab parameter
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location]);

  // Login form
  const loginForm = useForm<LoginData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegistrationData) => {
    registerMutation.mutate(data);
  };

  // Redirect if user is already logged in
  // Only redirect if we're not in the middle of loading
  if (user && !loginMutation.isPending && !registerMutation.isPending) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forms */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
          <TabsList className="grid grid-cols-2 w-full mb-8">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">حساب جديد</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">مرحباً بك</CardTitle>
                <CardDescription className="text-center">
                  قم بتسجيل الدخول للوصول إلى حسابك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" autoComplete="current-password" />
                          </FormControl>
                          <div className="flex justify-end mt-1">
                            <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/forgot-password")}>
                              نسيت كلمة المرور؟
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري تسجيل الدخول...
                        </>
                      ) : (
                        "تسجيل الدخول"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => {
                    setActiveTab("register");
                    setLocation("/auth?tab=register", { replace: true });
                  }}
                >
                  ليس لديك حساب؟ سجل الآن
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">إنشاء حساب جديد</CardTitle>
                <CardDescription className="text-center">
                  قم بإدخال بياناتك لإنشاء حساب جديد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" autoComplete="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تأكيد كلمة المرور</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" autoComplete="new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري إنشاء الحساب...
                        </>
                      ) : (
                        "إنشاء حساب"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => {
                    setActiveTab("login");
                    setLocation("/auth", { replace: true });
                  }}
                >
                  لديك حساب بالفعل؟ سجل دخولك
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right side - Hero */}
      <div className="hidden md:block md:w-1/2 bg-primary/10">
        <div className="h-full flex flex-col justify-center items-center p-8 text-center">
          <h1 className="text-4xl font-bold mb-6 text-primary">ألف باتا</h1>
          <p className="text-xl mb-8">منصة تعليمية للأطفال لتعلم اللغة العربية</p>
          <div className="space-y-4 max-w-md text-right">
            <div className="flex items-start">
              <div className="mr-4">
                <h3 className="font-bold">تعلم الحروف</h3>
                <p>تعلم نطق الحروف العربية وكتابتها بطريقة ممتعة</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4">
                <h3 className="font-bold">تكوين الكلمات</h3>
                <p>ساعد طفلك على تكوين وفهم الكلمات العربية</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4">
                <h3 className="font-bold">قصص تفاعلية</h3>
                <p>استمتع بقراءة القصص العربية التفاعلية المناسبة للأطفال</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}