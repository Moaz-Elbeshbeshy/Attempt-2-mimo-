import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema, User } from "@shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";
import { generateToken, calculateExpiryTime } from './utils/tokens';
import { sendVerificationEmail, sendPasswordResetEmail } from './services/mailjet';

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// Helper function to safely get user id
const getUserId = (req: Request): number => {
  if (!req.user) {
    throw new Error("User not authenticated");
  }
  return (req.user as User).id;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Seed initial data
  try {
    await storage.seedInitialData();
    console.log("Initial data seeded successfully");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
  
  // Game routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json({ games });
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Error fetching games" });
    }
  });
  
  app.get("/api/games/featured", async (req, res) => {
    try {
      const featuredGames = await storage.getFeaturedGames();
      res.json({ games: featuredGames });
    } catch (error) {
      console.error("Error fetching featured games:", error);
      res.status(500).json({ message: "Error fetching featured games" });
    }
  });
  
  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const game = await storage.getGameById(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json({ game });
    } catch (error) {
      console.error("Error fetching game:", error);
      res.status(500).json({ message: "Error fetching game" });
    }
  });
  
  // Subscription plan routes
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json({ plans });
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Error fetching subscription plans" });
    }
  });
  
  // Subscription purchase route
  app.post("/api/subscribe", isAuthenticated, async (req, res) => {
    try {
      const { planId, paymentDetails } = req.body;
      const userId = getUserId(req);
      
      if (!planId || !paymentDetails) {
        return res.status(400).json({ message: "Plan ID and payment details are required" });
      }
      
      // Get user and plan
      const user = await storage.getUser(userId);
      const plan = await storage.getSubscriptionPlanById(parseInt(planId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      
      // In a real app, this is where payment processing would happen
      // For now, we'll just update the user's subscription status
      
      // Calculate subscription end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);
      
      // Update user subscription
      const updatedUser = await storage.updateUserSubscription(
        userId,
        plan.name,
        endDate
      );
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update subscription" });
      }
      
      res.json({
        message: "Subscription successful",
        subscription: {
          plan: plan.name,
          endDate: updatedUser.subscriptionEndDate,
          isActive: updatedUser.isSubscribed
        }
      });
    } catch (error) {
      console.error("Error processing subscription:", error);
      res.status(500).json({ message: "Error processing subscription" });
    }
  });
  
  // Arabic letters routes
  app.get("/api/arabic-letters", async (req, res) => {
    try {
      const letters = await storage.getAllArabicLetters();
      res.json({ letters });
    } catch (error) {
      console.error("Error fetching Arabic letters:", error);
      res.status(500).json({ message: "Error fetching Arabic letters" });
    }
  });
  
  app.get("/api/arabic-letters/:id", async (req, res) => {
    try {
      const letterId = parseInt(req.params.id);
      if (isNaN(letterId)) {
        return res.status(400).json({ message: "Invalid letter ID" });
      }
      
      const letter = await storage.getArabicLetterById(letterId);
      if (!letter) {
        return res.status(404).json({ message: "Letter not found" });
      }
      
      res.json({ letter });
    } catch (error) {
      console.error("Error fetching Arabic letter:", error);
      res.status(500).json({ message: "Error fetching Arabic letter" });
    }
  });
  
  // User progress routes (protected)
  app.get("/api/user-progress", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.getUserProgress(userId);
      
      res.json({ progress });
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Error fetching user progress" });
    }
  });
  
  app.post("/api/user-progress", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const updatedProgress = await storage.updateUserProgress(progressData);
      res.json({ progress: updatedProgress });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating user progress:", error);
      res.status(500).json({ message: "Error updating user progress" });
    }
  });
  
  // Email verification and password reset routes
  app.post("/api/request-verification", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate verification token
      const token = generateToken();
      await storage.setVerificationToken(userId, token);
      
      // Send verification email
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const emailSent = await sendVerificationEmail(
        user.email, 
        user.username, 
        token,
        baseUrl
      );
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }
      
      res.json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ message: "Error sending verification email" });
    }
  });
  
  app.get("/api/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      
      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(404).json({ message: "Invalid or expired verification token" });
      }
      
      // Mark user as verified
      await storage.verifyUser(user.id);
      
      // If user is authenticated, update session
      if (req.isAuthenticated() && req.user && (req.user as User).id === user.id) {
        (req.user as User).isVerified = true;
      }
      
      // Redirect to frontend verification success page
      res.redirect(`/verification-success`);
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ message: "Error verifying email" });
    }
  });
  
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal that the email doesn't exist for security reasons
        return res.json({ message: "If your email is registered, you will receive password reset instructions" });
      }
      
      // Generate password reset token with expiry time (1 hour)
      const token = generateToken();
      const expiryTime = calculateExpiryTime(1); // 1 hour
      await storage.setResetPasswordToken(user.id, token, expiryTime);
      
      // Send password reset email
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const emailSent = await sendPasswordResetEmail(
        user.email, 
        user.username, 
        token,
        baseUrl
      );
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send password reset email" });
      }
      
      res.json({ message: "If your email is registered, you will receive password reset instructions" });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      res.status(500).json({ message: "Error sending password reset email" });
    }
  });
  
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Invalid reset token" });
      }
      
      if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      
      const user = await storage.getUserByResetPasswordToken(token);
      
      if (!user) {
        return res.status(404).json({ message: "Invalid or expired reset token" });
      }
      
      // Reset user's password
      await storage.resetPassword(user.id, password);
      
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Error resetting password" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
