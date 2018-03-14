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

$data = json_decode(file_get_contents('php://input'), true);

switch($data['action']) {
  case 'login':
    $result = Login();
    break;
  default:
    $result = array('error', 'No matching action.');
}
echo json_encode($result);


/**
 * FUNCTIONS
 */

function Login() {
  global $data;

  // Open database connection
  $okolina_db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($okolina_db->connect_errno)
    return array('error', 'Database Connection Error: (' . $okolina_db->connect_errno . ') ' . $okolina_db->connect_error);

  // Is user in db?
  if($result = $okolina_db->query('SELECT COUNT(*) FROM users WHERE username=\'' . $data['user'] . '\';')) {
    if($result->fetch_row()[0] == 1) return array('success', 'login_accepted');
    else return array('success', 'login_denied');
  }
  else
    return array('error', 'Error querying DB. (' . $okolina_db->errno . ') ' . $okolina_db->error);
}




?>
