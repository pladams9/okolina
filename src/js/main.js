/*******************************************************************************
 * main.js
 *
 * This is the main client side code for Okolina. Sets everything up in a div
 * with the id #okolina-content on whatever page it is included on.
 ******************************************************************************/


/*******************************************************************************
 * CONSTANTS
 ******************************************************************************/

const OKOLINA_DIV_ID = 'okolina-content';
const OKOLINA_HEIGHT = 500;
const OKOLINA_WIDTH = 800;
const PLAY_AREA_WIDTH = 600;
const CONTROL_AREA_WIDTH = 200;

/*******************************************************************************
 * OBJECT PROTOTYPE DEFINITIONS
 ******************************************************************************/



/*******************************************************************************
 * GLOBAL OKOLINA OBJECTS
 ******************************************************************************/

/**
 * Okolina - general container object
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
  Okolina.divMain = document.getElementById(OKOLINA_DIV_ID);
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
  Okolina.PlayArea = document.createElement('div');
  Okolina.PlayArea.style.width = PLAY_AREA_WIDTH + 'px';
  Okolina.PlayArea.style.height = OKOLINA_HEIGHT + 'px';
  Okolina.PlayArea.style.float = 'left';
  Okolina.PlayArea.style.backgroundColor = '#003';

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

  // Set initial room
  Okolina.room = {};

  // Draw DrawManager
  Okolina.draw = new DrawManager(Okolina.PlayArea, PLAY_AREA_WIDTH, OKOLINA_HEIGHT);

  // Add drawing objects
  Okolina.tiles1 = new Tileset(
    'img/tiles.svg', 0,
    15, 15, 24, 24, 24, 36,
    0, 0, 96, 128, 64, 96,
    3
  );
  Okolina.draw.addObject(Okolina.tiles1, 0);

  // Start game loop
  setTimeout(LoadRoom);
}

/* Load Room */
function LoadRoom() {
  // Request current room
  AJAXRequest('get_room', {},
    function(result) {
      console.log(result['data']);
      Okolina.room.x = result['data'].x_pos;
      Okolina.room.y = result['data'].y_pos;
      Okolina.room.width = result['data'].room_width;
      Okolina.room.height = result['data'].room_height;
      Okolina.room.data = result['data'].room_data;
      Okolina.room.biome = result['data'].biome;

      Okolina.tiles1.loadTileData(Okolina.room.data, Okolina.room.width);
      var t_size = 32;
      var eff_w = PLAY_AREA_WIDTH - 30;
      var eff_h = OKOLINA_HEIGHT - 30;
      if((Okolina.room.width / Okolina.room.height) > (eff_w / eff_h)) {
        t_size = eff_w / Okolina.room.width;
      }
      else {
        t_size = eff_h / Okolina.room.height;
      }
      Okolina.tiles1.setTileScale(t_size, t_size, t_size, t_size * 1.5);
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

/**
 * FUNCTIONS
 */

/* AJAX Requests */
function AJAXRequest(action, data, success, failure) {
  var ajax = new XMLHttpRequest();

  // All AJAX requests are sent by POST through ajax.php
  ajax.open('POST', 'php/ajax.php', true);

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
