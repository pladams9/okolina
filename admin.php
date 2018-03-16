<?php
/*******************************************************************************
 * admin.php
 *
 * This is the setup page for Okolina. DROPS any current Okolina database and
 * then builds a new one complete with all appropriate tables and initial data.
 *
 * Currently adds a test user and a small number of bland rooms.
 ******************************************************************************/

/**
 * CONSTANTS
 */

require_once('inc/db_access.php');

define('TEST_USERNAME', 'test_user');
define('WORLD_SIZE_X', 4);
define('WORLD_SIZE_Y', 4);
define('DEFAULT_ROOM_COLOR', '#11FF66');

/**
 * PRIMARY PAGE LOGIC
 */

// Check for form submission (POST) data first
if (isset($_POST['setup'])) {
  // Run Setup
  $results = runSetup();
  // Redirect to confirmation
  header('Location: admin.php?result=' . urlencode($results));
}

// If we've gotten here, then we need to build the page
displayHeader();

// Check for results (GET) data
if (isset($_GET['result'])) {
  // Result data exists = Display result message
  displayResults();
}
else {
  // Default = Show setup options
  displayOptions();
}

// End the page
displayFooter();

/**
 * PAGE DISPALY FUNCTIONS
 */

/* Displays header */
function displayHeader() {
  ?>
  <!doctype html>
  <html>
  <head>
    <title>Admin - Okolina</title>
  </head>
  <body>
    <h1>Okolina - Admin</h1>
  <?php
}

/* Displays footer */
function displayFooter() {
  ?>
  </body>
  </html>
  <?php
}

/* Displays the default/initial options page */
function displayOptions() {
  ?>
  <p>No options right now. Just click the button below to:</p>
  <ul>
    <li>Build the tables (rooms & users)
    <li>Add a test user
    <li>Generate room data
  </ul>

  <form action="" method="post">
    <input type="hidden" name="setup" value="1">
    <input type="submit" value="Setup Oklolina">
  </form>
  <?php
}

/* Displays the results of the setup */
function displayResults() {
  ?>
  <p>Everything is done. Thank you.</p>
  <p>Results:</p>
  <?php echo '<code>' . htmlspecialchars($_GET['result']) . '</code>'; ?>
  <p><a href="admin.php">Return to Admin Options</a></p>

  <?php
}

/**
 * SETUP FUNCTIONS
 */

/* Meat of this page. Runs the setup based on POST-ed options */
function runSetup() {
  // Open database connection
  $okolina_db = new mysqli(DB_HOST, DB_USER, DB_PASS);
  if ($okolina_db->connect_errno) {
    return 'Database Connection Error: (' . $okolina_db->connect_errno . ') ' . $okolina_db->connect_error;
  }

  // DROP DB_NAME if it exists
  if(!$okolina_db->query('DROP DATABASE IF EXISTS ' . DB_NAME)) {
    return 'Error dropping DB "' . DB_NAME . '". (' . $okolina_db->errno . ') ' . $okolina_db->error;
  }
  // Build new database
  if(
    !$okolina_db->query('CREATE DATABASE ' . DB_NAME) ||
    !$okolina_db->query('USE ' . DB_NAME) ||
    !$okolina_db->query('CREATE TABLE users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                        )') ||
    !$okolina_db->query('CREATE TABLE rooms (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        x_pos INT,
                        y_pos INT,
                        color VARCHAR(7) DEFAULT \'' . DEFAULT_ROOM_COLOR . '\',
                        UNIQUE KEY pos (x_pos, y_pos)
                      )') ||
    !$okolina_db->query('CREATE TABLE user_details (
                        user_id INT PRIMARY KEY,
                        current_room_id INT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id),
                        FOREIGN KEY(current_room_id) REFERENCES rooms(id)
                        )')
  ) {
    return 'Error building DB "' . DB_NAME . '". (' . $okolina_db->errno . ') ' . $okolina_db->error;
  }

  // Generate/INSERT test rooms
  for ($y = 0; $y < WORLD_SIZE_Y; $y++) {
    for ($x = 0; $x < WORLD_SIZE_X; $x++) {
      if (!$okolina_db->query("INSERT INTO rooms (x_pos, y_pos, color) VALUES ($x, $y, '#" . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT) . "')")) {
        return "Error adding room at ($x, $y): ($okolina_db->errno) $okolina_db->error";
      }
    }
  }

  // INSERT test user
  if(
    !$okolina_db->query('INSERT INTO users (username) VALUES (\'' . TEST_USERNAME . '\')') ||
    !$okolina_db->query('INSERT INTO user_details (user_id, current_room_id) VALUES (1, 1)')
  ) {
    return 'Error adding test user: (' . $okolina_db->errno . ') ' . $okolina_db->error;
  }

  // Close Database Connection
  $okolina_db->close();

  return 'Reached the end of runSetup().';
}

?>
