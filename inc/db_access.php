<?php
/*******************************************************************************
 * db-access.php
 *
 * For database connections
 ******************************************************************************/

/**
 * INCLUDES
 */
require_once 'constants.php';


/**
 * CLASS OkolinaDB
 */
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'okolina');

class OkolinaDB {
  private static $conn;
  private static $isOpen = false;

  public static function open() {
    if (!self::$isOpen) {
      // Open connection
      self::$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
      if (!self::$conn->connect_errno) self::$isOpen = true;
    }
  }

  public static function query($query) {
    //Make sure the connection is open
    self::open();
    if (self::$isOpen) {
      // Query
      if($result = self::$conn->query($query)) {
        return array(
          'msg' => array(SUCCESS, 'Query Successful.'),
          'data' => $result
        );
      }
      else {
        return array(
          'msg' => array(FAILURE, 'Error querying DB. (' . self::$conn->errno . ') ' . self::$conn->error)
        );
      }
    }
    else {
      return array(
        'msg' => array(FAILURE, 'DB Connection Error: (' . self::$conn->connect_errno . ') ' . self::$conn->connect_error)
      );
    }
  }

  public static function close() {
    self::$conn->close();
    self::$isOpen = false;
  }
}
// Immediately open connection
OkolinaDB::open();

?>
