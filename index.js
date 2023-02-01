const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const FILE_STORAGE_PATH = __dirname + "/server_files";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend for file-viewer.");
});

app.get("/api/files", (req, res) => {
  const dirPath = req.query.dir_path || "";
  const fullPath = path.join(FILE_STORAGE_PATH, dirPath);

  fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send();
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
  const filePath = req.query.file_path || "";
  const fullPath = path.join(FILE_STORAGE_PATH, filePath);
  res.sendFile(fullPath);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
