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
  default:
    $result = array(FAILURE, 'No matching action');
}
echo json_encode($result);


/**
 * FUNCTIONS
 */

function Login($user) {
  $q = 'SELECT COUNT(*) FROM users WHERE username=\'' . $user . '\';';
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    if($res[1]->fetch_row()[0] == 1) {
      $_SESSION['user'] = $user;
      return array(SUCCESS, 'login_accepted');
    }
    else return array(SUCCESS, 'login_denied');
  }
  else return $res;
}

function GetRoom() {
  $q = 'SELECT color FROM rooms
        JOIN user_details ON rooms.id=user_details.current_room_id
        JOIN users ON users.id=user_details.user_id
        WHERE users.username=\'' . $_SESSION['user'] . '\';';
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    return array(SUCCESS, $res[1]->fetch_row()[0]);
  }
  else return $res;
}

function ExitRoom($direction) {
  $x = 0;
  $y = 0;

  // Find current x,y of player
  $q = 'SELECT pos_x, pos_y FROM rooms
        JOIN user_details ON rooms.id=user_details.current_room_id
        JOIN users ON users.id=user_details.user_id
        WHERE users.username=\'' . $_SESSION['user'] . '\';';
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    $row = $res[1]->fetch_row();
    $x = $row[0];
    $y = $row[1];
  }
  else return $res;

  // Figure out new coordinates based on $direction <<<---------------------- TODO
  // $x = new;
  // $y = new;

  // Get new room id (if it exists)
  $q = "SELECT id FROM rooms
        WHERE pos_x=$x && pos_y=$y";
  $res = QueryDB($q);
  if($res[0] == SUCCESS) {
    if($res[1]->num_rows == 0) return array(WARNING, 'room_missing');
    else {
      // Update user_details and report success <<<---------------- TODO
    }
  }
  else return $res;
}


?>
