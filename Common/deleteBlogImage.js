import cloudinary from "../Utility/cloudinary.js";
const deleteBlogImage = async (fileUrl) => {
    // const filename = fileUrl.split("/").slice(-1)[0]
    const filename = fileUrl.split("/").slice(-1)[0].split(".")[0]
    console.log(filename)
    cloudinary.v2.uploader.destroy(filename, (error, result) => {
        if (error) {
            console.log("Failed to Delete image")
            console.log(error)
            return false
        }
        if (result){
            console.log("File Deleted")
            console.log(result)
            return true
        }
    });

};

export default deleteBlogImage;
