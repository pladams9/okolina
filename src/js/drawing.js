/**
 * drawing.js - Objects for drawing here
 */

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
