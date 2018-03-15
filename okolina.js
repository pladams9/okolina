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

const OKOLINA_HEIGHT = '500px';
const OKOLINA_WIDTH = '800px';
const PLAY_AREA_WIDTH = '600px';
const CONTROL_AREA_WIDTH = '200px';


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
  Okolina.divMain.style.width = OKOLINA_WIDTH;
  Okolina.divMain.style.height = OKOLINA_HEIGHT;
  Okolina.divMain.style.margin = '0 auto';
  Okolina.divMain.style.border = '1px solid grey';

  setTimeout(Login);
}

function Login() {
  // Ask for username
  Okolina.user = prompt('Enter username:', '');

  // Validate user login through AJAX
  AJAXRequest('login', Okolina.user,
    function(result) {
      if (result[1] == 'login_accepted') {
        console.log('Login successful.');
        setTimeout(GameSetup); // Move on
      }
      else {
        console.log('Login failed.');
        setTimeout(Login); // Try again
      }
    },
    function(result) {
      console.log(result[1]);
      setTimeout(Login);
    });
}

/* Setup play area */
function GameSetup() {
  Okolina.divPlayArea = document.createElement('div');
  Okolina.divPlayArea.style.float = 'left';
  Okolina.divPlayArea.style.width = PLAY_AREA_WIDTH;
  Okolina.divPlayArea.style.height = OKOLINA_HEIGHT;
  Okolina.divPlayArea.style.color = 'white';

  Okolina.divControlArea = document.createElement('div');
  Okolina.divControlArea.style.float = 'left';
  Okolina.divControlArea.style.width = CONTROL_AREA_WIDTH;
  Okolina.divControlArea.style.height = OKOLINA_HEIGHT;

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
  Okolina.divControlArea.appendChild(Okolina.controls.buttonSouth);
  Okolina.divControlArea.appendChild(Okolina.controls.buttonWest);
  Okolina.divControlArea.appendChild(Okolina.controls.buttonEast);

  Okolina.controls.buttonNorth.onclick = function(){ ExitRoom('north') };
  Okolina.controls.buttonSouth.onclick = function(){ ExitRoom('south') };
  Okolina.controls.buttonWest.onclick = function(){ ExitRoom('west') };
  Okolina.controls.buttonEast.onclick = function(){ ExitRoom('east') };

  Okolina.divMain.appendChild(Okolina.divPlayArea);
  Okolina.divMain.appendChild(Okolina.divControlArea);

  // Start game loop
  setTimeout(LoadRoom);
}

/* Load Room */
function LoadRoom() {
  // Request current room
  AJAXRequest('get_room', '',
    function(result) {
      console.log(result[1]);
      Okolina.divPlayArea.style.backgroundColor = result[1][2];
      Okolina.divPlayArea.innerHTML = (
        '<p>Username = ' + Okolina.user +
        '</p><p>Room coordinates: (' + result[1][0] + ', ' + result[1][1] + ')</p>'
      );
    },
    function(result) {
      console.log(result[1]);
    });
}

/* Exit Room */
function ExitRoom(dir) {
  // Request current room
  AJAXRequest('exit_room', dir,
    function(result) {
      setTimeout(LoadRoom);
    },
    function(result) {
      console.log(result[1]);
    });
}

/* Clean up play area */
function GameCleanup() {
  Okolina.divMain.removeChild(divPlayArea);
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
  ajax.open('POST', 'ajax.php', true);

  // Prepare for response
  ajax.onreadystatechange = function() {
    // If the request has returned (DONE) succesfully (200)
    if (ajax.readyState === XMLHttpRequest.DONE && ajax.status === 200) {
      console.log(ajax.responseText);
      var result = JSON.parse(ajax.responseText);
      // If there was an error, run failure callback
      if (result[0] == 0) failure(result);
      // Otherwise, run the success callback
      else success(result);
    }
  };

  // Send the request
  ajax.setRequestHeader('Content-Type', 'application/json');
  ajax.send(JSON.stringify({ action : action, data : data }));
}


}) ();
