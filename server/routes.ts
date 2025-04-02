import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer, { type FileFilterCallback } from "multer";
import { insertImageSchema, insertOrderSchema, productPricingSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage_config = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = nanoid();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter to only accept jpeg and png
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const mimeTypes = ["image/jpeg", "image/png"];
  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }
};

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 1,
  },
  fileFilter,
});

// Product pricing data
const PRODUCT_PRICING = {
  postcard: {
    small: 1.50,
    medium: 2.50,
    large: 3.50,
  },
  poster: {
    small: 12.99,
    medium: 19.99,
    large: 29.99,
  },
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get product pricing
  app.get("/api/pricing", (_req: Request, res: Response) => {
    res.json(PRODUCT_PRICING);
  });

  // Upload image
  app.post("/api/images/upload", upload.single("image"), async (req: Request, res: Response) => {
    try {
      // Log the request details for debugging
      console.log("Upload request received:", {
        body: req.body ? Object.keys(req.body) : 'none',
        file: req.file ? 'present' : 'missing',
        contentType: req.headers['content-type']
      });
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get file info
      const file = req.file;
      // Convert file size to MB and make sure it's a string for the numeric type
      const fileSizeMb = (file.size / (1024 * 1024)).toString();

      // Process image with sharp to get metadata
      await sharp(file.path).metadata();

      // Create image record
      const newImage = {
        fileName: file.filename,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
        sizeMb: fileSizeMb,
        uploadedAt: new Date().toISOString(),
      };

      try {
        const validatedImage = insertImageSchema.parse(newImage);
        const savedImage = await storage.createImage(validatedImage);
        res.status(201).json(savedImage);
      } catch (error) {
        // Clean up the file if validation fails
        fs.unlinkSync(file.path);
        
        if (error instanceof ZodError) {
          return res.status(400).json({ message: fromZodError(error).message });
        }
        throw error;
      }
    } catch (error) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          console.error("Failed to clean up file:", e);
        }
      }
      
      // Provide more detailed error information
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Image upload error:", error);
      res.status(500).json({ message: `Failed to process image: ${errorMessage}` });
    }
  });

  // Get image by ID
  app.get("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const image = await storage.getImage(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });

  // Serve images (with proper content-type)
  app.get("/api/images/file/:fileName", (req: Request, res: Response) => {
    try {
      const fileName = req.params.fileName;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Image file not found" });
      }
      
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error serving image file:", error);
      res.status(500).json({ message: "Failed to serve image file" });
    }
  });

  // Create order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = req.body;
      
      try {
        const validatedOrder = insertOrderSchema.parse({
          ...orderData,
          orderedAt: new Date().toISOString(),
        });
        
        const savedOrder = await storage.createOrder(validatedOrder);
        res.status(201).json(savedOrder);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ message: fromZodError(error).message });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
