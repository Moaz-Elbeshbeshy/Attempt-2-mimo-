import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ArabicLetterCard from "@/components/arabic-letter";
import ArabicKeyboard from "@/components/arabic-keyboard";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, CheckCircle, XCircle, RotateCcw, BookOpen } from "lucide-react";
import { playAudio, getRandomItem } from "@/lib/arabic-utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

enum GameState {
  LOADING,
  START,
  PLAYING,
  CORRECT,
  INCORRECT,
  COMPLETED
}

const LettersGame: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [currentLetter, setCurrentLetter] = useState<any | null>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playedLetters, setPlayedLetters] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated
  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!localStorage.getItem('token'),
    retry: false
  });
  
  // Fetch Arabic letters
  const { data: lettersData, isLoading } = useQuery({
    queryKey: ['/api/arabic-letters'],
  });
  
  const letters = lettersData?.letters || [];
  
  // Save user progress mutation
  const { mutate: saveProgress } = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/user-progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-progress'] });
    },
    onError: (error) => {
      console.error("Error saving progress:", error);
    }
  });
  
  // Set initial game state
  useEffect(() => {
    if (isLoading) {
      setGameState(GameState.LOADING);
    } else if (letters.length > 0 && gameState === GameState.LOADING) {
      setGameState(GameState.START);
    }
    
    if (userData?.user) {
      setIsAuthenticated(true);
    }
  }, [isLoading, letters, gameState, userData]);
  
  // Start the game
  const startGame = () => {
    if (letters.length === 0) return;
    
    setScore(0);
    setProgress(0);
    setPlayedLetters([]);
    selectRandomLetter();
    setGameState(GameState.PLAYING);
  };
  
  // Get a random letter that hasn't been played yet
  const selectRandomLetter = () => {
    const availableLetters = letters.filter(letter => !playedLetters.includes(letter.id));
    
    if (availableLetters.length === 0) {
      // All letters have been played
      setGameState(GameState.COMPLETED);
      
      // Save progress if authenticated
      if (isAuthenticated) {
        saveProgress({
          gameId: 1, // ID of the letters game
          score,
          completedLevels: JSON.stringify({ 
            lettersCompleted: playedLetters,
            totalLetters: letters.length
          })
        });
      }
      
      return;
    }
    
    const selectedLetter = getRandomItem(availableLetters);
    setCurrentLetter(selectedLetter);
    
    // Auto-play the sound if available
    if (selectedLetter.soundUrl) {
      setTimeout(() => {
        playAudio(selectedLetter.soundUrl).catch(console.error);
      }, 500);
    }
  };
  
  // Handle letter click from keyboard
  const handleLetterClick = (letter: string) => {
    if (gameState !== GameState.PLAYING || !currentLetter) return;
    
    if (letter === currentLetter.letter) {
      // Correct answer
      setScore(prev => prev + 10);
      setPlayedLetters(prev => [...prev, currentLetter.id]);
      setProgress(Math.min(100, ((playedLetters.length + 1) / letters.length) * 100));
      setGameState(GameState.CORRECT);
      
      toast({
        title: "إجابة صحيحة!",
        description: `${currentLetter.name} هو الحرف الصحيح`,
      });
      
      // Move to next letter after a short delay
      setTimeout(() => {
        if (playedLetters.length + 1 >= letters.length) {
          setGameState(GameState.COMPLETED);
          
          // Save progress if authenticated
          if (isAuthenticated) {
            saveProgress({
              gameId: 1, // ID of the letters game
              score: score + 10,
              completedLevels: JSON.stringify({ 
                lettersCompleted: [...playedLetters, currentLetter.id],
                totalLetters: letters.length
              })
            });
          }
        } else {
          selectRandomLetter();
          setGameState(GameState.PLAYING);
        }
      }, 1500);
    } else {
      // Incorrect answer
      setScore(prev => Math.max(0, prev - 2));
      setGameState(GameState.INCORRECT);
      
      toast({
        title: "إجابة خاطئة",
        description: "حاول مرة أخرى",
        variant: "destructive",
      });
      
      // Return to playing state after a short delay
      setTimeout(() => {
        setGameState(GameState.PLAYING);
      }, 1000);
    }
  };
  
  // Play the sound of the current letter
  const playCurrentSound = () => {
    if (!currentLetter || !currentLetter.soundUrl) return;
    
    playAudio(currentLetter.soundUrl).catch(error => {
      console.error("Error playing sound:", error);
      toast({
        title: "خطأ في تشغيل الصوت",
        description: "تعذر تشغيل صوت الحرف",
        variant: "destructive",
      });
    });
  };
  
  // Restart the game
  const restartGame = () => {
    startGame();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header with Description */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="page-title">حروف الألف والباء</h1>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
              <Link href="/games/letters">
                <div className="bg-primary text-white rounded-full px-6 py-3 font-bold shadow-md">
                  🔤 الحروف
                </div>
              </Link>
              <Link href="/games/words">
                <div className="bg-blue-500 text-white rounded-full px-6 py-3 font-bold shadow-md">
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

        {/* Main Content */}
        <section className="bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Right Side - Levels */}
              <div className="kid-card">
                <h2 className="text-xl font-bold text-center text-primary mb-6">مراحل تعلم الحروف</h2>
                
                <div className="space-y-6">
                  {/* Level 1 */}
                  <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="level-badge level-1">1</div>
                      <div className="font-bold text-lg">الحروف الأساسية</div>
                    </div>
                    <div className="text-right text-gray-600 mb-3">
                      تعلم الحروف: أ, ب, ت, ث
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">(4 دروس)</div>
                      <Button 
                        size="sm" 
                        className="px-4 flex items-center gap-1"
                        onClick={startGame}
                      >
                        ابدأ
                      </Button>
                    </div>
                  </div>
                  
                  {/* Level 2 */}
                  <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="level-badge level-2">2</div>
                      <div className="font-bold text-lg">الحروف المتوسطة</div>
                    </div>
                    <div className="text-right text-gray-600 mb-3">
                      تعلم الحروف: ج, ح, خ, د, ذ, ر, ز
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">(7 دروس)</div>
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="px-4 flex items-center gap-1"
                      >
                        ابدأ
                      </Button>
                    </div>
                  </div>
                  
                  {/* Level 3 */}
                  <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="level-badge level-3">3</div>
                      <div className="font-bold text-lg">باقي الحروف</div>
                    </div>
                    <div className="text-right text-gray-600 mb-3">
                      تعلم الحروف: س, ش, ص, ض, ط, ظ, ع, غ, ف, ق, ك, ل, م, ن, ه, و, ي
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">(17 درس)</div>
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="px-4 flex items-center gap-1"
                      >
                        ابدأ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Left Side - Active Game or Preview */}
              <div>
                {gameState === GameState.LOADING && (
                  <Loader size="lg" className="py-12" message="جاري تحميل اللعبة..." />
                )}
                
                {gameState === GameState.START && (
                  <div className="kid-card flex flex-col">
                    <h2 className="text-xl font-bold text-center text-primary mb-6">تعلم نطق الحروف</h2>
                    
                    <div className="space-y-4 flex-grow">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4677/4677496.png" 
                        alt="Robot Teacher" 
                        className="w-40 h-40 mx-auto floating"
                      />
                      
                      <p className="text-gray-600 text-center">
                        اضغط على زر البدء للعب لعبة التعرف على الحروف العربية عن طريق الصوت
                      </p>
                      
                      <div className="mt-6 text-center">
                        <Button 
                          size="lg" 
                          className="px-8 py-6 text-lg flex items-center gap-2"
                          onClick={startGame}
                        >
                          <BookOpen className="h-5 w-5" />
                          <span>ابدأ اللعبة</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center gap-4">
                      <Button variant="outline">مشاهدة الشرح</Button>
                      <Button variant="outline">التمارين</Button>
                    </div>
                  </div>
                )}
                
                {(gameState === GameState.PLAYING || 
                  gameState === GameState.CORRECT || 
                  gameState === GameState.INCORRECT) && currentLetter && (
                  <div className="kid-card">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-lg font-medium">
                        النقاط: <span className="text-primary-600">{score}</span>
                      </div>
                      <div className="w-1/2">
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                    
                    <div className={`bg-white rounded-xl p-6 mb-6 text-center shadow-md ${
                      gameState === GameState.CORRECT 
                        ? "bg-green-50 border-green-200" 
                        : gameState === GameState.INCORRECT 
                          ? "bg-red-50 border-red-200" 
                          : ""
                    }`}>
                      {gameState === GameState.PLAYING && (
                        <>
                          <h2 className="text-xl font-bold mb-5">اختر الحرف الذي تسمعه</h2>
                          <Button 
                            variant="outline" 
                            size="lg" 
                            className="mx-auto px-8 py-6 flex items-center gap-2"
                            onClick={playCurrentSound}
                          >
                            <Volume2 className="h-5 w-5" />
                            <span>اسمع الصوت مرة أخرى</span>
                          </Button>
                        </>
                      )}
                      
                      {gameState === GameState.CORRECT && (
                        <div className="flex flex-col items-center justify-center py-2">
                          <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
                          <h2 className="text-xl font-bold text-green-700">إجابة صحيحة!</h2>
                        </div>
                      )}
                      
                      {gameState === GameState.INCORRECT && (
                        <div className="flex flex-col items-center justify-center py-2">
                          <XCircle className="h-16 w-16 text-red-500 mb-2" />
                          <h2 className="text-xl font-bold text-red-700">حاول مرة أخرى</h2>
                        </div>
                      )}
                    </div>
                    
                    {/* Arabic Keyboard */}
                    <ArabicKeyboard 
                      onLetterClick={handleLetterClick}
                      disabledKeys={gameState !== GameState.PLAYING ? letters.map(l => l.letter) : []}
                      size="lg"
                      className="mx-auto"
                    />
                  </div>
                )}
                
                {gameState === GameState.COMPLETED && (
                  <div className="kid-card text-center">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/4677/4677532.png" 
                      alt="Robot celebrating" 
                      className="w-32 h-32 mx-auto mb-4"
                    />
                    
                    <h2 className="text-2xl font-bold mb-2">تهانينا! 🎉</h2>
                    <p className="mb-4 text-gray-600">
                      لقد أكملت لعبة الحروف بنجاح
                    </p>
                    <div className="text-xl font-bold text-primary-600 mb-6">
                      مجموع النقاط: {score}
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button 
                        size="lg" 
                        className="px-8 flex items-center gap-2"
                        onClick={restartGame}
                      >
                        <RotateCcw className="h-5 w-5" />
                        <span>العب مرة أخرى</span>
                      </Button>
                      <Link href="/games">
                        <Button 
                          variant="outline"
                          size="lg" 
                          className="px-8"
                        >
                          العودة للألعاب
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* All letters grid Section */}
        <section className="cloud-bg py-10 relative overflow-hidden mt-8">
          <div className="container mx-auto px-4">
            <h2 className="page-title mb-10">الحروف العربية</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {letters.map((letter) => (
                <ArabicLetterCard 
                  key={letter.id} 
                  letter={letter} 
                  size="sm" 
                  interactive={true}
                  onClick={() => {
                    if (letter.soundUrl) {
                      playAudio(letter.soundUrl).catch(console.error);
                    }
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Checkered border */}
          <div className="checkered-border mt-10"></div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LettersGame;
