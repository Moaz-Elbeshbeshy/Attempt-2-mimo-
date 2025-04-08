import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCw, Check, X, ArrowRight, Printer } from "lucide-react";

// Sample words for demonstration
const arabicWords = [
  { id: 1, word: "أسد", translation: "lion", image: "https://cdn-icons-png.flaticon.com/512/4677/4677496.png", difficulty: "easy" },
  { id: 2, word: "بطة", translation: "duck", image: "https://cdn-icons-png.flaticon.com/512/4677/4677485.png", difficulty: "easy" },
  { id: 3, word: "تفاحة", translation: "apple", image: "https://cdn-icons-png.flaticon.com/512/4677/4677443.png", difficulty: "easy" },
  { id: 4, word: "ثعلب", translation: "fox", image: "https://cdn-icons-png.flaticon.com/512/4677/4677447.png", difficulty: "medium" },
  { id: 5, word: "جمل", translation: "camel", image: "https://cdn-icons-png.flaticon.com/512/4677/4677437.png", difficulty: "medium" },
  { id: 6, word: "حصان", translation: "horse", image: "https://cdn-icons-png.flaticon.com/512/4677/4677590.png", difficulty: "medium" },
  { id: 7, word: "خروف", translation: "sheep", image: "https://cdn-icons-png.flaticon.com/512/4677/4677532.png", difficulty: "hard" },
  { id: 8, word: "دجاجة", translation: "chicken", image: "https://cdn-icons-png.flaticon.com/512/4677/4677562.png", difficulty: "hard" },
  { id: 9, word: "ذئب", translation: "wolf", image: "https://cdn-icons-png.flaticon.com/512/4677/4677496.png", difficulty: "hard" },
];

const WordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizWord, setCurrentQuizWord] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  
  // Filter words based on search and difficulty
  const filteredWords = arabicWords.filter(word => {
    const matchesSearch = searchTerm === "" || 
                          word.word.includes(searchTerm) || 
                          word.translation.includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === "all" || 
                              word.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });
  
  // Start quiz
  const startQuiz = () => {
    setIsQuizMode(true);
    setUserAnswer("");
    setIsCorrect(null);
    setQuizScore(0);
    selectRandomWord();
  };
  
  // Select random word for quiz
  const selectRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * arabicWords.length);
    setCurrentQuizWord(arabicWords[randomIndex]);
  };
  
  // Check user answer
  const checkAnswer = () => {
    if (!currentQuizWord) return;
    
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentQuizWord.translation;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setQuizScore(prev => prev + 10);
    }
    
    // Move to next word after 2 seconds
    setTimeout(() => {
      setUserAnswer("");
      setIsCorrect(null);
      selectRandomWord();
    }, 2000);
  };
  
  // End quiz mode
  const endQuiz = () => {
    setIsQuizMode(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header with Navigation */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="page-title">تعلم الكلمات العربية</h1>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
              <Link href="/games/letters">
                <div className="bg-teal-500 text-white rounded-full px-6 py-3 font-bold shadow-md">
                  🔤 الحروف
                </div>
              </Link>
              <Link href="/games/words">
                <div className="bg-primary text-white rounded-full px-6 py-3 font-bold shadow-md">
                  📝 الكلمات
                </div>
              </Link>
              <Link href="/games/stories">
                <div className="bg-purple-500 text-white rounded-full px-6 py-3 font-bold shadow-md">
                  📚 القصص
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Quiz Mode */}
        {isQuizMode && currentQuizWord && (
          <section className="cloud-bg py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto kid-card">
                <div className="flex justify-between items-center mb-6">
                  <Button 
                    variant="outline" 
                    onClick={endQuiz}
                  >
                    الخروج من الاختبار
                  </Button>
                  <div className="text-lg font-bold">
                    النقاط: <span className="text-primary">{quizScore}</span>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={currentQuizWord.image}
                      alt={currentQuizWord.word}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{currentQuizWord.word}</h2>
                  <p className="text-lg text-gray-600 mb-6">ما معنى هذه الكلمة باللغة الإنجليزية؟</p>
                  
                  <div className="flex justify-center mb-4">
                    <div className="relative w-full max-w-md">
                      <Input 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type the English translation..."
                        className={`text-center text-lg py-6 ${
                          isCorrect === true ? 'border-green-500 bg-green-50' : 
                          isCorrect === false ? 'border-red-500 bg-red-50' : ''
                        }`}
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      />
                      
                      {isCorrect === true && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Check className="h-6 w-6 text-green-500" />
                        </div>
                      )}
                      
                      {isCorrect === false && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <X className="h-6 w-6 text-red-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    size="lg"
                    onClick={checkAnswer}
                    disabled={userAnswer.trim() === ""}
                  >
                    تحقق
                  </Button>
                  
                  {isCorrect === false && (
                    <div className="mt-4 text-red-600">
                      الإجابة الصحيحة هي: {currentQuizWord.translation}
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="outline"
                    onClick={selectRandomWord}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>كلمة أخرى</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Words Section (when not in quiz mode) */}
        {!isQuizMode && (
          <>
            {/* Search and Filter */}
            <section className="bg-white py-6">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                      <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="ابحث عن كلمة..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* Difficulty Filter */}
                    <Tabs 
                      defaultValue="all" 
                      className="w-full md:w-auto"
                      onValueChange={setSelectedDifficulty}
                    >
                      <TabsList className="grid grid-cols-3 md:flex md:flex-wrap h-auto">
                        <TabsTrigger value="all">الكل</TabsTrigger>
                        <TabsTrigger value="easy">سهل</TabsTrigger>
                        <TabsTrigger value="medium">متوسط</TabsTrigger>
                        <TabsTrigger value="hard">صعب</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                {/* Start Quiz Button */}
                <div className="flex justify-center mb-6">
                  <Button 
                    onClick={startQuiz} 
                    size="lg"
                    className="rounded-full px-8 py-6"
                  >
                    ابدأ لعبة الكلمات
                  </Button>
                </div>
              </div>
            </section>

            {/* Words List */}
            <section className="cloud-bg py-10 relative">
              <div className="container mx-auto px-4">
                <h2 className="page-title mb-8">الكلمات المتاحة</h2>
                
                {filteredWords.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {filteredWords.map((word) => (
                      <div key={word.id} className="kid-card text-center">
                        <div className="flex justify-center mb-4">
                          <img 
                            src={word.image} 
                            alt={word.word}
                            className="w-24 h-24 object-contain"
                          />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{word.word}</h3>
                        <p className="text-lg text-gray-600 mb-3">{word.translation}</p>
                        <div className={`
                          inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${word.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            word.difficulty === 'medium' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'}
                        `}>
                          {word.difficulty === 'easy' ? 'سهل' : 
                           word.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-xl font-medium text-gray-600 mb-4">
                      لم يتم العثور على كلمات مطابقة للبحث
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedDifficulty("all");
                      }}
                    >
                      عرض جميع الكلمات
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Printable Worksheet CTA */}
              <div className="container mx-auto px-4 mt-12 max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/4677/4677437.png"
                      alt="Worksheet"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="md:w-3/4 text-right">
                    <h3 className="text-xl font-bold mb-2">أوراق عمل للطباعة</h3>
                    <p className="text-gray-600 mb-4">
                      قم بطباعة أوراق عمل للتدرب على كتابة الكلمات العربية في المنزل أو في المدرسة.
                    </p>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>طباعة أوراق العمل</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Checkered border */}
              <div className="checkered-border mt-12"></div>
            </section>
            
            {/* Word Categories */}
            <section className="bg-white py-10">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-10">مجموعات الكلمات</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {/* Category 1 */}
                  <div className="kid-card text-center">
                    <h3 className="text-xl font-bold text-primary mb-4">الحيوانات</h3>
                    <div className="flex justify-center mb-4">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4677/4677496.png" 
                        alt="Animals"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">
                      تعلم أسماء الحيوانات باللغة العربية وكيفية نطقها وكتابتها
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <span>فتح المجموعة</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Category 2 */}
                  <div className="kid-card text-center">
                    <h3 className="text-xl font-bold text-primary mb-4">الفواكه والخضروات</h3>
                    <div className="flex justify-center mb-4">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4677/4677443.png" 
                        alt="Fruits and Vegetables"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">
                      تعلم أسماء الفواكه والخضروات باللغة العربية وكيفية نطقها وكتابتها
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <span>فتح المجموعة</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Category 3 */}
                  <div className="kid-card text-center">
                    <h3 className="text-xl font-bold text-primary mb-4">الألوان والأشكال</h3>
                    <div className="flex justify-center mb-4">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4677/4677485.png" 
                        alt="Colors and Shapes"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">
                      تعلم أسماء الألوان والأشكال باللغة العربية وكيفية نطقها وكتابتها
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <span>فتح المجموعة</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default WordsPage;