<?php
/*******************************************************************************
 * requests.php
 *
 * AJAX request types are "registered" here and called from here.
 ******************************************************************************/

/**
 * INCLUDES
 */
require_once 'inc/constants.php';
require_once 'inc/db_access.php';


/**
 * HANDLE REQUESTS
 */
function HandleRequest($request) {

  /* Any & All Request Types Should Be Listed Here */
  $handlers = array(
    'login' => 'Login',
    'logout' => 'Logout',
    'get_room' => 'GetRoom',
    'exit_room' => 'ExitRoom',
  );

  return call_user_func($handlers[$request['action']], $request['data']);

}

/**
 * FUNCTIONS
 */

function Login($data) {
  $q = 'SELECT user_id FROM user_details
        JOIN users ON users.id = user_details.user_id
        WHERE username=\'' . $data['user'] . '\';';
  $res = OkolinaDB::query($q);
  if($res['msg'][0] == SUCCESS) {
    if($res['data']->num_rows == 1) {
      $_SESSION['user_id'] = $res['data']->fetch_row()[0];
      return array(
        'msg' => array(SUCCESS, 'login_accepted')
      );
    }
    else return array(
      'msg' => array(SUCCESS, 'login_denied')
    );
  }
  else return $res;
}

function GetRoom($data) {
  $q = 'SELECT x_pos, y_pos, color FROM rooms
        JOIN user_details ON rooms.id=user_details.current_room_id
        WHERE user_details.user_id=\'' . $_SESSION['user_id'] . '\';';
  $res = OkolinaDB::query($q);
  if($res['msg'][0] == SUCCESS) {
    $row = $res['data']->fetch_row();
    $ret_data['x_pos'] = $row[0];
    $ret_data['y_pos'] = $row[1];
    $ret_data['color'] = $row[2];

    // Generate room based on seed
    mt_srand(intval(substr($ret_data['color'], 1), 16));
    $ret_data['room_width'] = 11;
    $ret_data['room_height'] = 8;
    $ret_data['room_data'] = array();
    for ($i = 0; $i < $ret_data['room_width'] * $ret_data['room_height']; $i++) {
      $ret_data['room_data'][] = mt_rand(0, 2);
    }

    return array(
      'msg' => array(SUCCESS, 'room_loaded'),
      'data' => $ret_data
    );
  }
  else return $res;
}

function ExitRoom($data) {
  $x = 0;
  $y = 0;

  // Find current x,y of player
  $q = 'SELECT x_pos, y_pos FROM rooms
        JOIN user_details ON rooms.id=user_details.current_room_id
        WHERE user_details.user_id=\'' . $_SESSION['user_id'] . '\';';
  $res = OkolinaDB::query($q);
  if($res['msg'][0] == SUCCESS) {
    $row = $res['data']->fetch_row();
    $x = $row[0];
    $y = $row[1];
  }
  else return $res;

  // Figure out new coordinates based on $direction
  switch ($data['direction']) {
    case 'north':
      $y -= 1;
      break;
    case 'south':
      $y += 1;
      break;
    case 'west':
      $x -= 1;
      break;
    case 'east':
      $x += 1;
      break;
  }

  // Get new room id (if it exists)
  $q = "SELECT id FROM rooms
        WHERE x_pos=$x && y_pos=$y";
  $res = OkolinaDB::query($q);
  if($res['msg'][0] == SUCCESS) {
    if($res['data']->num_rows == 0) return array(
      'msg' => array(WARNING, 'room_missing')
    );
    else {
      // Update user_details and report success
      $new_room = $res['data']->fetch_row()[0];
      $q = "UPDATE user_details SET current_room_id=$new_room WHERE user_id=" . $_SESSION['user_id'];
      $res = OkolinaDB::query($q);
      if ($res['msg'][0] == SUCCESS) return array(
        'msg' => array(SUCCESS, 'room_updated')
      );
      else return $res;
    }
  }
  else return $res;
}

?>
