import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Star, Clock, Download } from "lucide-react";

// Dummy story data for demonstration
const availableStories = [
  {
    id: 1,
    title: "قصة الأرنب الذكي",
    level: 1,
    description: "قصة مسلية وتعليمية للأطفال عن أرنب صغير يتعلم حروف اللغة العربية",
    duration: "5 دقائق",
    rating: 4.8,
    imgUrl: "https://cdn-icons-png.flaticon.com/512/4677/4677443.png"
  },
  {
    id: 2,
    title: "مغامرات القط سمسم",
    level: 1,
    description: "استكشف مع القط سمسم كيفية تكوين الكلمات والجمل البسيطة باللغة العربية",
    duration: "8 دقائق",
    rating: 4.6,
    imgUrl: "https://cdn-icons-png.flaticon.com/512/4677/4677496.png"
  },
  {
    id: 3,
    title: "الطائر الصغير",
    level: 2,
    description: "قصة ممتعة حول طائر صغير يحاول تعلم الطيران ويتعلم خلال رحلته الحروف والكلمات العربية",
    duration: "7 دقائق",
    rating: 4.9,
    imgUrl: "https://cdn-icons-png.flaticon.com/512/4677/4677485.png"
  },
];

const StoriesPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  // Filtered stories based on selected level
  const filteredStories = selectedLevel 
    ? availableStories.filter(story => story.level === selectedLevel)
    : availableStories;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header with Navigation */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="page-title">قصص تعليمية</h1>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
              <Link href="/games/letters">
                <div className="bg-teal-500 text-white rounded-full px-6 py-3 font-bold shadow-md">
                  🔤 الحروف
                </div>
              </Link>
              <Link href="/games/words">
                <div className="bg-blue-500 text-white rounded-full px-6 py-3 font-bold shadow-md">
                  📝 الكلمات
                </div>
              </Link>
              <Link href="/games/stories">
                <div className="bg-primary text-white rounded-full px-6 py-3 font-bold shadow-md">
                  📚 القصص
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Stories Description */}
        <section className="bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">تعلم اللغة العربية من خلال القصص المصورة</h2>
              <p className="text-gray-600">
                قصص تعليمية مشوقة ومسلية تساعد الأطفال على تعلم الحروف والكلمات العربية بطريقة ممتعة
              </p>
            </div>
          </div>
        </section>

        {/* Level Selection */}
        <section className="cloud-bg py-10 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">اختر المستوى</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button 
                variant={selectedLevel === null ? "default" : "outline"}
                className="rounded-full px-6" 
                onClick={() => setSelectedLevel(null)}
              >
                الكل
              </Button>
              <Button 
                variant={selectedLevel === 1 ? "default" : "outline"}
                className="rounded-full px-6" 
                onClick={() => setSelectedLevel(1)}
              >
                <div className="level-badge level-1 ml-2">1</div>
                المستوى الأول
              </Button>
              <Button 
                variant={selectedLevel === 2 ? "default" : "outline"}
                className="rounded-full px-6" 
                onClick={() => setSelectedLevel(2)}
              >
                <div className="level-badge level-2 ml-2">2</div>
                المستوى الثاني
              </Button>
              <Button 
                variant={selectedLevel === 3 ? "default" : "outline"}
                className="rounded-full px-6" 
                onClick={() => setSelectedLevel(3)}
              >
                <div className="level-badge level-3 ml-2">3</div>
                المستوى الثالث
              </Button>
            </div>
          </div>
          
          {/* Checkered border */}
          <div className="checkered-border mt-5"></div>
        </section>

        {/* Stories List */}
        <section className="bg-white py-10">
          <div className="container mx-auto px-4">
            <h2 className="page-title mb-10">القصص المتاحة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredStories.map((story) => (
                <div key={story.id} className="kid-card overflow-hidden flex flex-col">
                  {/* Story Preview Image */}
                  <div className="relative h-48 bg-blue-50 rounded-t-lg overflow-hidden">
                    <img 
                      src={story.imgUrl} 
                      alt={story.title}
                      className="w-32 h-32 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                    <div className="absolute bottom-0 right-0 level-badge level-1 m-2">
                      المستوى {story.level}
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-right">{story.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 text-right">{story.description}</p>
                    
                    {/* Story Meta */}
                    <div className="flex justify-between text-sm text-gray-500 mb-4 mt-auto">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                        {story.rating}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-500 ml-1" />
                        {story.duration}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between gap-2">
                      <Button 
                        variant="default" 
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => {}}
                      >
                        <Play className="h-4 w-4" />
                        <span>قراءة</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => {}}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>تحميل</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredStories.length === 0 && (
              <div className="text-center py-10">
                <div className="text-lg font-medium text-gray-600">
                  لا توجد قصص في هذا المستوى حاليًا
                </div>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedLevel(null)}
                >
                  عرض جميع القصص
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Download Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-primary p-6 flex items-center justify-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/4677/4677437.png"
                  alt="Download PDF Stories"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className="text-2xl font-bold mb-3 text-right">تحميل المجموعة الكاملة من القصص</h3>
                <p className="text-gray-600 mb-4 text-right">
                  يمكنك الآن تحميل المجموعة الكاملة من القصص التعليمية بصيغة PDF للقراءة في أي وقت، حتى بدون اتصال بالإنترنت.
                </p>
                <div className="flex justify-end">
                  <Button className="px-6 py-6 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <span>تحميل جميع القصص (PDF)</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default StoriesPage;