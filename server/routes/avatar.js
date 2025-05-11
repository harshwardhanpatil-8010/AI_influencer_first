const express = require("express");
const multer = require("multer");
const { supabase } = require("../supabase");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.fields([{ name: "image" }, { name: "voice" }]), async (req, res) => {
  const { userId, avatarName } = req.body;
  if (!req.files.image || !req.files.voice) return res.status(400).json({ error: "Files required" });

  const [imageFile] = req.files.image;
  const [voiceFile] = req.files.voice;
  const imagePath = `avatars/${userId}-${Date.now()}-${imageFile.originalname}`;
  const voicePath = `voices/${userId}-${Date.now()}-${voiceFile.originalname}`;

  const imageUpload = await supabase.storage.from("uploads").upload(imagePath, imageFile.buffer);
  const voiceUpload = await supabase.storage.from("uploads").upload(voicePath, voiceFile.buffer);

  if (imageUpload.error || voiceUpload.error) return res.status(500).json({ error: "Upload failed" });

  const imageUrl = supabase.storage.from("uploads").getPublicUrl(imagePath).publicUrl;
  const voiceUrl = supabase.storage.from("uploads").getPublicUrl(voicePath).publicUrl;

  await supabase.from("avatars").insert({ user_id: userId, name: avatarName, image_url: imageUrl, voice_url: voiceUrl });

  res.json({ message: "Avatar uploaded", imageUrl, voiceUrl });
});

module.exports = router;
