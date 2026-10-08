import dbConnect from "@/db/connect";
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function runMiddleware(request, response, middleware) {
  return new Promise((resolve, reject) => {
    middleware(request, response, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      resolve(result);
    });
  });
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await dbConnect();

    await runMiddleware(
      request,
      response,
      upload.single("file")
    );

    const file = request.file;

    if (!file) {
      return response.status(400).json({
        error: "No PDF file uploaded",
      });
    }

    if (file.mimetype !== "application/pdf") {
      return response.status(400).json({
        error: "Only PDF files are allowed",
      });
    }

    const db = mongoose.connection.db;

    const bucket = new GridFSBucket(db, {
      bucketName: "invoices",
    });

    const uploadStream = bucket.openUploadStream(
      file.originalname,
      {
        contentType: "application/pdf",
      }
    );

    uploadStream.end(file.buffer);

    uploadStream.on("finish", () => {
      return response.status(200).json({
        fileId: uploadStream.id,
        filename: file.originalname,
      });
    });

    uploadStream.on("error", (error) => {
      console.error("GridFS upload error:", error);

      return response.status(500).json({
        error: "Could not upload invoice",
      });
    });
  } catch (error) {
    console.error("Invoice upload error:", error);

    return response.status(500).json({
      error: error.message || "Invoice upload failed",
    });
  }
}