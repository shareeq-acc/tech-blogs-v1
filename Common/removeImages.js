import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = "../Files/images";

// This Function Removes The Files/Images from the server once they are uploaded to the 3rd Party Cloud Storage (even if there is an error uploading, since the image would be resent) 
const destroyFiles = () => {
  console.log("Destroying File")
  fs.readdir(path.join(__dirname, directory), (err, files) => {
    if(err){
      console.log("Error Destroying File")
    }
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(__dirname, directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

export default destroyFiles;
