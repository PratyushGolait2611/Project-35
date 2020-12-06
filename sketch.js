//Create variables here
var dog, happyDog, database, foodS, foodStock;
var database;
var feedTheDogButton, addFoodButton;
var foodobj;
var foodStock;
var lastFed;

function preload() {
  //load images here
  dogImage = loadImage("images/dogImg.png");
  dogImageHappy = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);

  foodObj = new Foods();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  //read game state from database
  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gameState = data.val();
  });

  dog = createSprite(800, 400, 150, 150);
  dog.addImage(dogImageHappy);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime = hour();

  if (currentTime == (lastFed + 1)) {
    update("NOT HUNGRY");
  }
  else {
    update("Hungry")
    foodObj.display();
  }

  if (gameState != "Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(dogImage);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog() {
  dog.addImage(dogImageHappy);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
    gameState: "Hungry"
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//update gameState
function update(state) {
  database.ref('/').update({
    gameState: state
  })
}
