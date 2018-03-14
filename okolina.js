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

window.onload = function() {
  // Setup stage
  okolinaSetup();

  // Login stage
  Login();
};


/**
 * STAGE FUNCTIONS
 */

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

/* Setup play area and then start game loop*/
function GameSetup() {
  Okolina.divPlayArea = document.createElement('div');
  Okolina.divPlayArea.style.float = 'left';
  Okolina.divPlayArea.style.width = PLAY_AREA_WIDTH;
  Okolina.divPlayArea.style.height = OKOLINA_HEIGHT;
  Okolina.divPlayArea.appendChild(document.createTextNode('Username = ' + Okolina.user));

  Okolina.divControlArea = document.createElement('div');
  Okolina.divControlArea.style.float = 'left';
  Okolina.divControlArea.style.width = CONTROL_AREA_WIDTH;
  Okolina.divControlArea.style.height = OKOLINA_HEIGHT;
  Okolina.divControlArea.appendChild(document.createTextNode('Controls area'));

  Okolina.divMain.appendChild(Okolina.divPlayArea);
  Okolina.divMain.appendChild(Okolina.divControlArea);

  // Start game loop
  setTimeout(GameLoop);
}

/* Game Loop */
function GameLoop() {
  // Request current room
  AJAXRequest('get_room', '',
    function(result) {
      console.log(result[1]);
      Okolina.divPlayArea.style.backgroundColor = result[1];
    },
    function(result) {
      console.log(result[1]);
    });


  // Incorrect login = return and go back to login stage
  // Correct login = Display room

  // Display room
  // Display room coordinates
  // Display room color
  // Display buttons for moving (as appropriate)

  // Call cleanup if we're done

  // ...or call the GameLoop again  <<<-------------------------THIS COULD USE SOME SERIOUS THINKING
  //setTimeout(GameLoop);
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
