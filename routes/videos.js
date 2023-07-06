const express = require("express");
const fs = require("node:fs");
const { v4 } = require("uuid");

const FILE = "./data/videos.json";

const router = express.Router();

router.get("/", get);
router.get("/:id", getID);
router.post("/", post);

function get(req, res) {
  console.log("received");
  res.json(readVideos());
}
function getID(req, res) {
  console.log("received");
  const videos = readVideos();
  const id = req.params.id;

  const video = videos.find((video) => video.id === id);

  if (video) {
    res.json(video);
  } else {
    res.status(404).send("Video not found");
  }
}

function post(req, res) {
  const videos = readVideos();

  console.log(req.body);

  const { title, description } = req.body;

  const newVideo = {
    id: v4(),
    title,
    channel: "",
    image: "",
    description,
    views: "1,001,023",
    likes: "110,985",
    duration: "4:01",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: 1626032763000,
    comments: [],
  };

  videos.push(newVideo);
  writeVideos(videos);
  res.send("ok");
}

function readVideos() {
  const file = fs.readFileSync(FILE);
  return JSON.parse(file);
}

function writeVideos(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes));
}

module.exports = router;
