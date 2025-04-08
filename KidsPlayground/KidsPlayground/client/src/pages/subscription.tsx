import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SubscriptionPlanCard from "@/components/subscription-plan";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, CreditCard, Info } from "lucide-react";
import Loader from "@/components/ui/loader";

const SubscriptionPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Check if user is authenticated
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/auth/me', refreshTrigger],
    enabled: !!localStorage.getItem('token'),
    retry: false
  });
  
  // Fetch subscription plans
  const { data: plansData, isLoading: isPlansLoading } = useQuery({
    queryKey: ['/api/subscription-plans'],
  });
  
  const isLoggedIn = !!userData?.user;
  const isSubscribed = isLoggedIn && userData.user.isSubscribed;
  const subscriptionPlans = plansData?.plans || [];
  
  const handleSubscriptionComplete = () => {
    // Refresh user data to show updated subscription status
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        {/* Page Header */}
        <section className="bg-primary-50 py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-primary-800">
              الاشتراك
            </h1>
            <p className="text-lg text-center max-w-2xl mx-auto text-gray-600">
              اختر الباقة المناسبة لك واستمتع بجميع الألعاب والأنشطة التعليمية
            </p>
          </div>
        </section>
        
        {/* Subscription Status */}
        {isLoggedIn && isSubscribed && (
          <section className="py-8">
            <div className="container mx-auto px-6">
              <Alert className="max-w-3xl mx-auto bg-green-50 border-green-200">
                <BadgeCheck className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-800 font-bold">
                  أنت مشترك حالياً
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  اشتراكك <strong>{userData.user.subscriptionTier}</strong> فعال حتى {' '}
                  <strong>
                    {new Date(userData.user.subscriptionEndDate).toLocaleDateString('ar-SA')}
                  </strong>
                  . استمتع بجميع ميزات المنصة!
                </AlertDescription>
              </Alert>
            </div>
          </section>
        )}
        
        {/* Subscription Plans */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {(isUserLoading || isPlansLoading) ? (
              <Loader size="lg" className="py-12" message="جاري تحميل خطط الاشتراك..." />
            ) : (
              <>
                {!isLoggedIn && (
                  <Alert className="max-w-3xl mx-auto mb-8">
                    <Info className="h-5 w-5" />
                    <AlertTitle>تنبيه</AlertTitle>
                    <AlertDescription>
                      يجب تسجيل الدخول أو إنشاء حساب للاشتراك في إحدى الباقات.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {subscriptionPlans.map((plan) => (
                    <SubscriptionPlanCard
                      key={plan.id}
                      plan={plan}
                      isLoggedIn={isLoggedIn}
                      onSubscribe={handleSubscriptionComplete}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
        
        {/* Subscription Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              مميزات الاشتراك
            </h2>
            
            <Tabs defaultValue="games" className="max-w-3xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="games">ألعاب تعليمية</TabsTrigger>
                <TabsTrigger value="tracking">متابعة التقدم</TabsTrigger>
                <TabsTrigger value="support">الدعم الفني</TabsTrigger>
              </TabsList>
              
              <TabsContent value="games">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg" 
                          alt="ألعاب تعليمية" 
                          className="rounded-lg object-cover h-full w-full"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold mb-3">ألعاب تعليمية متنوعة</h3>
                        <p className="text-gray-600 mb-4">
                          مع الاشتراك، يمكنك الوصول إلى مجموعة كاملة من الألعاب التعليمية المصممة خصيصًا لتعليم اللغة العربية للأطفال بطريقة ممتعة.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>تعلم الحروف والكلمات بطريقة تفاعلية</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>قصص تفاعلية مع أسئلة لتعزيز الفهم</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>ألعاب تعليمية لجميع الفئات العمرية</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>تحديثات مستمرة بمحتوى جديد</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tracking">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src="https://images.pexels.com/photos/4260477/pexels-photo-4260477.jpeg" 
                          alt="متابعة التقدم" 
                          className="rounded-lg object-cover h-full w-full"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold mb-3">متابعة تقدم الطفل</h3>
                        <p className="text-gray-600 mb-4">
                          تتيح لك منصتنا متابعة تقدم طفلك ومعرفة المهارات التي يتقنها والمجالات التي تحتاج إلى تحسين.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>تقارير تفصيلية عن أداء الطفل</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>متابعة المستوى في كل مهارة على حدة</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>توصيات مخصصة لتحسين نقاط الضعف</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>مقارنة التقدم مع الأطفال في نفس العمر</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="support">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img 
                          src="https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg" 
                          alt="الدعم الفني" 
                          className="rounded-lg object-cover h-full w-full"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-bold mb-3">دعم فني متميز</h3>
                        <p className="text-gray-600 mb-4">
                          نوفر دعمًا فنيًا متميزًا لجميع المشتركين، لمساعدتهم في استخدام المنصة بكفاءة.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>دعم فني سريع عبر البريد الإلكتروني</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>استشارات تعليمية للآباء والمعلمين</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>أولوية للمشتركين في الاستفسارات والدعم</span>
                          </li>
                          <li className="flex items-center">
                            <BadgeCheck className="h-5 w-5 text-primary-500 ml-2" />
                            <span>دعم على مدار الساعة للاشتراكات السنوية</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Payment Info */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <CreditCard className="h-8 w-8 text-primary-500 ml-3" />
                <h2 className="text-2xl font-bold">معلومات الدفع</h2>
              </div>
              <p className="mb-6 text-gray-600">
                نحن نستخدم طرق دفع آمنة ومشفرة لحماية معلوماتك المالية. جميع المعاملات آمنة ومحمية.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border rounded-lg flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                    alt="Visa" 
                    className="h-8" 
                  />
                </div>
                <div className="p-3 border rounded-lg flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                    alt="Mastercard" 
                    className="h-8" 
                  />
                </div>
                <div className="p-3 border rounded-lg flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                    alt="PayPal" 
                    className="h-8" 
                  />
                </div>
                <div className="p-3 border rounded-lg flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Amex_icon.svg" 
                    alt="American Express" 
                    className="h-8" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              الأسئلة الشائعة
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">هل يمكنني إلغاء الاشتراك في أي وقت؟</h3>
                  <p className="text-gray-600">
                    نعم، يمكنك إلغاء اشتراكك في أي وقت. سيظل اشتراكك فعالاً حتى نهاية الفترة المدفوعة.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">هل هناك فترة تجريبية مجانية؟</h3>
                  <p className="text-gray-600">
                    لا نوفر فترة تجريبية مجانية حالياً، ولكن يمكنك تجربة بعض الألعاب المجانية للتعرف على المنصة.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">كم عدد الأطفال الذين يمكنهم استخدام الاشتراك؟</h3>
                  <p className="text-gray-600">
                    يمكن لجميع أفراد الأسرة استخدام اشتراك واحد. يمكنك إنشاء ملفات شخصية لكل طفل لتتبع تقدمهم.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">هل يتم تجديد الاشتراك تلقائياً؟</h3>
                  <p className="text-gray-600">
                    نعم، يتم تجديد الاشتراك تلقائياً عند انتهائه. يمكنك إلغاء التجديد التلقائي من صفحة الملف الشخصي في أي وقت.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
