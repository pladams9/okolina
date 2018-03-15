<?php
/*******************************************************************************
 * ajax.php
 *
 * This script handles any AJAX requests from the client.
 ******************************************************************************/

/**
 * CONSTANTS
 */

require_once('db-config.php');

/**
 * CONSTANTS
 */

define('FAILURE', 0);
define('SUCCESS', 1);
define('WARNING', 2);

/**
 * HANDLE REQUESTS
 */

session_start();

$request = json_decode(file_get_contents('php://input'), true);

switch($request['action']) {
  case 'login':
    $result = Login($request['data']);
    break;
  case 'logout':
    $result = Logout($request['data']);
    break;
  case 'get_room':
    $result = GetRoom();
    break;
  case 'exit_room':
    $result = ExitRoom($request['data']);
    break;
  default:
    $result = array(FAILURE, 'No matching action');
}
echo json_encode($result);


/**
 * FUNCTIONS
 */

function Login($user) {
  $q = 'SELECT user_id FROM user_details
        JOIN users ON users.id = user_details.user_id
        WHERE username=\'' . $user . '\';';
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    if($res[1]->num_rows == 1) {
      $_SESSION['user_id'] = $res[1]->fetch_row()[0];
      return array(SUCCESS, 'login_accepted');
    }
    else return array(SUCCESS, 'login_denied');
  }
  else return $res;
}

function GetRoom() {
  $q = 'SELECT x_pos, y_pos, color FROM rooms
        JOIN user_details ON rooms.id=user_details.current_room_id
        WHERE user_details.user_id=\'' . $_SESSION['user_id'] . '\';';
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    return array(SUCCESS, $res[1]->fetch_row());
  }
  else return $res;
}

function ExitRoom($direction) {
  $x = 0;
  $y = 0;

  // Find current x,y of player
  $q = 'SELECT x_pos, y_pos FROM rooms
        JOIN user_details ON rooms.id=user_details.current_room_id
        WHERE user_details.user_id=\'' . $_SESSION['user_id'] . '\';';
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    $row = $res[1]->fetch_row();
    $x = $row[0];
    $y = $row[1];
  }
  else return $res;

  // Figure out new coordinates based on $direction
  switch ($direction) {
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
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    if($res[1]->num_rows == 0) return array(WARNING, 'room_missing');
    else {
      // Update user_details and report success
      $new_room = $res[1]->fetch_row()[0];
      $q = "UPDATE user_details SET current_room_id=$new_room WHERE user_id=" . $_SESSION['user_id'];
      $res = QueryDB($q);
      if ($res[0] == SUCCESS) return array(SUCCESS, 'room_updated');
      else return $res;
    }
  }
  else return $res;
}


?>
