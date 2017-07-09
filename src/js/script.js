// ##
/* Static section for the script, e.g. constants and others, */

// CONSTANTS

// Main DOM selectors
var body = document.getElementsByTagName('body')[0];

// Particular element names for the action reference
var ADD_BOX_BUTTON = 'add-box-btn';
var BOX_ARENA = 'box-arena';
var REMOVE_BOX_BUTTON = 'del-box-btn';
var GAME_BUTTON_CLASS = 'game-box-btn ';
var RELOAD_BOX_BUTTON = 'refresh-btn';

// Id name for the parent div
var CONTAINER = "container";

// Box element
var BOX = document.createElement('div');
BOX.id = 'box1';
BOX.style.height = "120px";
BOX.style.width = "120px";

// Color values for background randomly generated
var BACKROUND_COLORS =   {
    0: [94,146,255],
    1: [86,232,152],
    2: [255,254,107],
    3: [232,160,81],
    4: [255,89,167],
  }

// Colors values for the boxes (need some more!)
const COLORS = [
    '#ffb84d',
    '#aaaa55',
    '#94b8b8',
    '#008060',
    '#287EB2',
    '#FF4549',
  ]

// ##
/* Dynamic section for codes, mainly functions and others to manipulate DOM */

// Generate playground for the boxes
class Playground {
  // This class will handle main playground generation
  constructor(id) {
    this.parent = document.getElementById(id);
    this.addBoxButton = document.createElement('button');
    this.removeBoxButton = document.createElement('button');
    this.startGameButton = document.createElement('button');
    this.refreshPageButton = document.createElement('button');
    this.start = document.createElement('div');
  }

  generatePlayground() {
    // Creating new DOM Elements
    var playgroundDiv = document.createElement('div');
    var counter = document.createElement('h1');
    var mainArena = document.createElement('div');

    // Value assignment
    this.parent.id = 'playground';
    counter.id = 'counter';
    counter.innerHTML = "Counter here...";
    mainArena.id = 'box-arena';
    this.start.id = 'start-section';
    this.refreshPageButton.id = 'refresh-btn';

    this.addBoxButton.id = 'add-box-btn';
    this.addBoxButton.innerHTML = '+';
    this.removeBoxButton.id = 'del-box-btn';
    this.removeBoxButton.innerHTML = '-';
    this.startGameButton.id = 'start-game-btn';
    this.startGameButton.innerHTML = 'Start!';
    this.refreshPageButton.innerHTML = 'Reload!';

    this.parent.appendChild(playgroundDiv);
    playgroundDiv.appendChild(counter);
    playgroundDiv.appendChild(mainArena);
    playgroundDiv.appendChild(this.start);
    mainArena.appendChild(this.addBoxButton);
    mainArena.appendChild(this.removeBoxButton);
    this.start.appendChild(this.startGameButton);
    this.start.appendChild(this.refreshPageButton);
  }

  generateFunctionalButtons() {
    var mainGameArena = document.getElementById('box-arena');
    mainGameArena.appendChild(this.addBoxButton);
    mainGameArena.appendChild(this.removeBoxButton);
  }

  removeStartButton() {
    this.start.removeChild(this.startGameButton);
  }
}

// Class to generate functional boxes-buttons
class Boxes {
  constructor(box, add, remove) {
    this.boxArena = document.getElementById(box);
    this.addBoxId = document.getElementById(add);
    this.removeBoxId = document.getElementById(remove);
  }

  addNewBox(classname) {
    this.addBoxId.addEventListener('click', function() {
      var newbox = document.createElement('button');
      newbox.className = classname;
      newbox.innerHTML = '-';
      newbox.style.backgroundColor = getRandomColor(COLORS);
      this.boxArena.removeChild(this.removeBoxId);
      this.boxArena.appendChild(newbox);
      this.boxArena.appendChild(this.removeBoxId);
    }.bind(this), false);
  }

  removeBox() {
    this.removeBoxId.addEventListener('click', function() {
        var index = 0;
        while (this.boxArena.hasChildNodes()) {
            this.boxArena.removeChild(this.boxArena.childNodes[index]);
          }
      }, false);
  }
}

// Countdown timer class for user-game experience
class Countdown {
  constructor(time, counter) {
    this.time = time;
    this.counter = counter;
  }

  startTimer() {
    let timeLeft = this.time;
    this.counter.innerHTML = `Counter: ${timeLeft}`;
    let timer = setInterval(function() {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        this.counter.innerHTML = 'Time out, You\'ve lost.. Sorry!';
        clearInterval(this.time);
      } else {
      this.counter.innerHTML = `Counter: ${timeLeft}`;
      }
    },1000);
    this.time = timer;
  }

  stopTimer() {
    clearInterval(this.time);
  }
}

// Pick random color from the object
function getRandomColor(colorsObject) {
  return (
    colorsObject[Math.floor(Math.random() * Object.keys(colorsObject).length)]
  );
}

// Color generator
function colorFade(element, colors) {
  // Firstly, get the random color from object containing those
  var color = getRandomColor(colors);
  // Secondly, get the element styles to be manipulated by this function
  // var objectToChangeColor = document.getElementsByTagName(element)[0];
  var color1 = 0;
  var color2 = 0;
  var color3 = 0;
  // Iterate through all available colors
  for (var i=1; i<255; i++) {
    setTimeout( function timer(){
      element.style.backgroundColor = 'rgb(' + [color1,color2,color3].join(',') + ')';
      if (color1 < color[0]) {
        color1 += 1;
      }
      if (color2 < color[1]) {
        color2 += 1;
      }
      if (color3 < color[2]) {
        color3 += 1;
      }
    }, i*2 );
  }
}

// Single function to generate one box item, it takes a parent id or
function generateBox(parentName, box) {
  document.getElementsByClassName(parentName)[0].appendChild(box);
}

// Define main function, that will call all following actions
function main() {
  // Start layout animation before anything else
  colorFade(body, BACKROUND_COLORS);

  // Switches to determine whether to run particular functions or not
  var triggerTimeEvent = false;
  var actionGo = false;

  // Prepare items for initialization
  var playground = new Playground(CONTAINER);
  playground.generatePlayground();
  var boxes = new Boxes(
    BOX_ARENA, ADD_BOX_BUTTON, REMOVE_BOX_BUTTON
  );
  boxes.addNewBox(GAME_BUTTON_CLASS);

  // Game action related variables, section also contains event
  // listeners, bound to the buttons / items
  var addBox = document.getElementById(ADD_BOX_BUTTON);
  var removeBox = document.getElementById(REMOVE_BOX_BUTTON);
  var reloadPage = document.getElementById(RELOAD_BOX_BUTTON);
  var boxArena = document.getElementById(BOX_ARENA);

  // Just a single event listener to remove presseOn box
  removeBox.addEventListener('click', function() {
    var index = 0;
    while (boxArena.hasChildNodes()) {
      boxArena.removeChild(boxArena.childNodes[index]);
    }
    playground.generateFunctionalButtons();
  }, false);

  // Check start button functionality
  var startBtn = document.getElementById(
    playground.startGameButton.id);

  // Add event on start button click!
  startBtn.addEventListener('click', function() {
    // Start timer!
    if (boxArena.childNodes.length > 3) {
      var timeElapsed = boxArena.childNodes.length + 4;
      var chead = document.getElementById('counter');
      var counter = new Countdown(timeElapsed, chead);
      counter.startTimer();
      // Cleanup some boxes..
      boxArena.removeChild(addBox);
      boxArena.removeChild(removeBox);
      playground.removeStartButton();
      actionGo = true;
      checkerValue(boxArena.childNodes, counter, chead);
      }
    }, false
  );

  // Just reload the whole page! It would be nice to re-render
  function reloadGame() {
    window.location.reload();
  }

  // And click listener for that
  reloadPage.addEventListener('click', reloadGame, false);

  function checkerValue(arr, counter, header) {
    var timer = setInterval(function() {
      var accum = 0;
      for (var i = 0; i < arr.length; i++) {
        var initial = arr[0];
          if (initial.style.backgroundColor == arr[i].style.backgroundColor) {
            accum += 1
          }
        }
      if (accum == arr.length) {
        counter.stopTimer();
        header.innerHTML = "You won!";
        actionGo = false;
      }
    }, 50);
  }

  // Listen on clicked items, but only those appended previously!
  document.addEventListener('click', function(e) {
      if (e.target.className == GAME_BUTTON_CLASS && actionGo) {
        e.target.style.backgroundColor = getRandomColor(COLORS);
      }
  });
};

// ##
/* Action! */
main();
