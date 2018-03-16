<?php
/*******************************************************************************
 * db-access.php
 *
 * For database connections
 ******************************************************************************/

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'okolina');

class OkolinaDB {
  private $conn;

  public function open() {
    // Open connection
    $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($this->conn->connect_errno)
      return array(0, 'DB Connection Error: (' . $this->conn->connect_errno . ') ' . $this->conn->connect_error);
    else return array(1, 'DB Connection Succesful');
  }

  public function query($query) {
    // Query
    if($result = $this->conn->query($query)) return array(1, $result);
    else return array(0, 'Error querying DB. (' . $this->conn->errno . ') ' . $this->conn->error);
  }

  public function __destruct() {
    $this->conn->close();
  }
}

?>
