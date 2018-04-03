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
 * DB INFO
 */
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'okolina');


/**
 * CLASS OkolinaDB
 */
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

  public static function query($query, ...$params) {
    // Make sure the connection is open
    self::open();
    if (self::$isOpen) {
      // Prepare statement
      $stmt = self::$conn->prepare($query);

      // Bind $params if necessary
      if (count($params) > 0) {
        $types = '';
        for ($i = 0; $i < count($params); $i++) {
          // List parameter types
          $types .= 's';
        }
        // Bind parameters
        $stmt->bind_param($types, ...$params);
      }

      // Run query
      if($stmt->execute()) {
        $result = $stmt->get_result();
        return array(
          'msg' => array(SUCCESS, 'query_successful'),
          'data' => $result
        );
      }
      else {
        return array(
          'msg' => array(FAILURE, 'query_error'),
          'data' => '(' . self::$conn->errno . ') ' . self::$conn->error
        );
      }
    }
    else {
      return array(
        'msg' => array(FAILURE, 'db_connection_error'),
        'data' => '(' . self::$conn->connect_errno . ') ' . self::$conn->connect_error
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
