let secAngle, minuteAngle, hourAngle;
let cosMin, sinMin, cosHr, sinHr, cosSec, sinSec;
let secSpacing = 20, minSpacing = 40, hrSpacing = 80;

//[pen down, pen up] // second number needs to be negative for .pat file
let secDash = [10, -10];
let minDash = [10, 0];
let hrDash = [10, 0];

function setup() {
  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);

  secCanvas = createGraphics(100, 100);
  hrCanvas = createGraphics(100, 100);
  minCanvas = createGraphics(100, 100);

  updateCanvas();

  //information tag
  textFont('Times');
  let fontSize = 16;
  textSize(fontSize);
  stickerWidth = textWidth("click anywhere to download a timely hatch") + 20;
  stickerHeight = textAscent()+textDescent()+10;
  sticker = createGraphics(stickerWidth, stickerHeight);
  sticker.textFont('Times');
  sticker.textSize(fontSize);
//  sticker.textWidth("click anywhere to download a timely hatch");
  sticker.textAlign(CENTER, CENTER);

}

function draw() {

  secAngle = round(90 - (map(second(), 0, 60, 0, 360)));
  minuteAngle = round(90 - (map(minute(), 0, 60, 0, 360)));
  hourAngle = round(90 - (map(hour() % 12, 0, 12, 0, 360)));

  cosSec = cos(round(radians(secAngle), 2));
  sinSec = sin(round(radians(secAngle), 2));

  cosMin = cos(round(radians(minuteAngle), 2));
  sinMin = sin(round(radians(minuteAngle), 2));

  cosHr = cos(round(radians(hourAngle), 2));
  sinHr = sin(round(radians(hourAngle), 2));

  //update colour
  myColour = colourUpdate();
  background(myColour); //should change over time

  //second display 
  push();
  translate(width / 2, height / 2);
  rotate(-radians(secAngle));
  image(secCanvas, -secCanvas.width / 2, -secCanvas.height / 2);
  pop();

  //minute display
  push();
  translate(width / 2, height / 2);
  rotate(-radians(minuteAngle));
  image(minCanvas, -secCanvas.width / 2, -secCanvas.height / 2);
  pop();

  //hour display
  push();
  translate(width / 2, height / 2);
  rotate(-radians(hourAngle));
  image(hrCanvas, -secCanvas.width / 2, -secCanvas.height / 2);
  pop();

  // DRAW STICKER
  stickerDisplay(myColour);

  // DRAW CLOCK
  drawClock(125, myColour);
}

function mouseClicked() {

  //open 
  let writer = createWriter(nf(hour(),2,0) + "h" + nf(minute(),2,0) + "_" + nf(second(),2,0) + '.pat');
  writer.write(["*" + nf(hour(),2,0) + "h" + nf(minute(),2,0) + "_" + nf(second(),2,0) + '\n']);

  //write seconds line
  writer.write([str(secAngle) + ",0,0,0," + str(secSpacing) + "," + str(secDash[0]) + "," + str(secDash[1]) + "\n"]);

  //write minutes line
  writer.write([str(minuteAngle) + ",0,0,0," + str(minSpacing) + "," + str(minDash[0]) + "," + str(minDash[1]) + "\n"]);

  //write hours line
  writer.write([str(hourAngle) + ",0,0,0," + str(hrSpacing) + "," + str(hrDash[0]) + "," + str(hrDash[1]) + "\n"]);

  writer.close();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateCanvas();
}

function updateCanvas() {

  //finding the largest of the 2 dimensions
  let dimensions = [width, height];
  sort(dimensions);
  
  //multiply by 3 so that the canvases are 3x the size of the largest dim
  let canvasDim = dimensions[1] * 3;

  // Seconds Canvas

  secCanvas.resizeCanvas(canvasDim, canvasDim);
  secCanvas.drawingContext.setLineDash([10, 10]);
  secCanvas.strokeWeight(1);
  secCanvas.stroke(255);
  let secLines = canvasDim / secSpacing;
  for (let i = 0; i < secLines; i++) {
    secCanvas.line(0, i * secSpacing, canvasDim, i * secSpacing);
  }

  // Minutes Canvas
  minCanvas.resizeCanvas(canvasDim, canvasDim);
  minCanvas.strokeWeight(1);
  minCanvas.stroke(255);
  let minLines = canvasDim / minSpacing;
  for (let i = 0; i < minLines; i++) {
    minCanvas.line(0, i * minSpacing, canvasDim, i * minSpacing);
  }

  // Hours Canvas
  hrCanvas.resizeCanvas(canvasDim, canvasDim);
  hrCanvas.strokeWeight(1);
  hrCanvas.stroke(255);

  let hrLines = canvasDim / hrSpacing;
  for (let i = 0; i < hrLines; i++) {
    hrCanvas.line(0, i * hrSpacing, canvasDim, i * hrSpacing);

  }
}

function stickerDisplay(stickerColour) {

  sticker.clear();
  sticker.fill(stickerColour);

  //sticker.strokeWeight(1.5);
  sticker.stroke(255);

  sticker.rect(0, 0, sticker.width-1, sticker.height);
  sticker.noStroke();
  sticker.fill(200);
  sticker.text("click anywhere to download a timely hatch", sticker.width / 2, sticker.height / 2);
  image(sticker, 10, height - sticker.height - 10);

}

function drawClock(diameter, clockColour) {

  let circleX = mouseX + diameter * 0.4;
  let circleY = mouseY - diameter * 0.4;
  let minHand = diameter * 0.4;
  let hrHand = diameter * 0.3;
  let secHand = diameter * 0.45

  fill(clockColour);

  stroke(255);
  strokeWeight(1);

  circle(circleX, circleY, diameter);

  //draw seconds hand
  line(circleX, circleY, circleX + cosSec * secHand, circleY - sinSec * secHand);

  strokeWeight(1.5); //thicker lineweight for hour and minute hands

  //draw minute hand
  line(circleX, circleY, circleX + cosMin * minHand, circleY - sinMin * minHand);

  //draw hour hand
  line(circleX, circleY, circleX + cosHr * hrHand, circleY - sinHr * hrHand);


}

function colourUpdate() {
  
  // angle cycle every 10min, colour cycle every 5 min
  let colourAngle = round(map((minute() * 60 + second()) % (600), 0, 600, 0, 360));
  let sinColour = sin(round(radians(colourAngle), 2));
  let colour1 = color(220, 20, 60),
    colour2 = color(0, 0, 255);
  return lerpColor(colour1, colour2, (1 + sinColour) / 2);

}