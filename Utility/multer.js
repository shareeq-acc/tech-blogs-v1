import multer from "multer";
import path from 'path';
import fs from "fs"
const __dirname = path.resolve();
//Configuration for Multer


const multerStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   // cb(null, "Files");
  //   const fileDirectory = path.join(__dirname, '..', 'Files', "images")
  //   console.log("Directory is ", __dirname)
  //   console.log("file is (Multer)", file)
  //   console.log("File Path is ", (path.join(__dirname, '..', 'Files', "images")))
  //   fs.access(__dirname, (error) => {
  //     if (error) {
  //       console.log("Directory does not exist.")
  //     } else {
  //       console.log("Directory exists.")
  //     }
  //   })
  //   // cb(null, ("../Files"));
  //   // cb(null, (path.join(__dirname, '..', 'Files', "images")));
  //   // cb(null, (path.join(__dirname, '..', 'Files',)));
  // },
  destination: (req, file, cb) => {
    // cb(null, "Files");
    const fileDirectory = path.join(__dirname, '..', 'Files', "images")
    console.log("Directory is ", __dirname)
    console.log("file is (Multer)", file)
    console.log("File Path is ", fileDirectory)
    console.log(path.dirname(require.main.filename))
    // if (!fs.existsSync(fileDirectory)) {
    //   // fs.mkdirSync("../Files/images", { recursive: true });
    //   console.log('Making Directory')
    //   fs.mkdirSync(fileDirectory, { recursive: true }, (error) => {
    //     if (error) {
    //       console.log("Error is ", error)
    //     } else {
    //       console.log("Made a New File")
    //     }
    //   });
    // } else {
    //   console.log("Directory Exists")
    // }
    // cb(null, (path.join(__dirname, '..', 'Files', "images")));
    // cb(null, ("../Files"));
    // cb(null, (path.join(__dirname, '..', 'Files',)));
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
