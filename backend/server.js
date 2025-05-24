const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());

// Handle background removal request
app.post("/api/remove-background", upload.single("image"), async (req, res) => {
  try {
    console.log(req.headers);
    console.log(req.body,req.file);
    if (!req.file) {
      console.error("❌ No file received in the request.");
      return res.status(400).send("No image uploaded.");
    }

    const imagePath = req.file.path;
    console.log(`📤 Sending image for background removal: ${imagePath}`);

    const form = new FormData();
    form.append("image", fs.createReadStream(imagePath)); // 💥 this field name MUST be 'image'

    const pythonRes = await axios.post(
      "http://localhost:5001/remove-bg",
      form,
      {
        headers: form.getHeaders(),
        responseType: "arraybuffer", // for binary image data
      }
    );

    console.log("✅ Background removed successfully.");
    res.set("Content-Type", "image/png");
    res.send(pythonRes.data);
  } catch (err) {
    console.error(`⚠️ Error processing image: ${err.message}`);
    res.status(500).send("Error processing image");
  }
});

app.listen(5000, () => {
  console.log("🚀 Node server running on http://localhost:5000");
});
