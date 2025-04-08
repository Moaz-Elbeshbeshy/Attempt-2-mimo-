import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Loader from "@/components/ui/loader";

// Define the categories
const gameCategories = [
  { id: 1, name: "ألعاب", path: "/games", color: "#FF6B8B", icon: "🎮" },
  { id: 2, name: "حروف", path: "/games/letters", color: "#4FD1C5", icon: "🔤" },
  { id: 3, name: "كلمات", path: "/games/words", color: "#63B3ED", icon: "📝" },
  { id: 4, name: "قصص", path: "/games/stories", color: "#9F7AEA", icon: "📚" },
  { id: 5, name: "قواعد", path: "/games/grammar", color: "#F6AD55", icon: "📏" },
  { id: 6, name: "تمارين", path: "/games/exercises", color: "#38B2AC", icon: "✏️" },
  { id: 7, name: "نصوص", path: "/games/texts", color: "#718096", icon: "📄" },
  { id: 8, name: "الكنز", path: "/games/treasure", color: "#D69E2E", icon: "💎" },
  { id: 9, name: "ألغاز", path: "/games/puzzles", color: "#805AD5", icon: "🧩" },
];

const GamesPage: React.FC = () => {
  // Fetch all games
  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['/api/games'],
  });

  const allGames = gamesData?.games || [];

  // Group games by category for display
  const gameGroups = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    allGames.forEach(game => {
      if (!groups[game.gameType]) {
        groups[game.gameType] = [];
      }
      groups[game.gameType].push(game);
    });
    return groups;
  }, [allGames]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Page Header with Description */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="page-title">ألعاب أ ب ت التعليمية</h1>
            <div className="max-w-3xl mx-auto space-y-3 text-gray-600 text-lg">
              <p className="text-right">
                ألعاب عربية ممتعة تشمل دروس تعليمية (200) وتمارين متنوعة وأسئلة واختبارات من نصف الصفحة.
              </p>
              <p className="text-right">
                ألعاب عربية لكل مستويات التعلم في مجموعات بحيث تناسب كل عمر مستوى موضوع محدد.
              </p>
              <p className="text-right">
                تتميز الألعاب العربية بالتصميم البسيط المناسب للأطفال المبتدئين لتعليم الصورة وكتابة الكلمات وتركيب الحروف.
              </p>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {gameCategories.map(category => (
                <Link key={category.id} href={category.path}>
                  <div 
                    className="rounded-full px-6 py-3 text-white font-bold shadow-md transition-all 
                              duration-300 hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon} {category.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Decorative Cloud Background with Robot Characters */}
        <section className="cloud-bg py-10 relative overflow-hidden">
          <div className="container mx-auto px-4 flex justify-around">
            <div className="robot-character">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4677/4677496.png"
                alt="Robot Character"
                className="w-full h-full"
              />
            </div>
            <div className="robot-character">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4677/4677443.png"
                alt="Robot Character"
                className="w-full h-full"
              />
            </div>
            <div className="robot-character hidden md:block">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4677/4677485.png"
                alt="Robot Character"
                className="w-full h-full"
              />
            </div>
            <div className="robot-character hidden lg:block">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4677/4677447.png"
                alt="Robot Character"
                className="w-full h-full"
              />
            </div>
          </div>
          {/* Checkered border */}
          <div className="checkered-border mt-5"></div>
        </section>

        {/* Games List by Categories */}
        <section className="bg-white py-10">
          <div className="container mx-auto px-4">
            <h2 className="page-title mb-12">ألعاب لتعلم العربية</h2>

            {isLoading ? (
              <Loader size="lg" className="py-12" message="جاري تحميل الألعاب..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(gameGroups).map(([type, games]) => (
                  <div key={type} className="kid-card text-center">
                    <h3 className="text-xl font-bold text-primary mb-4">
                      {type === "letters" ? "حروف الألف والباء" : 
                       type === "words" ? "حروف التاء والثاء" : 
                       type === "stories" ? "حروف الجيم والحاء والخاء" : 
                       `ألعاب ${type}`}
                    </h3>
                    <div className="text-lg level-badge level-1 mb-3">
                      ({games.length})
                    </div>
                    <ul className="space-y-3 text-right">
                      {games.map(game => (
                        <li key={game.id} className="flex items-center">
                          <div className="w-4 h-4 bg-primary rounded-full ml-2"></div>
                          <Link href={`/games/${game.gameType}/${game.id}`}>
                            <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
                              {game.title}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pagination Dots */}
        <section className="bg-white py-8">
          <div className="flex justify-center space-x-2">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default GamesPage;
