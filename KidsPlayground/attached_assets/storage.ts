import { 
  letters, 
  letterExamples, 
  users,
  type User,
  type InsertUser,
  type Letter, 
  type InsertLetter, 
  type LetterExample, 
  type InsertLetterExample 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Extended type that includes examples with the letter
export interface LetterWithExamples extends Letter {
  examples: LetterExample[];
}

export interface IStorage {
  // User methods (keeping them for reference)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Letter methods
  getAllLetters(): Promise<LetterWithExamples[]>;
  getLetter(id: number): Promise<Letter | undefined>;
  getLetterWithExamples(id: number): Promise<LetterWithExamples | undefined>;
  createLetter(letter: InsertLetter): Promise<Letter>;
  
  // Letter example methods
  getLetterExamples(letterId: number): Promise<LetterExample[]>;
  createLetterExample(example: InsertLetterExample): Promise<LetterExample>;
}

export class DatabaseStorage implements IStorage {
  // User methods (keeping them for reference)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Letter methods
  async getAllLetters(): Promise<LetterWithExamples[]> {
    const allLetters = await db.select().from(letters);
    const lettersWithExamples: LetterWithExamples[] = [];
    
    for (const letter of allLetters) {
      const examples = await this.getLetterExamples(letter.id);
      lettersWithExamples.push({
        ...letter,
        examples
      });
    }
    
    return lettersWithExamples;
  }
  
  async getLetter(id: number): Promise<Letter | undefined> {
    const [letter] = await db.select().from(letters).where(eq(letters.id, id));
    return letter || undefined;
  }
  
  async getLetterWithExamples(id: number): Promise<LetterWithExamples | undefined> {
    const letter = await this.getLetter(id);
    if (!letter) return undefined;
    
    const examples = await this.getLetterExamples(id);
    return {
      ...letter,
      examples
    };
  }
  
  async createLetter(insertLetter: InsertLetter): Promise<Letter> {
    const [letter] = await db.insert(letters).values(insertLetter).returning();
    return letter;
  }
  
  // Letter example methods
  async getLetterExamples(letterId: number): Promise<LetterExample[]> {
    return await db.select().from(letterExamples).where(eq(letterExamples.letterId, letterId));
  }
  
  async createLetterExample(insertExample: InsertLetterExample): Promise<LetterExample> {
    const [example] = await db.insert(letterExamples).values(insertExample).returning();
    return example;
  }

  // Method to seed initial data (only used when setting up the database)
  async seedInitialData() {
    // Check if we already have data in the letters table
    const existingLetters = await db.select().from(letters);
    if (existingLetters.length > 0) {
      console.log('Database already contains data, skipping seed process');
      return;
    }

    console.log('Seeding initial data to the database...');
    
    const arabicLetters: InsertLetter[] = [
      {
        char: 'ا',
        name: 'ألف',
        translit: 'alif',
        isolated: 'ا',
        initial: 'ا',
        medial: 'ـا',
        final: 'ـا',
        type: 'abjadi',
        audioPath: '/audio/alif.mp3',
      },
      {
        char: 'ب',
        name: 'باء',
        translit: 'baa',
        isolated: 'ب',
        initial: 'بـ',
        medial: 'ـبـ',
        final: 'ـب',
        type: 'manquta',
        audioPath: '/audio/baa.mp3',
      },
      {
        char: 'ت',
        name: 'تاء',
        translit: 'taa',
        isolated: 'ت',
        initial: 'تـ',
        medial: 'ـتـ',
        final: 'ـت',
        type: 'manquta',
        audioPath: '/audio/taa.mp3',
      },
      {
        char: 'ث',
        name: 'ثاء',
        translit: 'thaa',
        isolated: 'ث',
        initial: 'ثـ',
        medial: 'ـثـ',
        final: 'ـث',
        type: 'manquta',
        audioPath: '/audio/thaa.mp3',
      },
      {
        char: 'ج',
        name: 'جيم',
        translit: 'jeem',
        isolated: 'ج',
        initial: 'جـ',
        medial: 'ـجـ',
        final: 'ـج',
        type: 'manquta',
        audioPath: '/audio/jeem.mp3',
      },
      {
        char: 'ح',
        name: 'حاء',
        translit: 'haa',
        isolated: 'ح',
        initial: 'حـ',
        medial: 'ـحـ',
        final: 'ـح',
        type: 'hijai',
        audioPath: '/audio/haa.mp3',
      },
      {
        char: 'خ',
        name: 'خاء',
        translit: 'khaa',
        isolated: 'خ',
        initial: 'خـ',
        medial: 'ـخـ',
        final: 'ـخ',
        type: 'manquta',
        audioPath: '/audio/khaa.mp3',
      },
      {
        char: 'د',
        name: 'دال',
        translit: 'dal',
        isolated: 'د',
        initial: 'د',
        medial: 'ـد',
        final: 'ـد',
        type: 'hijai',
        audioPath: '/audio/dal.mp3',
      }
    ];
    
    // Insert letters
    const createdLetters = await db.insert(letters).values(arabicLetters).returning();
    
    // Create examples for each letter
    const examples: InsertLetterExample[][] = [
      // Examples for Alif
      [
        { letterId: 1, word: 'أَمير', translation: 'Prince' },
        { letterId: 1, word: 'أَسَد', translation: 'Lion' },
        { letterId: 1, word: 'أُم', translation: 'Mother' },
        { letterId: 1, word: 'إِنسان', translation: 'Human' }
      ],
      // Examples for Baa
      [
        { letterId: 2, word: 'بَيت', translation: 'House' },
        { letterId: 2, word: 'باب', translation: 'Door' },
        { letterId: 2, word: 'كِتاب', translation: 'Book' },
        { letterId: 2, word: 'قَلب', translation: 'Heart' }
      ],
      // Examples for Taa
      [
        { letterId: 3, word: 'تُفاح', translation: 'Apple' },
        { letterId: 3, word: 'تَمر', translation: 'Date (fruit)' },
        { letterId: 3, word: 'بِنت', translation: 'Girl' },
        { letterId: 3, word: 'بَيت', translation: 'House' }
      ],
      // Examples for Thaa
      [
        { letterId: 4, word: 'ثَلاثة', translation: 'Three' },
        { letterId: 4, word: 'ثَعلب', translation: 'Fox' },
        { letterId: 4, word: 'مُثَلَّث', translation: 'Triangle' },
        { letterId: 4, word: 'حَديث', translation: 'Modern/Talk' }
      ],
      // Examples for Jeem
      [
        { letterId: 5, word: 'جَمَل', translation: 'Camel' },
        { letterId: 5, word: 'جَبَل', translation: 'Mountain' },
        { letterId: 5, word: 'دَجاج', translation: 'Chicken' },
        { letterId: 5, word: 'ثَلج', translation: 'Snow/Ice' }
      ],
      // Examples for Haa
      [
        { letterId: 6, word: 'حُب', translation: 'Love' },
        { letterId: 6, word: 'حَمامة', translation: 'Dove' },
        { letterId: 6, word: 'مِفتاح', translation: 'Key' },
        { letterId: 6, word: 'تُفاح', translation: 'Apple' }
      ],
      // Examples for Khaa
      [
        { letterId: 7, word: 'خُبز', translation: 'Bread' },
        { letterId: 7, word: 'خَيمة', translation: 'Tent' },
        { letterId: 7, word: 'بِطيخ', translation: 'Watermelon' },
        { letterId: 7, word: 'مَطبَخ', translation: 'Kitchen' }
      ],
      // Examples for Dal
      [
        { letterId: 8, word: 'دَرس', translation: 'Lesson' },
        { letterId: 8, word: 'دُب', translation: 'Bear' },
        { letterId: 8, word: 'مَدرَسة', translation: 'School' },
        { letterId: 8, word: 'وَلَد', translation: 'Boy' }
      ]
    ];
    
    // Flatten and insert all examples at once
    const allExamples = examples.flat();
    await db.insert(letterExamples).values(allExamples);
    
    console.log('Database seeding completed successfully');
  }
}

// Create a new instance of DatabaseStorage
export const storage = new DatabaseStorage();
