import cloudinary from "../Utility/cloudinary.js";

// This Function Deleted Blog Images When a blog is deleted
const deleteBlogImage = async (fileUrl) => {
    const filename = fileUrl.split("/").slice(-1)[0].split(".")[0]
    cloudinary.v2.uploader.destroy(filename, (error, result) => {
        if (error) {
            console.log("Failed to Delete image")
            console.log(error)
            return false
        }
        if (result){
            // Deleted File
            return true
        }
    });

};

export default deleteBlogImage;
