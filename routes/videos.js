const express = require("express");
const fs = require("node:fs");
const { v4 } = require("uuid");
//const thumbnail = require("../public/images/Upload-video-preview.jpg");

const FILE = "./data/videos.json";

const router = express.Router();

router.get("/", get);
router.get("/:id", getID);
router.post("/", post);
router.post("/:id/comments", postComment);
router.delete("/:id/comments/:commentId", deleteComment);
router.put("/:id/comments/:commentId", likes);

function get(_req, res) {
  res.json(readVideos());
}
function getID(req, res) {
  const videos = readVideos();
  const id = req.params.id;

  // Find the video with the specified id
  const video = videos.find((video) => video.id === id);

  if (video) {
    res.json(video);
  } else {
    res.status(404).send("Video not found");
  }
}

function post(req, res) {
  const videos = readVideos();
  const { title, description } = req.body;

  const newVideo = {
    id: v4(),
    title,
    channel: "Abdullah Imran",
    image: "http://localhost:8080/images/Upload-video-preview.jpg",
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

function postComment(req, res) {
  const videos = readVideos();
  const { name, comment } = req.body;
  const id = req.params.id;

  const video = videos.find((video) => video.id === id);
  const newComment = {
    name,
    comment,
    id: v4(), // Assign a unique id to the comment
    timestamp: Date.now(),
  };

  if (video) {
    video.comments.push(newComment);
    writeVideos(videos);
    res.status(201);
  } else {
    res.status(404).send("Video not found");
  }
}

function deleteComment(req, res) {
  const videos = readVideos();
  const videoId = req.params.id;
  const commentId = req.params.commentId.toString();

  // Find the video with the specified id
  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  // Find the comment with the specified id in the video's comments array
  const commentIndex = video.comments.findIndex(
    (comment) => comment.id === commentId
  );

  if (commentIndex === -1) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Remove the comment from the video's comments array
  const deletedComment = video.comments.splice(commentIndex, 1);
  console.log(deletedComment);
  writeVideos(videos);
  res.status(201);
}

function likes(req, res) {
  const videos = readVideos();
  const videoId = req.params.id;

  const commentId = req.params.commentId;

  // Find the video with the specified id
  const video = videos.find((video) => video.id === videoId);
  //console.log(video);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  // Find the comment with the specified id in the video's comments array
  const commentIndex = video.comments.findIndex(
    (comment) => comment.id === commentId
  );

  if (commentIndex === -1) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Remove the comment from the video's comments array
  const updatedlikes = video.comments[commentIndex].likes++;

  writeVideos(videos);
  res.status(201);
}

function readVideos() {
  const file = fs.readFileSync(FILE);
  return JSON.parse(file);
}

function writeVideos(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes));
}

module.exports = router;
