import cloudinary from "../Utility/cloudinary.js";
import destroyFiles from "./removeImages.js";

// This Function Uploads File to Cloudinary (3rd Party Cloud Storage)
const uploadFile = async (filePath, uploadPreset) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      upload_preset: uploadPreset,
    });
    destroyFiles()
    return {
      error: false,
      success: true,
      url: uploadResponse.secure_url,
      name: uploadResponse.original_filename,
    };
  } catch (error) {
    console.log(error.message);
    destroyFiles()
    return {
      error: true,
      serverError: true,
      success: false,
      message: "Something went wrong. Please Try again",
    };
  }
};

export default uploadFile;
