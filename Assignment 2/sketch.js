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

  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    const pose = poses[0].pose;
      console.log(pose);


    fill(255, 0, 0);
    const nose = pose.nose;
    ellipse(nose.x, nose.y, sin(nose.x)*40/sin(nose.y), sin(nose.y)*30);


    fill(0, 0, 0);
    const rightEye = pose.rightEye;
    ellipse(rightEye.x, rightEye.y, sin(rightEye.x)*20, sin(rightEye.y)*20/sin(rightEye.x));


    fill(0, 0, 0);
    const leftEye = pose.leftEye;
    ellipse(leftEye.x, leftEye.y, sin(leftEye.x)*20, sin(leftEye.y)*20/sin(leftEye.x));
  }
}