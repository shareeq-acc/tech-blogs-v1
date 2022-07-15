import multer from "multer";

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Files");
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
