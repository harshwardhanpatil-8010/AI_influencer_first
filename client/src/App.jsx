import React, { useState } from "react";
import axios from "axios";

const avatars = [
  { name: "Anna", img: "https://i.imgur.com/AxZzZ3v.png" },
  { name: "Max", img: "https://i.imgur.com/Ci5JlRA.png" }
];

export default function App() {
  const [script, setScript] = useState("");
  const [avatar, setAvatar] = useState(avatars[0].name);
  const [videoUrl, setVideoUrl] = useState("");

  const handleGenerate = async () => {
    const res = await axios.post("http://localhost:5000/api/generate", { script, avatar });
    setVideoUrl(res.data.videoUrl);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Influencer Generator</h1>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows="6"
        placeholder="Type your script here..."
        style={{ width: "100%", marginBottom: 10 }}
      />
      <div>
        {avatars.map((a) => (
          <label key={a.name} style={{ marginRight: 10 }}>
            <input
              type="radio"
              value={a.name}
              checked={avatar === a.name}
              onChange={() => setAvatar(a.name)}
            />
            <img src={a.img} alt={a.name} width="50" />
          </label>
        ))}
      </div>
      <button onClick={handleGenerate}>Generate Video</button>
      <br />
      {videoUrl && (
        <video controls width="500" style={{ marginTop: 20 }}>
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}