import React from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function VerificationSuccessPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">تم التحقق بنجاح!</CardTitle>
            <CardDescription>
              لقد تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن الاستمتاع بالميزات الكاملة لمنصتنا.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              شكراً لتأكيد بريدك الإلكتروني. لقد تم تفعيل حسابك بالكامل الآن.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/profile")}
              className="px-8"
            >
              الذهاب للملف الشخصي
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
            >
              العودة للرئيسية
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}