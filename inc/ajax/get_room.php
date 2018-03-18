<?php

$q = 'SELECT x_pos, y_pos, color FROM rooms
      JOIN user_details ON rooms.id=user_details.current_room_id
      WHERE user_details.user_id=\'' . $_SESSION['user_id'] . '\';';
$res = OkolinaDB::query($q);
if($res['msg'][0] == SUCCESS) {
  $row = $res['data']->fetch_row();
  $ret_data['x_pos'] = $row[0];
  $ret_data['y_pos'] = $row[1];
  $ret_data['color'] = $row[2];

  $ret_data['room_width'] = 11;
  $ret_data['room_height'] = 8;

  // Generate room based on seed
  require_once(__DIR__ . '/../generate/room.php');
  $ret_data['room_data'] = GenerateRoom(
    intval(substr($ret_data['color'], 1), 16),
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
