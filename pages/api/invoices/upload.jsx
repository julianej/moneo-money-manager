import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(request, response) {

console.log("Cloudinary config:", {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  hasApiSecret: Boolean(
    process.env.CLOUDINARY_API_SECRET
  ),
});


  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const form = formidable({
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(request);

    const uploadedFile = Array.isArray(files.file)
      ? files.file[0]
      : files.file;

    if (!uploadedFile) {
      return response.status(400).json({
        error: "No PDF file uploaded",
      });
    }

    if (uploadedFile.mimetype !== "application/pdf") {
      return response.status(400).json({
        error: "Only PDF files are allowed",
      });
    }

    const result = await cloudinary.uploader.upload(
      uploadedFile.filepath,
      {
        resource_type: "raw",
        folder: "money-manager/invoices",
        use_filename: true,
        unique_filename: true,
      }
    );

    fs.unlinkSync(uploadedFile.filepath);

    return response.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      filename: uploadedFile.originalFilename,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return response.status(500).json({
      error: error.message || "Invoice upload failed",
    });
  }
}