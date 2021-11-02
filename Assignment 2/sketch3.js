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
  
  noStroke();

  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    const pose = poses[0].pose;
      // console.log(pose);

      const leftEar = pose.leftEar;
      const rightEar = pose.rightEar;
      const nose = pose.nose;
      let x = random(255);
      let a = random(1.2);

    fill(x, 0, x, 90);
    rect(leftEar.x, a*leftEar.y, 20, 20);
   
    fill(0, x, x, 50);
    rect(a*rightEar.x, rightEar.y, 20, 20);
    
    translate(nose.x, nose.y);
    fill(x, x, 0, x);
    for (let i = 0; i < 10; i ++) {
      ellipse(0, 30, 10, 40);
      rotate(PI/5);
    }
  }
}