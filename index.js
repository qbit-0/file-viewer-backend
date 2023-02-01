const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const PORT = 8080;
const FILE_STORAGE_PATH = __dirname + "/server_files";

const app = express();

app.use(cors());

app.get("/api/files", (req, res, next) => {
  const dirPath = req.query.dir_path;
  let fullPath;
  if (dirPath) {
    fullPath = path.join(FILE_STORAGE_PATH, dirPath);
  } else {
    fullPath = FILE_STORAGE_PATH;
  }

  fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      next(err);
    }

    let filesRes;
    if (!files) {
      filesRes = [];
    } else {
      filesRes = files.map((file) => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        isFile: file.isFile(),
      }));
    }

    res.json(filesRes);
  });
});

app.get("/api/file", (req, res) => {
  const filePath = req.query.file_path;
  let fullPath;
  if (filePath) {
    fullPath = path.join(FILE_STORAGE_PATH, filePath);
  } else {
    fullPath = FILE_STORAGE_PATH;
  }
  res.sendFile(fullPath);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
