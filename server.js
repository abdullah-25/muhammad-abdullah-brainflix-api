require("dotenv").config();
const express = require("express");
const cors = require("cors");
const videos = require("./routes/videos");
const app = express();

const PORT = process.env.PORT || 5050;

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// register routes
app.use("/videos", videos);

// go!!
app.listen(PORT, () => {
  console.log("server started on port", PORT);
});
