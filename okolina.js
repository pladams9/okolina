/*******************************************************************************
 * okolina.js
 *
 * This is the main client side code for Okolina. Sets everything up in a div
 * with the id #okolina-content on whatever page it is included on.
 ******************************************************************************/

(function() {


/**
 * CONSTANTS
 */

const OKOLINA_HEIGHT = 500;
const OKOLINA_WIDTH = 800;
const PLAY_AREA_WIDTH = 600;
const CONTROL_AREA_WIDTH = 200;


/**
 * GLOBALS
 */

var Okolina = {};


/**
 * APPLICATION FLOW (Start Here)
 */

/* Start with thes setup */
window.onload = okolinaSetup;

/* Build okolina area into #okolina-content */
function okolinaSetup() {
  // Okolina defaults
  Okolina.user = '';

  // Page Setup
  Okolina.divMain = document.getElementById('okolina-content');
  Okolina.divMain.style.width = OKOLINA_WIDTH + 'px';
  Okolina.divMain.style.height = OKOLINA_HEIGHT + 'px';
  Okolina.divMain.style.margin = '0 auto';
  Okolina.divMain.style.border = '1px solid grey';

  setTimeout(Login);
}

function Login() {
  // Ask for username
  Okolina.user = prompt('Enter username:', '');

  // Validate user login through AJAX
  AJAXRequest('login', { user : Okolina.user },
    function(result) {
      if (result['msg'][1] == 'login_accepted') {
        console.log('Login successful.');
        setTimeout(GameSetup); // Move on
      }
      else {
        console.log('Login failed.');
        setTimeout(Login); // Try again
      }
    },
    function(result) {
      console.log(result['data']);
      setTimeout(Login);
    });
}

/* Setup play area */
function GameSetup() {
  Okolina.PlayArea = document.createElement('canvas');
  Okolina.PlayArea.width = PLAY_AREA_WIDTH;
  Okolina.PlayArea.height = OKOLINA_HEIGHT;
  Okolina.PlayArea.style.float = 'left';
  Okolina.PlayArea.style.backgroundColor = '#003';
  Okolina.ctx = Okolina.PlayArea.getContext('2d');

  Okolina.divControlArea = document.createElement('div');
  Okolina.divControlArea.style.float = 'left';
  Okolina.divControlArea.style.width = CONTROL_AREA_WIDTH + 'px';
  Okolina.divControlArea.style.height = OKOLINA_HEIGHT + 'px';
  Okolina.divControlArea.style.textAlign = 'center';
  Okolina.divControlArea.style.paddingTop = '2em';

  Okolina.controls = {};
  Okolina.controls.buttonNorth = document.createElement('button');
  Okolina.controls.buttonNorth.appendChild(document.createTextNode('North'));
  Okolina.controls.buttonSouth = document.createElement('button');
  Okolina.controls.buttonSouth.appendChild(document.createTextNode('South'));
  Okolina.controls.buttonWest = document.createElement('button');
  Okolina.controls.buttonWest.appendChild(document.createTextNode('West'));
  Okolina.controls.buttonEast = document.createElement('button');
  Okolina.controls.buttonEast.appendChild(document.createTextNode('East'));

  Okolina.divControlArea.appendChild(Okolina.controls.buttonNorth);
  Okolina.divControlArea.insertAdjacentHTML('beforeend', '<br>');
  Okolina.divControlArea.appendChild(Okolina.controls.buttonWest);
  Okolina.divControlArea.appendChild(Okolina.controls.buttonEast);
  Okolina.divControlArea.insertAdjacentHTML('beforeend', '<br>');
  Okolina.divControlArea.appendChild(Okolina.controls.buttonSouth);

  Okolina.controls.buttonNorth.onclick = function(){ ExitRoom('north') };
  Okolina.controls.buttonSouth.onclick = function(){ ExitRoom('south') };
  Okolina.controls.buttonWest.onclick = function(){ ExitRoom('west') };
  Okolina.controls.buttonEast.onclick = function(){ ExitRoom('east') };

  Okolina.divMain.appendChild(Okolina.PlayArea);
  Okolina.divMain.appendChild(Okolina.divControlArea);

  // Set initial color for room
  Okolina.room = {};
  Okolina.room.color = '#ffffff';

  // Load tiles
  Okolina.tiles = new Image();
  Okolina.tiles.src = 'img/tiles.svg';

  // Start game loop
  setTimeout(LoadRoom);
  // Start draw loop
  requestAnimationFrame(DrawStep);
}

/* Load Room */
function LoadRoom() {
  // Request current room
  AJAXRequest('get_room', {},
    function(result) {
      console.log(result['data']);
      Okolina.room.color = result['data'].color;
      Okolina.room.x = result['data'].x_pos;
      Okolina.room.y = result['data'].y_pos;
      Okolina.room.width = result['data'].room_width;
      Okolina.room.height = result['data'].room_height;
      Okolina.room.data = result['data'].room_data;
      Okolina.room.biome = result['data'].biome;
    },
    function(result) {
      console.log(result['data']);
    });
}

/* Exit Room */
function ExitRoom(dir) {
  // Request current room
  AJAXRequest('exit_room', { direction : dir },
    function(result) {
      setTimeout(LoadRoom);
    },
    function(result) {
      console.log(result['data']);
    });
}

/* Clean up play area */
function GameCleanup() {
  Okolina.divMain.removeChild(PlayArea);
  Okolina.divMain.removeChild(divControlArea);

  // Return to the login screen
  setTimeout(Login);
}

/* Draw Step */
function DrawStep(t) {
  requestAnimationFrame(DrawStep);

  // Draw rectangle
  Okolina.ctx.clearRect(0, 0, PLAY_AREA_WIDTH, OKOLINA_HEIGHT);

  // Draw tiles
  function drawTile(tileX, tileY, tileSize, x, y, offsetX, offsetY) {
    Okolina.ctx.drawImage(
      Okolina.tiles,
      (tileX * 96), (tileY * 128),
      64, 96,
      (offsetX + (x * tileSize)), (offsetY + (y * tileSize)),
      tileSize, (1.5 * tileSize)
    );
  }

  // Calc scale and offset
  var margin = OKOLINA_HEIGHT * 0.05;
  var offx, offy;
  var eff_width = PLAY_AREA_WIDTH - (2 * margin);
  var eff_height = OKOLINA_HEIGHT - (2 * margin);
  var s;
  if ((Okolina.room.width / Okolina.room.height) > (eff_width / eff_height)) {
    s = eff_width / Okolina.room.width;
    offx = margin;
    offy = (OKOLINA_HEIGHT - (Okolina.room.height * s)) / 2;
  }
  else {
    s = eff_height / Okolina.room.height;
    offx = (PLAY_AREA_WIDTH - (Okolina.room.width * s)) / 2;
    offy = margin;
  }
  for (var j = 0; j < Okolina.room.width; j++) {
    for (var k = 0; k < Okolina.room.height; k++) {
      drawTile(Okolina.room.data[j + (k * Okolina.room.width)], 0, s, j, k, offx, offy);
    }
  }

  // Draw text
  Okolina.ctx.fillStyle = 'white';
  Okolina.ctx.font = '25px monospace';
  Okolina.ctx.fillText(
    'Coordinates: (' + Okolina.room.x + ', ' + Okolina.room.y + ')',
    25, OKOLINA_HEIGHT - 15
  );
}

/**
 * FUNCTIONS
 */

/* AJAX Requests */
function AJAXRequest(action, data, success, failure) {
  var ajax = new XMLHttpRequest();

  // All AJAX requests are sent by POST through ajax.php
  ajax.open('POST', 'ajax.php', true);

  // Prepare for response
  ajax.onreadystatechange = function() {
    // If the request has returned (DONE) succesfully (200)
    if (ajax.readyState === XMLHttpRequest.DONE && ajax.status === 200) {
      console.log(ajax.responseText);
      var result = JSON.parse(ajax.responseText);
      console.log(result['msg']);
      // If there was an error, run failure callback
      if (result['msg'][0] == 0) failure(result);
      // Otherwise, run the success callback
      else success(result);
    }
  };

  // Send the request
  ajax.setRequestHeader('Content-Type', 'application/json');
  ajax.send(JSON.stringify({ action : action, data : data }));
}


}) ();
