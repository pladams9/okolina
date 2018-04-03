<?php

function noiseInt($intX, $intY, $seed) {
  // Hash function for noise
  return (abs(crc32($seed . $intX . $intY)) % 1000) / 1000;
}

function noiseInterpolated($x, $y, $seed) {
  // Our return value;
  $noise_val = 0;

  $intX = intval($x);
  $intY = intval($y);
  $weightX = $x - $intX;
  $weightX = (1 - cos($weightX * 3.1415927)) * 0.5;
  $weightY = $y - $intY;
  $weightY = (1 - cos($weightY * 3.1415927)) * 0.5;

  $r1 = noiseInt($intX, $intY, $seed);
  $r2 = noiseInt($intX+1, $intY, $seed);
  $r3 = noiseInt($intX, $intY+1, $seed);
  $r4 = noiseInt($intX+1, $intY+1, $seed);

  $noise_val += ($r1 * (1-$weightX) * (1-$weightY));
  $noise_val += ($r2 * $weightX * (1-$weightY));
  $noise_val += ($r3 * (1-$weightX) * $weightY);
  $noise_val += ($r4 * $weightX * $weightY);

  return $noise_val;
}

?>
