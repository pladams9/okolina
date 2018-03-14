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
define('DB_USER', 'root');
define('DB_PASS', '');

/**
 * HANDLE REQUESTS
 */

session_start();

$request = json_decode(file_get_contents('php://input'), true);

switch($request['action']) {
  case 'login':
    $result = Login($request['data']);
    break;
  case 'get_room':
    $result = GetRoom();
    break;
  default:
    $result = array(0, 'No matching action');
}
echo json_encode($result);


/**
 * FUNCTIONS
 */

function Login($user) {
  // Open database connection
  $okolina_db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($okolina_db->connect_errno)
    return array(0, 'Database Connection Error: (' . $okolina_db->connect_errno . ') ' . $okolina_db->connect_error);

  // Is user in db?
  if($result = $okolina_db->query('SELECT COUNT(*) FROM users WHERE username=\'' . $user . '\';')) {
    if($result->fetch_row()[0] == 1) {
      $_SESSION['user'] = $user;
      return array(1, 'login_accepted');
    }
    else return array(1, 'login_denied');
  }
  else
    return array(0, 'Error querying DB. (' . $okolina_db->errno . ') ' . $okolina_db->error);
}

function GetRoom() {
  // Open database connection
  $okolina_db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($okolina_db->connect_errno)
    return array(0, 'Database Connection Error: (' . $okolina_db->connect_errno . ') ' . $okolina_db->connect_error);

  // Get current room color
  if($result = $okolina_db->query('SELECT color FROM rooms
                                  JOIN user_details ON rooms.id=user_details.current_room_id
                                  JOIN users ON users.id=user_details.user_id
                                  WHERE users.username=\'' . $_SESSION['user'] . '\';')) {
    return array(1, $result->fetch_row()[0]);
  }
  else
    return array(0, 'Error querying DB. (' . $okolina_db->errno . ') ' . $okolina_db->error);
}


?>
