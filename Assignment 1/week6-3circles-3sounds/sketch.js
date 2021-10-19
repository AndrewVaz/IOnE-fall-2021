/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0, diameter1 = 0, diameter2 = 0;

let osc1, osc2, osc3, fft;

function setup() {

  createCanvas(windowWidth, windowHeight);

  ///////////////////////////////////////////////////////////////////
  //Begin serialport library methods, this is using callbacks
  ///////////////////////////////////////////////////////////////////    


  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM3");
  /////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);


}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////


osc1 = new p5.TriOsc(); // set frequency and type
osc1.amp(.5);
osc2 = new p5.TriOsc(); // set frequency and type
osc2.amp(.5);
osc3 = new p5.TriOsc(); // set frequency and type
osc3.amp(.5);

fft = new p5.FFT();
osc1.start();
osc2.start();
osc3.start();

// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  diameter0 = splitter[0];                 //put the first sensor's data into a variable
  diameter1 = splitter[1];
  diameter2 = splitter[2];
}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {
  // Part 2---------------------------------------------------------------------------------------------------------------
  noStroke();
  background(0, 0, 0);
  text(latestData, 10, 10);

  ellipseMode(RADIUS);
  fill(255, 255, 0);
  ellipse(windowHeight - 300, windowWidth / 4, diameter1 * 0.2, diameter1 * 0.2);
  ellipse(windowHeight + 300, windowWidth / 4, diameter1 * 0.2, diameter1 * 0.2);


  ellipseMode(RADIUS);
  fill(200, 10, 0);
  noStroke();
  //console.log("diameter0  "  + diameter0);
  ellipse(windowHeight - 300, windowWidth / 4, diameter0 * 100, diameter1 * .1);
  ellipse(windowHeight + 300, windowWidth / 4, diameter0 * 100, diameter1 * .1);


  ellipseMode(RADIUS);
  fill(0, 0, 50);
  ellipse(windowHeight - 300, windowWidth / 4, diameter2 * 5, diameter1 * 0.08);
  ellipse(windowHeight + 300, windowWidth / 4, diameter2 * 5, diameter1 * 0.08);

  // ellipseMode(RADIUS);
  noFill();
  strokeWeight(20);
  stroke(255, 0, 0);
  arc(windowHeight, windowWidth / 5, diameter1 /1.25, 500, 0, PI / 1);
  // console.log(diameter1);

  var freq = map(diameter0, -diameter0, width, -1000, 100);
  osc1.freq(tan(freq));
  //console.log(freq);

  var freq2 = map(-diameter1, 0, -width, 500, 100);
  osc2.freq(freq2);
  //console.log(freq2);
  // Part 2---------------------------------------------------------------------------------------------------------------
  
  // Part 3---------------------------------------------------------------------------------------------------------------

  /*
  noStroke();
  // background(0, 0, 0);
  background(255);
  // text(latestData, 10, 10);

  ellipseMode(RADIUS);
  // fill(255, 255, 0);
  fill(40, 100, 100, 30);
  // ellipse(windowHeight - 300, windowWidth / 4, diameter1 * 0.2, diameter1 * 0.2);
  // ellipse(windowHeight + 300, windowWidth / 4, diameter1 * 0.2, diameter1 * 0.2);

  ellipse(windowHeight - 300, windowWidth / (diameter1 / 100), diameter1 * 0.2, diameter1 * 0.2);
  fill(255, 50, 100, 75);
  ellipse(windowHeight + 400, windowWidth / (diameter1 / 50), diameter1 * 0.03, diameter1 * 0.1);
  fill(40, 100, 255, 50);
  ellipse(windowHeight / (diameter1 / 50), windowWidth / 4, diameter1 * 0.01, diameter1 * 1);
  fill(255, 0, 100, 20);
  rect(windowHeight - 100 / (diameter1 / 200), windowWidth / 4, diameter1 * 0.1, diameter1 * 0.1);

  fill(40, 255, 100, 50);
  // code from https://p5js.org/examples/hello-p5-simple-shapes.html
  translate(diameter1 * 1.5, windowWidth / 2.5);
  for (let i = 0; i < 10; i++) {
    ellipse(100, sin(5), diameter1 * 0.1, tan(80));
    rotate(PI / 5);
  }

  fill(40, 2, 100, 50);
  // code from https://p5js.org/examples/hello-p5-simple-shapes.html
  translate(diameter1 / sin(diameter1), -diameter1 / 2);
  for (let i = 5; i < 10; i++) {
    ellipse(1000, tan(100), diameter1, cos(500));
    rotate(PI / 5);
  }
  noFill();
  strokeWeight(20);
  stroke(255, 0, 0);
  
  
  var freq = map(diameter0, -diameter1, height, -2, 5);
  osc1.freq(freq*freq3);
  //console.log(freq);

  var freq3 = map(diameter2 * 10, 0, width, 500, 1000);
  osc3.freq(freq3*freq);
  //console.log(freq3); 
  */
  // Part 3---------------------------------------------------------------------------------------------------------------
}


function mouseClicked() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("getAudioContext().state" + getAudioContext().state);
  }
};





