import multer from "multer";
import path from 'path';
import fs from "fs"
const __dirname = path.resolve();

//Configuration for Multer

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "Files");
    const fileDirectory = path.join(__dirname, 'Files')
    console.log(fileDirectory)
    fs.access(fileDirectory, (error) => {
      if (error) {
        console.log("Directory does not exist.")
      } else {
        console.log("Directory exists.")
      }
    })
    const imagesDirector = path.join(__dirname, 'Files', "images")
    fs.readdir(imagesDirector, (err, files) => {
      console.log(files.length);
    });
    cb(null, fileDirectory);

  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `images/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const uploads = multer({
  storage: multerStorage,
});


export default uploads;
