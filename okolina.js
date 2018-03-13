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
  var ajax = new XMLHttpRequest();

  // Prep for response
  ajax.onreadystatechange = function() {
    if (ajax.readyState === XMLHttpRequest.DONE && ajax.status === 200) {
      // The request has returned (DONE) succesfully (200)
      console.log(ajax.responseText);

      // If it's good, move on to GameSetup
      //setTimeout(GameSetup);
    }
  };
  // Actually make request
  ajax.open('POST', 'ajax.php', true);
  ajax.setRequestHeader('Content-Type', 'application/json');
  ajax.send(JSON.stringify({ action : 'login', user : Okolina.user }));
}

/* Setup play area and then start game loop*/
function GameSetup() {
  var divPlayArea, divControlArea;
  divPlayArea = document.createElement('div');
  divPlayArea.style.float = 'left';
  divPlayArea.style.width = PLAY_AREA_WIDTH;
  divPlayArea.style.height = OKOLINA_HEIGHT;

  divControlArea = document.createElement('div');
  divControlArea.style.float = 'left';
  divControlArea.style.width = CONTROL_AREA_WIDTH;
  divControlArea.style.height = OKOLINA_HEIGHT;

  Okolina.divMain.appendChild(divPlayArea);
  Okolina.divMain.appendChild(divControlArea);

  // Start game loop
  setTimeout(GameLoop);
}

/* Game Loop */
function GameLoop() {
  // Request current room (with user name for server to validate)
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
  setTimeout(okolinaLogin);
}


}) ();
