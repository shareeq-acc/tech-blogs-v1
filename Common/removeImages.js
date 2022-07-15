import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = "../files/images";

const destroyFiles = () => {
  fs.readdir(path.join(__dirname, directory), (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(__dirname, directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

export default destroyFiles;
