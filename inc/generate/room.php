<?php

/*  Generate room based on seed */
function GenerateRoom($seed, $width, $height) {
  mt_srand($seed);

  // Our return data
  $room_data = array();

  // Actual generation
  $room_data = array();
  $room_size = $width * $height;
  for ($i = 0; $i < $room_size; $i++) {
    $room_data[] = mt_rand(0, 2);
  }

  return $room_data;
}

?>
