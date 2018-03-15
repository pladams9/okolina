<?php
/*******************************************************************************
 * db-config.php
 *
 * Common database constants
 ******************************************************************************/

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'okolina');

function QueryDB($query) {
  // Open connection
  $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($db->connect_errno)
    return array(0, 'Database Connection Error: (' . $db->connect_errno . ') ' . $db->connect_error);

  // Query
  if($result = $db->query($query)) return array(1, $result);
  else return array(0, 'Error querying DB. (' . $db->errno . ') ' . $db->error);
}

?>
