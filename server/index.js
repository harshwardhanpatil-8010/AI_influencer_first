const express = require("express");
const cors = require("cors");
const avatarRoutes = require("./routes/avatar");
const generateRoutes = require("./routes/generate");
const webhookRoutes = require("./routes/webhooks");
const instagramRoutes = require("./routes/instagram");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/avatar", avatarRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/instagram", instagramRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
