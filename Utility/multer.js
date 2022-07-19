import multer from "multer";
import path from 'path';
const __dirname = path.resolve();
//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "Files");
    console.log("Directory is ", __dirname)
    console.log("file is (Multer)", file)
    console.log("File Path is ", (path.join(__dirname, '..', 'Files', "images")))
    cb(null, (path.join(__dirname, '..', 'Files', "images")));
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
