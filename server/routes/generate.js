const express = require("express");
const axios = require("axios");
const { supabase } = require("../supabase");

const router = express.Router();

const stockAvatars = {
  Anna: "https://create-images.s3.amazonaws.com/anna-avatar.png",
  Max: "https://create-images.s3.amazonaws.com/max-avatar.png"
};

router.post("/", async (req, res) => {
  const { userId, script, avatar } = req.body;

  try {
    let imageURL = stockAvatars[avatar];
    let voiceURL = null;

    if (avatar.startsWith("custom:")) {
      const id = avatar.replace("custom:", "");
      const { data, error } = await supabase.from("avatars").select("*").eq("id", id).single();
      if (!error) {
        imageURL = data.image_url;
        voiceURL = data.voice_url;
      }
    }

    const voiceData = voiceURL
      ? await axios.get(voiceURL, { responseType: "arraybuffer" }).then(res => res.data)
      : await axios.post(
          "https://api.elevenlabs.io/v1/text-to-speech/EXAMPLE_ID",
          { text: script },
          {
            headers: {
              "xi-api-key": process.env.ELEVENLABS_API_KEY,
              "Content-Type": "application/json"
            },
            responseType: "arraybuffer"
          }
        ).then(res => res.data);

    const videoResponse = await axios.post(
      "https://api.d-id.com/talks",
      {
        script: { type: "text", input: script },
        source_url: imageURL,
        voice: { audio: Buffer.from(voiceData).toString("base64") }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DID_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ videoUrl: videoResponse.data.result_url });
  } catch (err) {
    res.status(500).json({ error: "Video generation failed", details: err.message });
  }
});

module.exports = router;
