<?php

$q = 'SELECT x_pos, y_pos, biome, seed FROM rooms
      JOIN user_details ON rooms.id=user_details.current_room_id
      WHERE user_details.user_id=\'' . $_SESSION['user_id'] . '\';';
$res = OkolinaDB::query($q);
if($res['msg'][0] == SUCCESS) {
  $row = $res['data']->fetch_row();
  $ret_data['x_pos'] = $row[0];
  $ret_data['y_pos'] = $row[1];
  $ret_data['biome'] = $row[2];
  $seed = $row[3]; // Don't need to send the seed back to the client

  $ret_data['room_width'] = 30;
  $ret_data['room_height'] = 20;

  // Generate room based on seed
  require_once(__DIR__ . '/../generate/room.php');
  $ret_data['room_data'] = GenerateRoom(
    $seed,
    $ret_data['biome'],
    $ret_data['room_width'],
    $ret_data['room_height']
  );

  return array(
    'msg' => array(SUCCESS, 'room_loaded'),
    'data' => $ret_data
  );
}
else return $res;

?>
