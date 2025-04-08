import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { EmailVerificationButton } from "@/components/email-verification-button";

const ProfilePage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if user is authenticated
  const { data: userData, isLoading, isError } = useQuery<{ user: any }>({
    queryKey: ['/api/auth/me'],
    enabled: !!localStorage.getItem('token'),
    retry: false
  });
  
  // Get user progress data
  const { data: progressData } = useQuery<{ progress: any[] }>({
    queryKey: ['/api/user-progress'],
    enabled: !!localStorage.getItem('token') && !!userData,
    retry: false
  });
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isLoading && (!userData || isError)) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول لعرض الملف الشخصي",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isLoading, userData, isError, navigate, toast]);
  
  const user = userData?.user;
  const progress = progressData?.progress || [];
  
  // Calculate subscription info
  const isSubscribed = user?.isSubscribed;
  const subscriptionEndDate = user?.subscriptionEndDate 
    ? new Date(user.subscriptionEndDate) 
    : null;
  const daysRemaining = subscriptionEndDate 
    ? Math.max(0, Math.ceil((subscriptionEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
    : 0;
  
  const subscriptionStatus = isSubscribed 
    ? subscriptionEndDate && daysRemaining > 0
      ? "نشط"
      : "منتهي" 
    : "غير مشترك";
  
  const statusColors = {
    "نشط": "bg-green-100 text-green-800",
    "منتهي": "bg-red-100 text-red-800",
    "غير مشترك": "bg-gray-100 text-gray-800"
  };
  
  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "تم تسجيل الخروج بنجاح"
      });
      navigate('/login');
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Loader className="h-8 w-8 animate-spin text-primary-500" />
            <p className="text-lg">جاري تحميل بيانات الملف الشخصي...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-center text-primary-800 mb-8">
            الملف الشخصي
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="subscription">الاشتراك</TabsTrigger>
                <TabsTrigger value="progress">تقدم التعلم</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>
                      عرض وتعديل معلومات حسابك الشخصي
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">الاسم الكامل</Label>
                        <Input
                          id="fullName"
                          value={user.fullName}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">اسم المستخدم</Label>
                        <Input
                          id="username"
                          value={user.username}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            value={user.email}
                            readOnly
                            className="flex-1"
                          />
                          {!user.isVerified && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              غير مُتحقق
                            </Badge>
                          )}
                        </div>
                        {!user.isVerified && (
                          <div className="mt-2">
                            <EmailVerificationButton />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                      <Button 
                        variant="destructive"
                        onClick={() => logout()}
                      >
                        تسجيل الخروج
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Subscription Tab */}
              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الاشتراك</CardTitle>
                    <CardDescription>
                      إدارة اشتراكك ومعلومات الدفع
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>حالة الاشتراك</Label>
                        <div>
                          <Badge className={statusColors[subscriptionStatus]}>
                            {subscriptionStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      {isSubscribed && subscriptionEndDate && (
                        <>
                          <div className="space-y-2">
                            <Label>نوع الاشتراك</Label>
                            <div className="text-lg font-medium">
                              {user.subscriptionTier}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>تاريخ انتهاء الاشتراك</Label>
                            <div className="text-lg font-medium">
                              {subscriptionEndDate.toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>المدة المتبقية</Label>
                            <div className="text-lg font-medium">
                              {daysRemaining} يوم
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {isSubscribed && subscriptionEndDate && (
                      <div className="mt-4">
                        <Label>المدة المتبقية للاشتراك</Label>
                        <div className="mt-2">
                          <Progress value={(daysRemaining / 30) * 100} className="h-2" />
                        </div>
                      </div>
                    )}
                    
                    {(!isSubscribed || (subscriptionEndDate && daysRemaining <= 7)) && (
                      <Alert className={!isSubscribed ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}>
                        <AlertTitle className={!isSubscribed ? "text-blue-800" : "text-yellow-800"}>
                          {!isSubscribed ? "اشترك الآن!" : "تنبيه: اشتراكك على وشك الانتهاء"}
                        </AlertTitle>
                        <AlertDescription className={!isSubscribed ? "text-blue-700" : "text-yellow-700"}>
                          {!isSubscribed 
                            ? "اشترك الآن للحصول على جميع ميزات المنصة." 
                            : `اشتراكك سينتهي خلال ${daysRemaining} يوم. جدد اشتراكك الآن لتجنب انقطاع الخدمة.`
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => navigate('/subscription')}
                        size="lg"
                        className="px-8"
                      >
                        {isSubscribed ? "إدارة الاشتراك" : "اشترك الآن"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Learning Progress Tab */}
              <TabsContent value="progress">
                <Card>
                  <CardHeader>
                    <CardTitle>تقدم التعلم</CardTitle>
                    <CardDescription>
                      متابعة تقدمك في الألعاب والأنشطة التعليمية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {progress.length > 0 ? (
                      <div className="space-y-6">
                        {progress.map((item: any, index: number) => {
                          // In a real app, you would map gameId to actual game names
                          const gameName = item.gameId === 1 
                            ? "تعلم الحروف" 
                            : item.gameId === 2 
                              ? "لعبة الكلمات" 
                              : item.gameId === 3 
                                ? "قصص تفاعلية" 
                                : `لعبة رقم ${item.gameId}`;
                          
                          // Parse completed levels
                          const completedLevels = JSON.parse(item.completedLevels);
                          const completionPercentage = completedLevels.lettersCompleted 
                            ? (completedLevels.lettersCompleted.length / completedLevels.totalLetters) * 100
                            : 0;
                          
                          return (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold">{gameName}</h3>
                                <Badge className="bg-primary-100 text-primary-800">
                                  النقاط: {item.score}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>نسبة الإكمال</span>
                                  <span>{Math.round(completionPercentage)}%</span>
                                </div>
                                <Progress value={completionPercentage} className="h-2" />
                              </div>
                              
                              <div className="mt-4 text-sm text-gray-500">
                                آخر لعب: {new Date(item.lastPlayed).toLocaleString('ar-SA')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          لم تبدأ أي ألعاب بعد
                        </h3>
                        <p className="text-gray-500 mb-4">
                          ابدأ باللعب لتتبع تقدمك في التعلم
                        </p>
                        <Button onClick={() => navigate('/games')}>
                          استكشف الألعاب
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
