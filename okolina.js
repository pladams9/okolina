/*******************************************************************************
 * okolina.js
 *
 * This is the main client side code for Okolina. Sets everything up in a div
 * with the id #okolina-content on whatever page it is included on.
 ******************************************************************************/

;(function() {


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

/***********
 * Drawable
 ***********/
function Drawable(src, z = 0) {
  this.z = z;
  this.changed = true;
  this.img = new Image();
  this.img.src = src;
  this.img.onload = (function() { this.changed = true; }).bind(this);
};

/**
 * draw function
 *
 * @param ctx: the context to draw to
 */
Drawable.prototype.draw = function(ctx) {
  // Replace in inherited objects
  this.changed = false;
};

/**
 * Has this object changed since the last draw?
 *
 * @param ctx: the context to draw to
 */
Drawable.prototype.hasChanged = function() {
  return this.changed;
};

/**
 * setZIndex
 */
Drawable.prototype.setZIndex = function(z) {
  this.z = z;
};

/**********
 * SPRITE
 **********/
function Sprite(src, z = 0, x = 0, y = 0) {
  Drawable.call(this, src, z);
  this.x = x;
  this.y = y;
};
Sprite.prototype = Object.create(Drawable.prototype);

/**
 * draw function
 */
Sprite.prototype.draw = function(ctx) {
  ctx.drawImage(this.img, this.x, this.y);
  this.changed = false;
};

/**
 * Change position
 */
Sprite.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
  this.changed = true;
};

/**********
 * TILESET
 **********/
function Tileset(
  src, z = 0,
  start_x = 0, start_y = 0, offset_width, offset_height, draw_width, draw_height,
  tileset_start_x, tileset_start_y, tileset_offset_width, tileset_offset_height, tile_width, tile_height,
  tileset_width
) {
  Drawable.call(this, src, z);

  this.start_x = start_x;                               // Where to start drawing the tiles on screen
  this.start_y = start_y;
  this.offset_width = offset_width;                     // How much to offset one tile from another
  this.offset_height = offset_height;
  this.draw_width = draw_width;                         // The actual size of the tile as drawn on screen
  this.draw_height = draw_height;

  this.tileset_start_x = tileset_start_x;               // Where the tiles start in the source image
  this.tileset_start_y = tileset_start_y;
  this.tileset_offset_width = tileset_offset_width;     // How much tiles are offset from each other in source image
  this.tileset_offset_height = tileset_offset_height;
  this.tile_width = tile_width;                         // Actual size of the tiles in the source image
  this.tile_height = tile_height;
  this.tileset_width = tileset_width;                   // Number of tiles in a row

  this.tileDataLoaded = false;
  this.tileData = [];
};
Tileset.prototype = Object.create(Drawable.prototype);

Tileset.prototype.loadTileData = function(data = [], layout_width) {
  this.data = data;
  this.layout_width = layout_width;
  this.tileDataLoaded = true;
  this.changed = true;
}

Tileset.prototype.draw = function(ctx) {
  if (this.tileDataLoaded) {
    var j = 0;
    var k = 0;
    this.data.forEach(function(t, i) {
      ctx.drawImage(
        this.img,
        (this.tileset_start_x + ((t % this.tileset_width) * this.tileset_offset_width)),
        (this.tileset_start_y + (Math.floor(t / this.tileset_width) * this.tileset_offset_height)),
        this.tile_width, this.tile_height,
        (this.start_x + ((i % this.layout_width) * this.offset_width)),
        (this.start_y + ((Math.floor(i / this.layout_width)) * this.offset_height)),
        this.draw_width, this.draw_height
      );
    }, this);
  }
}

Tileset.prototype.setTileScale = function(offset_width, offset_height, draw_width, draw_height) {
  this.offset_width = offset_width;
  this.offset_height = offset_height;
  this.draw_width = draw_width;
  this.draw_height = draw_height;
}

/**************
 * DrawManager
 **************/
function DrawManager(baseDiv, width, height) {
  this.objects = [];
  this.canvas = [];
  this.ctx = [];
  this.width = width;
  this.height = height;

  this.container = document.createElement('div');
  this.container.style.position = 'relative';

  baseDiv.appendChild(this.container);

  requestAnimationFrame(DrawManager.prototype.step.bind(this));
};

/**
 * The draw step - performed every frame
 *
 * @param t: Current time returned by requestAnimationFrame
 */
DrawManager.prototype.step = function(t) {
  requestAnimationFrame(DrawManager.prototype.step.bind(this));

  // Draw Objects
  this.objects.forEach(function(layer, layer_index) {
    // Check for changes in layer
    var something_changed = false;
    for (var obj_index = 0; obj_index < layer.length; obj_index++) {
      if (layer[obj_index].hasChanged()) {
        something_changed = true;
        break;
      }
    }

    if (something_changed) {
      // Clear area
      this.ctx[layer_index].clearRect(0, 0, this.width, this.height);
      // Actually draw objects
      layer.forEach(function(object) {
         object.draw(this.ctx[layer_index]);
      }, this);
    }
  }, this);
};

/**
 * Add an object to the list to be drawn
 *
 * @param obj: Object of type Drawable
 */
DrawManager.prototype.addObject = function(obj, layer) {
 if (this.objects[layer] === undefined) {
   this.objects[layer] = [];

   var newCanvas = document.createElement('canvas');
   newCanvas.width = this.width;
   newCanvas.height = this.height;
   newCanvas.style.position = 'absolute';
   newCanvas.style.top = '0';
   newCanvas.style.left = '0';

   this.container.appendChild(newCanvas);
   this.canvas[layer] = newCanvas;
   this.ctx[layer] = newCanvas.getContext('2d');
 }
 this.objects[layer].push(obj);
};

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
