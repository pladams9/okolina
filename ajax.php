<?php
/*******************************************************************************
 * ajax.php
 *
 * This script handles any AJAX requests from the client.
 ******************************************************************************/


/**
 * HANDLE REQUESTS
 */

$data = json_decode(file_get_contents('php://input'), true);

switch($data['action']) {
  case 'login':
    Login();
    break;
  default:
    echo 'ERROR: No matching action.';
}


/**
 * FUNCTIONS
 */

function Login() {
  echo 'Login attempted';
}


// // Open database connection
// $okolina_db = new mysqli(DB_HOST, DB_USER, DB_PASS);
// if ($okolina_db->connect_errno) {
// return 'Database Connection Error: (' . $okolina_db->connect_errno . ') ' . $okolina_db->connect_error;
// }
//
// // DROP DB_NAME if it exists
// if(!$okolina_db->query('DROP DATABASE IF EXISTS ' . DB_NAME)) {
// return 'Error dropping DB "' . DB_NAME . '". (' . $okolina_db->errno . ') ' . $okolina_db->error;
// }

?>
