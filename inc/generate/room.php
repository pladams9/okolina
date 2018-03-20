<?php

/**
 * INCLUDES
 */
require_once('noise.php');

/*  Generate room based on seed */
function GenerateRoom($seed, $biome, $width, $height) {
  // Our return data
  $room_data = array();

  // Noise settings
  $noise_period = 3; // TODO remove magic constant

  // Weight table for terrain types
  $types = array(1, 0); // Water -> Dirt -> Grass
  $type_weight = array(40, 60);
  $type_weight_total = array_sum($type_weight);

  // Generate tiles
  for ($j = 0; $j < $width; $j++) {
    for ($k = 0; $k < $height; $k++) {
      // Get noise value
      $n = noiseInterpolated($j / $noise_period, $k / $noise_period, $seed) * $type_weight_total;
      $t = 0;
      while ($n > $type_weight[$t]) {
        $n -= $type_weight[$t];
        $t += 1;
      }
      $room_data[] = $types[$t];
    }
  }

  return $room_data;
}

?>
