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

var divOkolina;

var user = '';

/**
 * APPLICATION FLOW (Start Here)
 */

window.onload = function() {
  // Setup stage
  okolinaSetup();

  while (true) {
    // Login stage
    okolinaLogin();

    // Game stage
    okolinaPlay();
  }
};

/**
 * STAGE FUNCTIONS
 */

/* Build okolina area into #okolina-content */
function okolinaSetup() {
  divOkolina = document.getElementById('okolina-content');
  divOkolina.style.width = OKOLINA_WIDTH;
  divOkolina.style.height = OKOLINA_HEIGHT;
  divOkolina.style.margin = '0 auto';
  divOkolina.style.border = '1px solid grey';
}

function okolinaLogin() {
  // Ask for username; store in JS
  // Validate user login through AJAX
}

function okolinaPlay() {
  /* Setup play area */
  var divPlayArea, divControlArea;
  divPlayArea = document.createElement('div');
  divPlayArea.style.float = 'left';
  divPlayArea.style.width = PLAY_AREA_WIDTH;
  divPlayArea.style.height = OKOLINA_HEIGHT;

  divControlArea = document.createElement('div');
  divControlArea.style.float = 'left';
  divControlArea.style.width = CONTROL_AREA_WIDTH;
  divControlArea.style.height = OKOLINA_HEIGHT;

  divOkolina.appendChild(divPlayArea);
  divOkolina.appendChild(divControlArea);

  /* Game Loop */
  // Request current room (with user name for server to validate)
  // Incorrect login = return and go back to login stage
  // Correct login = Display room

  // Display room
  // Display room coordinates
  // Display room color
  // Display buttons for moving (as appropriate)

  /* Clean up play area */
  divOkolina.removeChild(divPlayArea);
  divOkolina.removeChild(divControlArea);
}


}) ();
