// code from https://www.youtube.com/watch?v=EA3-k9mnLHs&ab_channel=TheCodingTrain
// code from https://www.youtube.com/watch?v=OIo-DIOkNVg&ab_channel=TheCodingTrain
// code from https://idmnyu.github.io/p5.js-speech/

let video;
let poseNet;
let pose;

let eyeL, eyeR, mouthX, 
mouthY, faceSize, col, skeleton;

let ang, d, scl;

let ready = false;

let fontB, bg;

// code from https://idmnyu.github.io/p5.js-speech/ ------------------------------- Start
var myRec = new p5.SpeechRec('en-US', draw); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true; // allow partial recognition (faster, less accurate)

var x, y;
var dx, dy;

var socket;
// code from https://idmnyu.github.io/p5.js-speech/ ------------------------------- End

function setup() {
  createCanvas(1080, 720);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  fontB = loadFont('assets/Montserrat-B.ttf');
  bg = loadImage('assets/bg.jpg'); 

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', gotPoses);

  eyeL = createVector(0, 0);
  eyeR = createVector(0, 0);
  
  // code from https://idmnyu.github.io/p5.js-speech/ ------------------------------- Start
  textSize(60);
  textFont(fontB);
	textAlign(CENTER);
  myRec.start(); // start engine
	// client-side socket.io:
	socket = io();
	
  // Had to comment the noLoop(); part out from the orginal code b/c it stops the program from 
  // going into the draw function stoping me from using posenet      

	// noLoop(); // info on noLoop -> https://p5js.org/reference/#/p5/noLoop

  // code from https://idmnyu.github.io/p5.js-speech/ ------------------------------- End
}

function gotPoses(poses) {
  // console.log(poses);
  // let newX = pose[0].pose.keypoints[0].position.x;
  // let newY = pose[0].pose.keypoints[0].position.y;

  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    // ang = atan2(poses[0].pose.keypoints[2].position.y - poses[0].pose.keypoints[1].position.y, poses[0].pose.keypoints[2].position.x - poses[0].pose.keypoints[1].position.x);
    d = int(dist(poses[0].pose.keypoints[1].position.x, poses[0].pose.keypoints[1].position.y, poses[0].pose.keypoints[2].position.x, poses[0].pose.keypoints[2].position.y));
    

    eyeL.x = poses[0].pose.keypoints[1].position.x;
    eyeL.y = poses[0].pose.keypoints[1].position.y;
    eyeR.x = poses[0].pose.keypoints[2].position.x;
    eyeR.y = poses[0].pose.keypoints[2].position.y;
  }

}

function modelReady(){
  // console.log('model ready');
  ready = true;
}


function draw() {

  // code from https://editor.p5js.org/enickles/sketches/rJ9j1sx0M
  push();
  translate(width,0);
  scale(-1, 1);
  // image(video, 0, 0, width, height);

  let r = random(1, 3);
  
  // background(0);
  background(bg);

  // trying to find the range of the mouth
  if (ready) {
    let midX = ((eyeR.x - eyeL.x) / 2) + eyeL.x + d;
    let midY = ((eyeR.y - eyeL.y) / 2) + (eyeL.y + d * 1.5);
    // console.log("x: " + midX);
    // console.log("y: " + midY);
    // console.log(d);
    mouthX = midX;
    mouthY = midY;
  }
  
  if(pose){

    col = video.get(pose.nose.x, pose.nose.y - 200);
    
    // code from https://www.youtube.com/watch?v=OIo-DIOkNVg&ab_channel=TheCodingTrain ------------ Start
    for (let i = 5; i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      noStroke();
      fill(col);
      ellipse(x,y,d,d);
  
    }

    strokeWeight(d);
    stroke(col);
    for (let i = 0; i < skeleton.length; i++){
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    // code from https://www.youtube.com/watch?v=OIo-DIOkNVg&ab_channel=TheCodingTrain ------------ End


    noStroke();
    // trying to approximate face size 
    faceSize = pose.rightEar.x - pose.leftEar.x;

    fill(col);
    ellipse(pose.nose.x, pose.nose.y/1.1, faceSize*1.2, faceSize*1.5);

    strokeWeight(3);
    stroke(0);

    line(eyeR.x, eyeR.y, pose.rightEar.x, pose.rightEar.y/1.05);
    line(eyeL.x, eyeL.y, pose.leftEar.x, pose.leftEar.y/1.05);
    
    // Mouth
    noStroke();
    fill('#EBB5B8');
    ellipse(pose.nose.x, pose.nose.y*1.05, d*1.1, d/(r*2));

  }

  strokeWeight(3);
  stroke(0);
  line(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
  
  strokeWeight(3);
  stroke(0);
  fill('#FAD6A5');
  ellipse(eyeR.x,eyeR.y, d/1.5);
  ellipse(eyeL.x,eyeL.y, d/1.5);



  pop();

    // code from https://idmnyu.github.io/p5.js-speech/ ------------------------------- Start
    // recognition system will often append words into phrases.
    var res = myRec.resultString;
    // text(res, width/2, height/4); // orginal code
    fill('#FAD6A5');
    strokeWeight(2);
    stroke(0);
    text(res, 300, 100, 500, 150); // repositioned and constricted
    console.log(res);
    socket.emit('result', { 'word': res });
    // code from https://idmnyu.github.io/p5.js-speech/ ------------------------------- End
}