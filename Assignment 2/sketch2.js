// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
var col;
var faceSize;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {outputStride:8, quantBytes:4}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);
  noStroke();

  

  if (poses.length > 0) {
    const pose = poses[0].pose;
      console.log(pose);

      // trying to approximate face size 
      faceSize = pose.rightEar.x - pose.leftEar.x;

      // from my old code 
      // gets the pixel color of the users nose and puts it into the value col
      col = video.get(pose.nose.x, pose.nose.y - 200);
      fill(col);
      ellipse(pose.nose.x, pose.nose.y - 50, faceSize*2);
  }
}