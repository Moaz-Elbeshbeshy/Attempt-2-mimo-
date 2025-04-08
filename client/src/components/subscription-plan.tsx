import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { parseFeatures } from "@/lib/arabic-utils";
import { type SubscriptionPlan } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isLoggedIn: boolean;
  onSubscribe: () => void;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  isLoggedIn,
  onSubscribe,
}) => {
  const { toast } = useToast();
  const features = parseFeatures(plan.features);
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Mocked payment details
      const paymentDetails = {
        cardNumber: "4111111111111111",
        expiryDate: "12/25",
        cvv: "123",
        name: "Test User",
      };
      
      return apiRequest("POST", "/api/subscribe", {
        planId: plan.id,
        paymentDetails,
      });
    },
    onSuccess: async (res) => {
      const data = await res.json();
      toast({
        title: "تم الاشتراك بنجاح",
        description: `اشتراكك ${data.subscription.plan} نشط حتى ${new Date(data.subscription.endDate).toLocaleDateString('ar')}`,
      });
      onSubscribe();
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من معالجة الاشتراك. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubscribe = () => {
    if (!isLoggedIn) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول أو إنشاء حساب للاشتراك",
        variant: "destructive",
      });
      return;
    }
    
    mutate();
  };
  
  // Calculate savings compared to monthly plan
  const calculateSavings = () => {
    if (plan.duration === 1) return null;
    
    const monthlyPrice = 30; // Price of monthly plan
    const totalMonthlyPrice = monthlyPrice * plan.duration;
    const savings = totalMonthlyPrice - plan.price;
    
    return savings > 0 ? savings : null;
  };
  
  const savings = calculateSavings();
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
      plan.popular ? "border-2 border-secondary-500 z-10 scale-105" : ""
    }`}>
      {plan.popular && (
        <div className="bg-secondary-500 text-white text-center py-1 text-sm font-bold">
          الأكثر شعبية
        </div>
      )}
      
      <CardHeader className={`${
        plan.duration === 1 
          ? "bg-primary-500 text-white" 
          : plan.duration === 6 
            ? "bg-secondary-500 text-white" 
            : "bg-accent-500 text-white"
      } text-center p-6`}>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className={`text-sm ${
          plan.duration === 1 
            ? "text-primary-100" 
            : plan.duration === 6 
              ? "text-secondary-100" 
              : "text-accent-100"
        }`}>
          {plan.duration === 1 
            ? "مناسب للتجربة" 
            : plan.duration === 6 
              ? "وفر 17% عن الاشتراك الشهري" 
              : "أفضل قيمة! وفر 17% عن الاشتراك الشهري"}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-gray-800">${plan.price}</span>
          <span className="text-gray-500">/{plan.duration === 1 ? "شهر" : plan.duration === 6 ? "6 أشهر" : "سنة"}</span>
          {savings && (
            <p className="text-sm text-green-600 mt-1">توفير ${savings}</p>
          )}
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-gray-600">
              <Check className="h-5 w-5 text-green-500 ml-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
          
          {plan.duration === 1 && (
            <>
              <li className="flex items-center text-gray-400">
                <X className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
                <span>تقارير متقدمة للأداء</span>
              </li>
              <li className="flex items-center text-gray-400">
                <X className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
                <span>بدون خصومات على المحتوى الإضافي</span>
              </li>
            </>
          )}
          
          {plan.duration === 6 && (
            <li className="flex items-center text-gray-400">
              <X className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
              <span>خصم 10% على المحتوى الإضافي</span>
            </li>
          )}
        </ul>
        
        <Button 
          className={`w-full py-6 ${
            plan.duration === 1 
              ? "bg-primary-500 hover:bg-primary-600" 
              : plan.duration === 6 
                ? "bg-secondary-500 hover:bg-secondary-600" 
                : "bg-accent-500 hover:bg-accent-600"
          }`}
          onClick={handleSubscribe}
          disabled={isPending}
        >
          {isPending ? "جاري المعالجة..." : "اشترك الآن"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanCard;
