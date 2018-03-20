<?php

/**
 * INCLUDES
 */
require_once('noise.php');

/* Call specific generator - easy switch for development */
function GenerateRoom($seed, $biome, $width, $height) {
  return GenerateRoomFromPointFill($seed, $biome, $width, $height);
}

/* Generate room by filling from start points */
function GenerateRoomFromPointFill($seed, $biome, $width, $height) {
  // Our return data
  $room_data = array_fill(0, $width * $height, -1); // -1 is unpainted

  // Get our first points
  mt_srand($seed);
  $active_points = new SplQueue();
  for ($i = 0; $i < 5; $i++) { // TODO magic number
    $x = mt_rand(0, $width - 1);
    $y = mt_rand(0, $height - 1);
    $active_points->enqueue(array($x, $y));

    $type = mt_rand(0, 2);
    $room_data[$x + ($y * $width)] = $type;
  }

  // Fill the rest of the points
  $neighbors = array(
    array(-1, 0),
    array(1, 0),
    array(0, -1),
    array(0, 1),
  );
  while ($active_points->count() > 0) {
    $cur_point = $active_points->dequeue();
    $next_point = array(0, 0);
    $found_point = false;
    foreach ($neighbors as $n) {
      // Find a valid next point
      $next_point[0] = $cur_point[0] + $n[0];
      if ($next_point[0] < 0 || $next_point[0] >= $width) continue;
      $next_point[1] = $cur_point[1] + $n[1];
      if ($next_point[1] < 0 || $next_point[1] >= $height) continue;

      // Make sure it is unpainted
      if ($room_data[$next_point[0] + ($next_point[1] * $width)] == -1) {
        $found_point = true;
        break;
      }
    }

    // Paint the next point and add it to the list, requeue the current point
    if ($found_point) {
      $room_data[$next_point[0] + ($next_point[1] * $width)] =
        $room_data[$cur_point[0] + ($cur_point[1] * $width)];
      $active_points->enqueue($next_point);
      $active_points->enqueue($cur_point);
    }
  }

  return $room_data;
}

/*  Generate room using noise function */
function GenerateRoomFromNoise($seed, $biome, $width, $height) {
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
