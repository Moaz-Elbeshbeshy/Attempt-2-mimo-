// Helper functions for working with Arabic text and pronunciation

// Check if a character is an Arabic letter
export const isArabicLetter = (char: string): boolean => {
  if (char.length !== 1) return false;
  const code = char.charCodeAt(0);
  return code >= 0x0600 && code <= 0x06FF;
};

// Check if text is right-to-left (RTL)
export const isRTL = (text: string): boolean => {
  // Simple check: if the first letter is Arabic, consider it RTL
  if (text.length === 0) return false;
  return isArabicLetter(text[0]);
};

// Get the appropriate letter form based on position (isolated, initial, medial, final)
export const getLetterForm = (
  letter: {
    letter: string;
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  },
  position: 'isolated' | 'initial' | 'medial' | 'final'
): string => {
  return letter[position] || letter.isolated;
};

// Simple transliteration of Arabic letters to Latin (for pronunciation guide)
export const transliterate = (text: string): string => {
  const transliterationMap: Record<string, string> = {
    'ا': 'a',
    'أ': 'a',
    'إ': 'i',
    'آ': 'aa',
    'ب': 'b',
    'ت': 't',
    'ث': 'th',
    'ج': 'j',
    'ح': 'h',
    'خ': 'kh',
    'د': 'd',
    'ذ': 'dh',
    'ر': 'r',
    'ز': 'z',
    'س': 's',
    'ش': 'sh',
    'ص': 's',
    'ض': 'd',
    'ط': 't',
    'ظ': 'dh',
    'ع': '\'',
    'غ': 'gh',
    'ف': 'f',
    'ق': 'q',
    'ك': 'k',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'ه': 'h',
    'و': 'w',
    'ي': 'y',
    'ة': 'h',
    'ى': 'a'
  };

  return Array.from(text)
    .map(char => transliterationMap[char] || char)
    .join('');
};

// Calculate word direction for display
export const getTextDirection = (text: string): "rtl" | "ltr" => {
  return isRTL(text) ? "rtl" : "ltr";
};

// Helper to safely parse JSON string of examples
export const parseExamples = (jsonString: string): Array<{word: string, translation: string}> => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing examples:", error);
    return [];
  }
};

// Helper to safely parse JSON string of features
export const parseFeatures = (jsonString: string): string[] => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing features:", error);
    return [];
  }
};

// Simple audio playback helper
export const playAudio = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);
    audio.play().catch(reject);
  });
};

// Get random Arabic word from a list for practices
export const getRandomItem = <T>(items: T[]): T => {
  if (!items || items.length === 0) return null as unknown as T;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

// Convert western numbers to Arabic numbers
export const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => arabicNumerals[+w]);
};
