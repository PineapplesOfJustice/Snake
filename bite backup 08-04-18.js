var namespace = "http://www.w3.org/2000/svg";

var gridSize = 10;
var gridX = 100;
var gridY = 47;
document.getElementById("canvas").setAttribute("viewBox", "0 0 " + (gridX*gridSize) + " " + (gridY*gridSize))


var mode;
var difficulty;
var gameEnd = false;

var food = [];

/*
var snake1 = [];
var snake2 = [];
var snake1Length = 4;
var snake2Length = 4;

var direction1X = 1;
var direction1Y = 0;
var direction2X = 1;
var direction2Y = 0;

var snake1X = 0;
var snake1Y = gridY-1;
var snake2X = gridX-1;
var snake2Y = 0;
*/

var snake = [{data: [], maxLength: 4, directionX: 1, directionY: 0, positionX: 0, positionY: gridY-1},
             {data: [], maxLength: 4, directionX: -1, directionY: 0, positionX: gridX-1, positionY: 0},];

function changeGameMode(data){
  document.getElementById("modeScreen").style.display = "none";
  document.getElementById("difficultyScreen").style.display = "inline";  
  mode = data;  
}

function changeDifficulty(data){
  document.getElementById("difficultyScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "inline";
  document.body.style.backgroundImage = "url('Images/Sand Background.jpg')";  
  difficulty = data; 
  displayTutorialAgain();
}

function startGame(){
  for(var x=0; x<=gridX; x++){
    makeLine((x*gridSize), 0, (x*gridSize), (gridY*gridSize), "black", 1, 0.08);
  }

  for(var y=0; y<=gridY; y++){
    makeLine(0, (y*gridSize), (gridX*gridSize), (y*gridSize), "black", 1, 0.08);  
  }  
  
  
  snake[0].data[snake[0].data.length] = makeRect(snake[0].positionX*gridSize, snake[0].positionY*gridSize, gridSize, gridSize, "green", 1); 
  createFood();
    
  document.addEventListener('keydown', keyPress);   
  startAnimation(30);  
}

function createFood(){
  var foodPositionX = (Math.floor(Math.random()*gridX)+1)*gridSize; 
  var foodPositionY = (Math.floor(Math.random()*gridY)+1)*gridSize;  
  food[food.length] = makeRect(foodPositionX, foodPositionY, gridSize, gridSize, "black", 1);
  for(var i=0, length=snake[0].data.length; i<length; i++){
    if(foodPositionX == (snake[0].data[i].getAttribute("x")/gridSize) && foodPositionY == (snake[0].data[i].getAttribute("y")/gridSize) ){
      food[food.length-1].remove;
      food.pop();
      createFood();  
    }  
  }
  for(var i=0, length=food.length; i<length; i++){
    if(foodPositionX == (food[i].getAttribute("x")/gridSize) && foodPositionY == (food[i].getAttribute("y")/gridSize) ){
      food[food.length-1].remove;
      food.pop();
      createFood();  
    }  
  }
}

function keyPress(event){
  var key = event.keyCode;
  console.log(key);
    
  // W Key  
  if(key == 87 && snake[0].directionY != 1){
    snake[0].directionX = 0;
    snake[0].directionY = -1;  
  }  
    
  // A Key  
  else if(key == 65 && snake[0].directionX != 1){
    snake[0].directionX = -1;
    snake[0].directionY = 0;  
  }  
    
  // S Key  
  else if(key == 83 && snake[0].directionY != -1){
    snake[0].directionX = 0;
    snake[0].directionY = 1;  
  }  
    
  // D Key  
  else if(key == 68 && snake[0].directionX != -1){
    snake[0].directionX = 1;
    snake[0].directionY = 0;  
  } 
    
  // Up Key  
  if(key == 38 && snake[1].directionY != 1){
    snake[1].directionX = 0;
    snake[1].directionY = -1;  
  }  
    
  // Left Key  
  else if(key == 37 && snake[1].directionX != 1){
    snake[1].directionX = -1;
    snake[1].directionY = 0;  
  }  
    
  // Down Key  
  else if(key == 40 && snake[1].directionY != -1){
    snake[1].directionX = 0;
    snake[1].directionY = 1;  
  }  
    
  // Right Key  
  else if(key == 39 && snake[1].directionX != -1){
    snake[1].directionX = 1;
    snake[1].directionY = 0;  
  }  
    
}

// Used StackFlow

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;


function startAnimation(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    console.log(startTime);
    gameAnimation();
}


function gameAnimation(newtime) {
  // calc elapsed time since last loop
  now = newtime;
  elapsed = now - then;
  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but...
    // Also, adjust for fpsInterval not being multiple of 16.67
    then = now - (elapsed % fpsInterval);
    // draw stuff here   
    snake[0].positionX = snake[0].positionX+snake[0].directionX;  
    snake[0].positionY = snake[0].positionY+snake[0].directionY;
    checkForFood(0);
    checkForObstacle(0);    
    snake[0].data[snake[0].data.length] = makeRect(snake[0].positionX*gridSize, snake[0].positionY*gridSize, gridSize, gridSize, "black", 1);  
    if(snake[0].data.length > snake[0].maxLength){ snake[0].data[0].remove(); snake[0].data.shift(); }  
  }
  // request another frame
  if(!gameEnd){ requestAnimationFrame(gameAnimation); }
}

function checkForFood(snakeId){
  for(var i=0, length=food.length; i<length; i++){
    if(snake[snakeId].positionX == (food[i].getAttribute("x")/gridSize) && snake[snakeId].positionY == (food[i].getAttribute("y")/gridSize)){
      snake[snakeId].maxLength += 1;
      food[i].remove();
      food.splice(i, 1);
      createFood();  
    }
  }  
}

function checkForObstacle(snakeId){
  if(snake[snakeId].positionX == gridX || snake[snakeId].positionX == -1 || snake[snakeId].positionY == gridY || snake[snakeId].positionY == -1){
    gameOver();  
  }
  else{
    for(var i=0, length=snake[0].data.length; i<length; i++){
      if(snake[snakeId].positionX == (snake[0].data[i].getAttribute("x")/gridSize) && snake[snakeId].positionY == (snake[0].data[i].getAttribute("y")/gridSize)){
        gameOver();  
      }  
    }  
  }  
}


function gameOver(){
  gameEnd = true;  
  var blackScreen = makeRect(0, 0, (gridX*gridSize), (gridY*gridSize), "black", 0.4);  
  var gameOverTextBackground = makeText("Game Over", 338.5, 146, 64, "Special Elite", "white", 1);
  var gameOverText = makeText("Game Over", 339.5, 145, 64, "Special Elite", "black", 1);
  var restartButton = makeRect(447, 210, 106, 20, "white", 1);  
  var restartText = makeText("Restart", 470, 224.5, 15, "Special Elite", "black", 1)  
  var titleButton = makeRect(447, 250, 106, 20, "white", 1);  
  var titleText = makeText("Title Scr.", 470, 264.5, 15, "Special Elite", "black", 1)  
}

//Used W3School
//Draggable Tutorial

dragElement(document.getElementById("tutorialSpace"));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}



function displayTutorialAgain(){
  document.getElementById("tutorialSpace").setAttribute("style", "display: inline; top: 50%; left: 50%; transform: (-50%, -50%);");  
  slide = 1;  
  displayNextSlide();
}

function hideTutorialSpace(){
  document.getElementById("tutorialSpace").setAttribute("style", "display: none;");    
  startGame();  
}

var slide=1;
function displayNextSlide(){
  if(slide == 1){}
}


// DO NOT EDIT CODE BELOW THIS LINE!
function getX(shape) {
  if (shape.hasAttribute("x")) {
    return parseFloat(shape.getAttribute("x"))
  } else {
    return parseFloat(shape.getAttribute("cx"))
  }  
}

function getY(shape) {
  if (shape.hasAttribute("y")) {
    return parseFloat(shape.getAttribute("y"))
  } else {
    return parseFloat(shape.getAttribute("cy"))
  }   
}

function setX(shape, x) {
  if (shape.hasAttribute("x")) {
    shape.setAttribute("x", x)
  } else {
    shape.setAttribute("cx", x)
  } 
}

function setY(shape, y) {
  if (shape.hasAttribute("y")) {
    shape.setAttribute("y", y)
  } else {
    shape.setAttribute("cy", y)
  } 
}

function move(shape, dx, dy) {
  if (shape.hasAttribute("x") && shape.hasAttribute("y")) {
    var x = parseFloat(shape.getAttribute("x"))
    var y = parseFloat(shape.getAttribute("y"))
    shape.setAttribute("x", x + dx)
    shape.setAttribute("y", y + dy)
  } else {
    var cx = parseFloat(shape.getAttribute("cx"))
    var cy = parseFloat(shape.getAttribute("cy"))
    shape.setAttribute("cx", cx + dx)
    shape.setAttribute("cy", cy + dy)
  }
}

function makeCircle(cx, cy, r, fill, opacity) {
  var circle = document.createElementNS(namespace, "circle")
  circle.setAttribute("cx", cx)
  circle.setAttribute("cy", cy)
  circle.setAttribute("r", r)
  circle.setAttribute("fill", fill)
  circle.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(circle)
  return circle
}

function makeRect(x, y, width, height, fill, opacity) {
  var rect = document.createElementNS(namespace, "rect")
  rect.setAttribute("x", x)
  rect.setAttribute("y", y)
  rect.setAttribute("width", width)
  rect.setAttribute("height", height)
  rect.setAttribute("fill", fill)
  rect.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(rect)
  return rect
}

function makeEllipse(cx, cy, rx, ry, fill, opacity) {
  var ellipse = document.createElementNS(namespace, "ellipse")
  ellipse.setAttribute("cx", cx)
  ellipse.setAttribute("cy", cy)
  ellipse.setAttribute("rx", rx)
  ellipse.setAttribute("ry", ry)
  ellipse.setAttribute("fill", fill)
  ellipse.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(ellipse)
  return ellipse
}

function makeLine(x1, y1, x2, y2, stroke, strokeWidth, opacity) {
  var line = document.createElementNS(namespace, "line")
  line.setAttribute("x1", x1)
  line.setAttribute("y1", y1)
  line.setAttribute("x2", x2)
  line.setAttribute("y2", y2)
  line.setAttribute("stroke", stroke)
  line.setAttribute("stroke-width", strokeWidth)
  line.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(line)
  return line
}

function makePolyline(points, stroke, strokeWidth, opacity) {
  var polyline = document.createElementNS(namespace, "polyline")
  polyline.setAttribute("points", points)
  polyline.setAttribute("stroke", stroke)
  polyline.setAttribute("stroke-width", strokeWidth)
  polyline.setAttribute("opacity", opacity)
  polyline.setAttribute("fill", "none")
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(polyline)
  return polyline
}

function makePolygon(points, fill, opacity) {
  var polygon = document.createElementNS(namespace, "polygon")
  polygon.setAttribute("points", points)
  polygon.setAttribute("opacity", opacity)
  polygon.setAttribute("fill", fill)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(polygon)
  return polygon
}

function makeText(message, x, y, fontSize, fontFamily, fill, opacity) {
  var text = document.createElementNS(namespace, "text")
  text.innerHTML = message
  text.setAttribute("x", x)
  text.setAttribute("y", y)
  text.setAttribute("font-size", fontSize)
  text.setAttribute("font-family", fontFamily)
  text.setAttribute("fill", fill)
  text.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(text)
  return text
}

function makeImage(url, x, y, width, height, opacity) {
  var image = document.createElementNS(namespace, "image")
  image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url)
  image.setAttribute("x", x)
  image.setAttribute("y", y)
  image.setAttribute("width", width)
  image.setAttribute("height", height)
  image.setAttribute("opacity", opacity)
  
  var canvas = document.getElementById("canvas")
  canvas.appendChild(image)
  return image
}

function collides(rect1, rect2) {
  var centerX = getX(rect1) + parseFloat(rect1.getAttribute("width"))/2
  var centerY = getY(rect1) + parseFloat(rect1.getAttribute("height"))/2
  return (centerX > getX(rect2) && 
          centerX < getX(rect2) + parseFloat(rect2.getAttribute("width")) &&
         centerY > getY(rect2) &&
         centerY < getY(rect2) + parseFloat(rect2.getAttribute("height")))
}
