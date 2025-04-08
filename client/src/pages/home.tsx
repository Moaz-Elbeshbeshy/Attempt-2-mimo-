import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import GameCard from "@/components/game-card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Loader from "@/components/ui/loader";
import { BookOpen, Award, Tablet, LineChart, Gift, School } from "lucide-react";

const Home: React.FC = () => {
  // Fetch featured games
  const { data: featuredGamesData, isLoading } = useQuery({
    queryKey: ['/api/games/featured'],
  });

  const featuredGames = featuredGamesData?.games || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative cloud-bg py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-right mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                أ ب ت
              </h1>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">
                تعلم العربية للأطفال
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                المتعة والمرح في تعلم العربية
              </p>
              <Link href="/games">
                <div className="btn-primary inline-block">
                  هيا نتعلم
                </div>
              </Link>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="relative">
                <div className="floating">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4677/4677496.png"
                    alt="Robot Teacher"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkered border */}
        <div className="checkered-border mt-10"></div>
      </section>

      {/* What We Offer */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="page-title mb-8">ماذا نقدم؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="kid-card">
              <div className="flex justify-center mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677496.png"
                  alt="ألعاب تعليمية"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                ألعاب تعليمية
              </h3>
              <p className="text-gray-600 text-center">
                ألعاب تفاعلية مصممة خصيصًا لتعليم الأطفال الحروف والكلمات والجمل باللغة العربية
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="kid-card">
              <div className="flex justify-center mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677485.png"
                  alt="حروف وكلمات وجمل"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                حروف وكلمات وجمل
              </h3>
              <p className="text-gray-600 text-center">
                تعلم نطق الحروف العربية، وتكوين الكلمات، وبناء جمل بسيطة بطريقة ممتعة
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="kid-card">
              <div className="flex justify-center mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677443.png"
                  alt="قصص تعليمية"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                قصص تعليمية
              </h3>
              <p className="text-gray-600 text-center">
                قصص تفاعلية مصورة تساعد الأطفال على فهم وممارسة ما تعلموه بطريقة ممتعة
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="kid-card">
              <div className="flex justify-center mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677437.png"
                  alt="تمارين تطبيقية"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                تمارين تطبيقية
              </h3>
              <p className="text-gray-600 text-center">
                تمارين متنوعة لقياس مدى فهم وإتقان الطفل للمفاهيم التي تعلمها
              </p>
            </div>
            
            {/* Card 5 */}
            <div className="kid-card">
              <div className="flex justify-center mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677562.png"
                  alt="قواعد نحوية"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                قواعد نحوية
              </h3>
              <p className="text-gray-600 text-center">
                شرح مبسط للقواعد النحوية الأساسية باستخدام أمثلة ورسومات توضيحية
              </p>
            </div>
            
            {/* Card 6 */}
            <div className="kid-card">
              <div className="flex justify-center mb-6">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677447.png"
                  alt="اختبار الفهم"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                اختبار الفهم
              </h3>
              <p className="text-gray-600 text-center">
                اختبارات متنوعة لقياس مستوى الفهم والاستيعاب لدى الطفل
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkered border */}
      <div className="checkered-border"></div>

      {/* Section: أ ب ت للمدارس */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4677/4677590.png"
                alt="Robot Teacher with School"
                className="w-56 h-56 mx-auto"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-primary mb-6">أ ب ت للمدارس</h2>
              <p className="text-lg text-gray-600 mb-4">
                نوفر في أ ب ت منصة تعليمية خاصة بالمدارس تساعد المعلمين على تدريس اللغة العربية للطلاب بطريقة ممتعة وتفاعلية.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                المنصة مزودة بأدوات متكاملة لإدارة الفصول ومتابعة تقدم الطلاب وتقييم مستوياتهم.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <School className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">إدارة الفصول التعليمية</span>
                </div>
                
                <div className="flex items-center bg-green-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">محتوى متخصص للمعلمين والطلاب</span>
                </div>
                
                <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">تقارير أداء الطلاب</span>
                </div>
                
                <div className="flex items-center bg-yellow-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">نظام المكافآت والتحفيز</span>
                </div>
              </div>
              
              <div className="mt-8 text-center md:text-right">
                <Link href="/subscription">
                  <div className="btn-primary inline-block">
                    تجربة مجانية للمدارس
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkered border */}
      <div className="checkered-border"></div>

      <Footer />
    </div>
  );
};

export default Home;
