import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, type User, type InsertUser,
  games, type Game, type InsertGame,
  subscriptionPlans, type SubscriptionPlan, type InsertSubscriptionPlan,
  arabicLetters, type ArabicLetter, type InsertArabicLetter,
  userProgress, type UserProgress, type InsertUserProgress
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

// Storage interface
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, subscriptionTier: string, endDate: Date): Promise<User | undefined>;
  
  // Email verification and password reset methods
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getUserByResetPasswordToken(token: string): Promise<User | undefined>;
  setVerificationToken(userId: number, token: string): Promise<User | undefined>;
  verifyUser(userId: number): Promise<User | undefined>;
  setResetPasswordToken(userId: number, token: string, expires: Date): Promise<User | undefined>;
  resetPassword(userId: number, password: string): Promise<User | undefined>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  getFeaturedGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Subscription plans methods
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // Arabic letters methods
  getAllArabicLetters(): Promise<ArabicLetter[]>;
  getArabicLetterById(id: number): Promise<ArabicLetter | undefined>;
  getArabicLetterByLetter(letter: string): Promise<ArabicLetter | undefined>;
  createArabicLetter(letter: InsertArabicLetter): Promise<ArabicLetter>;
  
  // User progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  updateUserProgress(progressData: InsertUserProgress): Promise<UserProgress>;
  
  // Seed initial data
  seedInitialData(): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private arabicLetters: Map<number, ArabicLetter>;
  private userProgress: Map<number, UserProgress>;
  
  private userId: number = 1;
  private gameId: number = 1;
  private planId: number = 1;
  private letterId: number = 1;
  private progressId: number = 1;
  
  public sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.subscriptionPlans = new Map();
    this.arabicLetters = new Map();
    this.userProgress = new Map();
    
    // Initialize memory-based session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isSubscribed: false, 
      subscriptionTier: null, 
      subscriptionEndDate: null,
      isVerified: false,
      verificationToken: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: timestamp
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserSubscription(userId: number, subscriptionTier: string, endDate: Date): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      isSubscribed: true,
      subscriptionTier,
      subscriptionEndDate: endDate
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Email verification and password reset methods
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.verificationToken === token);
  }
  
  async getUserByResetPasswordToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => {
      if (user.resetPasswordToken === token && user.resetPasswordExpires) {
        // Check if token is still valid (not expired)
        return new Date() < user.resetPasswordExpires;
      }
      return false;
    });
  }
  
  async setVerificationToken(userId: number, token: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      verificationToken: token
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async verifyUser(userId: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      isVerified: true,
      verificationToken: null
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async setResetPasswordToken(userId: number, token: string, expires: Date): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      resetPasswordToken: token,
      resetPasswordExpires: expires
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async resetPassword(userId: number, password: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async getFeaturedGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.featured);
  }
  
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const game: Game = { 
      ...insertGame, 
      id,
      featured: insertGame.featured ?? false 
    };
    this.games.set(id, game);
    return game;
  }
  
  // Subscription plans methods
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }
  
  async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }
  
  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.planId++;
    const plan: SubscriptionPlan = { 
      ...insertPlan, 
      id,
      popular: insertPlan.popular ?? false 
    };
    this.subscriptionPlans.set(id, plan);
    return plan;
  }
  
  // Arabic letters methods
  async getAllArabicLetters(): Promise<ArabicLetter[]> {
    return Array.from(this.arabicLetters.values());
  }
  
  async getArabicLetterById(id: number): Promise<ArabicLetter | undefined> {
    return this.arabicLetters.get(id);
  }
  
  async getArabicLetterByLetter(letter: string): Promise<ArabicLetter | undefined> {
    return Array.from(this.arabicLetters.values()).find(l => l.letter === letter);
  }
  
  async createArabicLetter(insertLetter: InsertArabicLetter): Promise<ArabicLetter> {
    const id = this.letterId++;
    const letter: ArabicLetter = { 
      ...insertLetter, 
      id,
      soundUrl: insertLetter.soundUrl ?? null
    };
    this.arabicLetters.set(id, letter);
    return letter;
  }
  
  // User progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }
  
  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress already exists
    const existingProgress = Array.from(this.userProgress.values()).find(
      p => p.userId === insertProgress.userId && p.gameId === insertProgress.gameId
    );
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        score: insertProgress.score ?? 0,
        completedLevels: insertProgress.completedLevels,
        lastPlayed: new Date()
      };
      this.userProgress.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    }
    
    // Create new progress
    const id = this.progressId++;
    const progress: UserProgress = { 
      ...insertProgress, 
      id, 
      score: insertProgress.score ?? 0,
      lastPlayed: new Date() 
    };
    this.userProgress.set(id, progress);
    return progress;
  }
  
  // Seed initial data
  async seedInitialData(): Promise<void> {
    // Only seed if no data exists
    if (this.games.size > 0 || this.subscriptionPlans.size > 0 || this.arabicLetters.size > 0) {
      return;
    }
    
    // Seed subscription plans
    await this.createSubscriptionPlan({
      name: "اشتراك شهري",
      duration: 1,
      price: 30,
      features: JSON.stringify([
        "وصول كامل لجميع الألعاب",
        "تتبع تقدم التعلم",
        "دعم فني أساسي"
      ]),
      popular: false
    });
    
    await this.createSubscriptionPlan({
      name: "اشتراك 6 أشهر",
      duration: 6,
      price: 150,
      features: JSON.stringify([
        "وصول كامل لجميع الألعاب",
        "تتبع تقدم التعلم",
        "دعم فني متميز",
        "تقارير متقدمة للأداء"
      ]),
      popular: true
    });
    
    await this.createSubscriptionPlan({
      name: "اشتراك سنوي",
      duration: 12,
      price: 300,
      features: JSON.stringify([
        "وصول كامل لجميع الألعاب",
        "تتبع تقدم التعلم",
        "دعم فني ممتاز على مدار الساعة",
        "تقارير متقدمة للأداء",
        "خصم 20% على المحتوى الإضافي"
      ]),
      popular: false
    });
    
    // Seed games
    await this.createGame({
      title: "تعلم الحروف",
      description: "ساعد طفلك على تعلم الحروف العربية بطريقة تفاعلية ممتعة مع أصوات نطق الحروف.",
      imageUrl: "https://images.pexels.com/photos/3893739/pexels-photo-3893739.jpeg",
      ageRange: "3-6 سنوات",
      gameType: "حروف",
      route: "/games/letters",
      featured: true
    });
    
    await this.createGame({
      title: "لعبة الكلمات",
      description: "ساعد طفلك على تكوين الكلمات العربية وفهم معانيها من خلال ألعاب تفاعلية ممتعة.",
      imageUrl: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg",
      ageRange: "6-9 سنوات",
      gameType: "كلمات",
      route: "/games/words",
      featured: false
    });
    
    await this.createGame({
      title: "قصص تفاعلية",
      description: "اسمع وشاهد قصص عربية تفاعلية مع أنشطة تساعد على تنمية مهارات القراءة والفهم.",
      imageUrl: "https://images.pexels.com/photos/4260325/pexels-photo-4260325.jpeg",
      ageRange: "5-12 سنة",
      gameType: "قصص",
      route: "/games/stories",
      featured: false
    });
    
    await this.createGame({
      title: "تعلم الأرقام",
      description: "لعبة للتعرف على الأرقام العربية وتعلم العد والعمليات الحسابية الأساسية.",
      imageUrl: "https://images.pexels.com/photos/4144144/pexels-photo-4144144.jpeg",
      ageRange: "4-8 سنوات",
      gameType: "أرقام",
      route: "/games/numbers",
      featured: true
    });
    
    await this.createGame({
      title: "تحدي الإملاء",
      description: "لعبة تعليمية تساعد على تحسين مهارات الإملاء والكتابة باللغة العربية.",
      imageUrl: "https://images.pexels.com/photos/3992943/pexels-photo-3992943.jpeg",
      ageRange: "7-12 سنة",
      gameType: "إملاء",
      route: "/games/spelling",
      featured: false
    });
    
    await this.createGame({
      title: "ألغاز لغوية",
      description: "مجموعة من الألغاز اللغوية التفاعلية التي تساعد على إثراء المفردات وتنمية التفكير.",
      imageUrl: "https://images.pexels.com/photos/7676393/pexels-photo-7676393.jpeg",
      ageRange: "8-14 سنة",
      gameType: "ألغاز",
      route: "/games/puzzles",
      featured: false
    });
    
    // Seed Arabic letters
    const arabicLetters = [
      {
        letter: "ا",
        name: "ألف",
        soundUrl: "/sounds/alif.mp3",
        examples: JSON.stringify([
          { word: "أَمير", translation: "Prince" },
          { word: "أَسَد", translation: "Lion" },
          { word: "أُم", translation: "Mother" }
        ]),
        isolated: "ا",
        initial: "ا",
        medial: "ـا",
        final: "ـا"
      },
      {
        letter: "ب",
        name: "باء",
        soundUrl: "/sounds/ba.mp3",
        examples: JSON.stringify([
          { word: "بَيت", translation: "House" },
          { word: "باب", translation: "Door" },
          { word: "كِتاب", translation: "Book" }
        ]),
        isolated: "ب",
        initial: "بـ",
        medial: "ـبـ",
        final: "ـب"
      },
      {
        letter: "ت",
        name: "تاء",
        soundUrl: "/sounds/ta.mp3",
        examples: JSON.stringify([
          { word: "تُفاح", translation: "Apple" },
          { word: "تَمر", translation: "Date (fruit)" },
          { word: "بِنت", translation: "Girl" }
        ]),
        isolated: "ت",
        initial: "تـ",
        medial: "ـتـ",
        final: "ـت"
      },
      {
        letter: "ث",
        name: "ثاء",
        soundUrl: "/sounds/tha.mp3",
        examples: JSON.stringify([
          { word: "ثَلاثة", translation: "Three" },
          { word: "ثَعلب", translation: "Fox" },
          { word: "مُثَلَّث", translation: "Triangle" }
        ]),
        isolated: "ث",
        initial: "ثـ",
        medial: "ـثـ",
        final: "ـث"
      },
      {
        letter: "ج",
        name: "جيم",
        soundUrl: "/sounds/jim.mp3",
        examples: JSON.stringify([
          { word: "جَمَل", translation: "Camel" },
          { word: "جَبَل", translation: "Mountain" },
          { word: "دَجاج", translation: "Chicken" }
        ]),
        isolated: "ج",
        initial: "جـ",
        medial: "ـجـ",
        final: "ـج"
      },
      {
        letter: "ح",
        name: "حاء",
        soundUrl: "/sounds/ha.mp3",
        examples: JSON.stringify([
          { word: "حُب", translation: "Love" },
          { word: "حَمامة", translation: "Dove" },
          { word: "مِفتاح", translation: "Key" }
        ]),
        isolated: "ح",
        initial: "حـ",
        medial: "ـحـ",
        final: "ـح"
      },
      {
        letter: "خ",
        name: "خاء",
        soundUrl: "/sounds/kha.mp3",
        examples: JSON.stringify([
          { word: "خُبز", translation: "Bread" },
          { word: "خَيمة", translation: "Tent" },
          { word: "مَطبَخ", translation: "Kitchen" }
        ]),
        isolated: "خ",
        initial: "خـ",
        medial: "ـخـ",
        final: "ـخ"
      },
      {
        letter: "د",
        name: "دال",
        soundUrl: "/sounds/dal.mp3",
        examples: JSON.stringify([
          { word: "دَرس", translation: "Lesson" },
          { word: "دُب", translation: "Bear" },
          { word: "وَلَد", translation: "Boy" }
        ]),
        isolated: "د",
        initial: "د",
        medial: "ـد",
        final: "ـد"
      }
    ];
    
    for (const letter of arabicLetters) {
      await this.createArabicLetter(letter);
    }
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;
  
  constructor() {
    // Initialize PostgreSQL-based session store
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      pool,
      tableName: 'session', // default
      createTableIfMissing: true
    });
  }
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserSubscription(userId: number, subscriptionTier: string, endDate: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        isSubscribed: true,
        subscriptionTier,
        subscriptionEndDate: endDate
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }
  
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.verificationToken, token));
    return results[0];
  }
  
  async getUserByResetPasswordToken(token: string): Promise<User | undefined> {
    // Get user with the matching token
    const results = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token));
    
    // Check if token is expired
    const user = results[0];
    if (user && user.resetPasswordExpires) {
      // Check if token is still valid (not expired)
      return new Date() < user.resetPasswordExpires ? user : undefined;
    }
    
    return undefined;
  }
  
  async setVerificationToken(userId: number, token: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ verificationToken: token })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }
  
  async verifyUser(userId: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        isVerified: true,
        verificationToken: null
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }
  
  async setResetPasswordToken(userId: number, token: string, expires: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        resetPasswordToken: token,
        resetPasswordExpires: expires
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }
  
  async resetPassword(userId: number, password: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async getGameById(id: number): Promise<Game | undefined> {
    const results = await db.select().from(games).where(eq(games.id, id));
    return results[0];
  }

  async getFeaturedGames(): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.featured, true));
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values({
      ...insertGame,
      featured: insertGame.featured ?? false
    }).returning();
    return game;
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans);
  }

  async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
    const results = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return results[0];
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values({
      ...insertPlan,
      popular: insertPlan.popular ?? false
    }).returning();
    return plan;
  }

  async getAllArabicLetters(): Promise<ArabicLetter[]> {
    return await db.select().from(arabicLetters);
  }

  async getArabicLetterById(id: number): Promise<ArabicLetter | undefined> {
    const results = await db.select().from(arabicLetters).where(eq(arabicLetters.id, id));
    return results[0];
  }

  async getArabicLetterByLetter(letter: string): Promise<ArabicLetter | undefined> {
    const results = await db.select().from(arabicLetters).where(eq(arabicLetters.letter, letter));
    return results[0];
  }

  async createArabicLetter(insertLetter: InsertArabicLetter): Promise<ArabicLetter> {
    const [letter] = await db.insert(arabicLetters).values({
      ...insertLetter,
      soundUrl: insertLetter.soundUrl ?? null
    }).returning();
    return letter;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Check if there's an existing progress entry
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, insertProgress.userId));
    
    // Filter for the specific gameId manually
    const matchingProgress = existingProgress.find(p => p.gameId === insertProgress.gameId);
    
    if (matchingProgress) {
      // Update existing progress
      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          score: insertProgress.score || 0,
          completedLevels: insertProgress.completedLevels,
          lastPlayed: new Date()
        })
        .where(eq(userProgress.id, matchingProgress.id))
        .returning();
      
      return updatedProgress;
    } else {
      // Create new progress entry
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId: insertProgress.userId,
          gameId: insertProgress.gameId,
          score: insertProgress.score || 0,
          completedLevels: insertProgress.completedLevels,
          lastPlayed: new Date()
        })
        .returning();
      
      return newProgress;
    }
  }

  async seedInitialData(): Promise<void> {
    try {
      // Check if any data exists
      const existingGames = await db.select().from(games);
      if (existingGames.length > 0) {
        console.log("Data already exists, skipping seed operation");
        return;
      }

      // Seed subscription plans
      await this.createSubscriptionPlan({
        name: "اشتراك شهري",
        duration: 1,
        price: 30,
        features: JSON.stringify([
          "وصول كامل لجميع الألعاب",
          "تتبع تقدم التعلم",
          "دعم فني أساسي"
        ]),
        popular: false
      });
      
      await this.createSubscriptionPlan({
        name: "اشتراك 6 أشهر",
        duration: 6,
        price: 150,
        features: JSON.stringify([
          "وصول كامل لجميع الألعاب",
          "تتبع تقدم التعلم",
          "دعم فني متميز",
          "تقارير متقدمة للأداء"
        ]),
        popular: true
      });
      
      await this.createSubscriptionPlan({
        name: "اشتراك سنوي",
        duration: 12,
        price: 300,
        features: JSON.stringify([
          "وصول كامل لجميع الألعاب",
          "تتبع تقدم التعلم",
          "دعم فني ممتاز على مدار الساعة",
          "تقارير متقدمة للأداء",
          "خصم 20% على المحتوى الإضافي"
        ]),
        popular: false
      });
      
      // Seed games
      await this.createGame({
        title: "تعلم الحروف",
        description: "ساعد طفلك على تعلم الحروف العربية بطريقة تفاعلية ممتعة مع أصوات نطق الحروف.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/4677/4677443.png",
        ageRange: "3-6 سنوات",
        gameType: "letters",
        route: "/games/letters",
        featured: true
      });
      
      await this.createGame({
        title: "لعبة الكلمات",
        description: "ساعد طفلك على تكوين الكلمات العربية وفهم معانيها من خلال ألعاب تفاعلية ممتعة.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/4677/4677496.png",
        ageRange: "6-9 سنوات",
        gameType: "words",
        route: "/games/words",
        featured: true
      });
      
      await this.createGame({
        title: "قصص تفاعلية",
        description: "اسمع وشاهد قصص عربية تفاعلية مع أنشطة تساعد على تنمية مهارات القراءة والفهم.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/4677/4677485.png",
        ageRange: "5-12 سنة",
        gameType: "stories",
        route: "/games/stories",
        featured: true
      });
      
      // Seed Arabic letters
      const arabicLettersData = [
        {
          letter: "ا",
          name: "ألف",
          soundUrl: "/sounds/alif.mp3",
          examples: JSON.stringify([
            { word: "أَمير", translation: "Prince" },
            { word: "أَسَد", translation: "Lion" },
            { word: "أُم", translation: "Mother" }
          ]),
          isolated: "ا",
          initial: "ا",
          medial: "ـا",
          final: "ـا"
        },
        {
          letter: "ب",
          name: "باء",
          soundUrl: "/sounds/ba.mp3",
          examples: JSON.stringify([
            { word: "بَيت", translation: "House" },
            { word: "باب", translation: "Door" },
            { word: "كِتاب", translation: "Book" }
          ]),
          isolated: "ب",
          initial: "بـ",
          medial: "ـبـ",
          final: "ـب"
        },
        {
          letter: "ت",
          name: "تاء",
          soundUrl: "/sounds/ta.mp3",
          examples: JSON.stringify([
            { word: "تُفاح", translation: "Apple" },
            { word: "تَمر", translation: "Date (fruit)" },
            { word: "بِنت", translation: "Girl" }
          ]),
          isolated: "ت",
          initial: "تـ",
          medial: "ـتـ",
          final: "ـت"
        },
        {
          letter: "ث",
          name: "ثاء",
          soundUrl: "/sounds/tha.mp3",
          examples: JSON.stringify([
            { word: "ثَلاثة", translation: "Three" },
            { word: "ثَعلب", translation: "Fox" },
            { word: "مُثَلَّث", translation: "Triangle" }
          ]),
          isolated: "ث",
          initial: "ثـ",
          medial: "ـثـ",
          final: "ـث"
        },
        {
          letter: "ج",
          name: "جيم",
          soundUrl: "/sounds/jim.mp3",
          examples: JSON.stringify([
            { word: "جَمَل", translation: "Camel" },
            { word: "جَبَل", translation: "Mountain" },
            { word: "دَجاج", translation: "Chicken" }
          ]),
          isolated: "ج",
          initial: "جـ",
          medial: "ـجـ",
          final: "ـج"
        }
      ];
      
      for (const letter of arabicLettersData) {
        await this.createArabicLetter(letter);
      }
      
      console.log("Initial data seeded successfully");
    } catch (error) {
      console.error("Error seeding initial data:", error);
      throw error;
    }
  }
}

// Create and export an instance of DatabaseStorage
export const storage = new DatabaseStorage();
