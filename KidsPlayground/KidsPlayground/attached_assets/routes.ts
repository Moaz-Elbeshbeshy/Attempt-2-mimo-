import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { insertLetterSchema, insertLetterExampleSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed initial data to the database
  try {
    // Check if we're using the database storage
    if ('seedInitialData' in storage) {
      await (storage as any).seedInitialData();
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
  
  // API endpoints for letters
  app.get("/api/letters", async (req, res) => {
    try {
      const letters = await storage.getAllLetters();
      res.json(letters);
    } catch (error) {
      console.error('Error fetching letters:', error);
      res.status(500).json({ message: "Error fetching letters" });
    }
  });

  app.get("/api/letters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid letter ID" });
      }

      const letter = await storage.getLetterWithExamples(id);
      if (!letter) {
        return res.status(404).json({ message: "Letter not found" });
      }

      res.json(letter);
    } catch (error) {
      console.error('Error fetching letter:', error);
      res.status(500).json({ message: "Error fetching letter" });
    }
  });

  app.get("/api/letters/:id/audio", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid letter ID" });
      }

      const letter = await storage.getLetter(id);
      if (!letter) {
        return res.status(404).json({ message: "Letter not found" });
      }

      // In a real implementation, this would point to actual audio files
      // For now, we'll return a mock path that the frontend will handle
      res.json({ audioPath: letter.audioPath });
    } catch (error) {
      console.error('Error fetching letter audio:', error);
      res.status(500).json({ message: "Error fetching letter audio" });
    }
  });

  // Admin endpoints for letter management (in a real app, these would be protected)
  app.post("/api/letters", async (req, res) => {
    try {
      const letterData = insertLetterSchema.parse(req.body);
      const newLetter = await storage.createLetter(letterData);
      res.status(201).json(newLetter);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid letter data", errors: error.errors });
      }
      console.error('Error creating letter:', error);
      res.status(500).json({ message: "Error creating letter" });
    }
  });

  app.post("/api/letters/:id/examples", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid letter ID" });
      }

      const letter = await storage.getLetter(id);
      if (!letter) {
        return res.status(404).json({ message: "Letter not found" });
      }

      const exampleData = insertLetterExampleSchema.parse({
        ...req.body,
        letterId: id
      });

      const newExample = await storage.createLetterExample(exampleData);
      res.status(201).json(newExample);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid example data", errors: error.errors });
      }
      console.error('Error creating letter example:', error);
      res.status(500).json({ message: "Error creating letter example" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
