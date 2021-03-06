<?php
/*******************************************************************************
 * admin.php
 *
 * This is the setup page for Okolina. DROPS any current Okolina tables and
 * then builds a new one complete with all appropriate tables and initial data.
 *
 * Currently adds a test user and a small number of rooms.
 ******************************************************************************/

/**
 * INCLUDES
 */
require_once('php/db_access.php');
require_once('php/constants.php');


/**
 * CONSTANTS
 */
define('TEST_USERNAME', 'test');
define('WORLD_SIZE_X', 4);
define('WORLD_SIZE_Y', 4);
define('DEFAULT_ROOM_BIOME', 'grass');

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
 * PAGE DISPLAY FUNCTIONS
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
  // Check if setup has already been completed
  $res = OkolinaDB::query('SELECT value FROM okolina_info WHERE name="setup_complete"');
  if ($res['msg'][0] == SUCCESS) {
    $isAlreadySetup = $res['data']->fetch_row()[0];
    if ($isAlreadySetup) return 'Setup completed previously. DROP all tables before running setup.';
    else return 'Setup previously failed. DROP all tables before running setup again.';
  }


  /* Queue up the queries first */

  // Build tables
  $q[] = 'CREATE TABLE okolina_info (
            name VARCHAR(255) PRIMARY KEY,
            value VARCHAR(255)
          )';
  $q[] = 'CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
          )';
  $q[] = "CREATE TABLE rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            x_pos INT NOT NULL,
            y_pos INT NOT NULL,
            biome VARCHAR(255) DEFAULT '" . DEFAULT_ROOM_BIOME . "',
            seed INT UNSIGNED DEFAULT 0,
            UNIQUE KEY pos (x_pos, y_pos)
          )";
  $q[] = 'CREATE TABLE user_details (
            user_id INT PRIMARY KEY,
            current_room_id INT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(current_room_id) REFERENCES rooms(id)
          )';

  // Generate/INSERT test rooms
  for ($y = 0; $y < WORLD_SIZE_Y; $y++) {
    for ($x = 0; $x < WORLD_SIZE_X; $x++) {
      $r = mt_rand(0, mt_getrandmax());
      $q[] = "INSERT INTO rooms (x_pos, y_pos, seed) VALUES ($x, $y, $r)";
    }
  }

  // INSERT test user
  $q[] = "INSERT INTO users (username) VALUES ('" . TEST_USERNAME . "')";
  $q[] = 'INSERT INTO user_details (user_id, current_room_id) VALUES (1, 1)';

  // Set setup_complete flag
  $q[] = 'INSERT INTO okolina_info (name, value) VALUES ("setup_complete", "true")';

  /* Run queries */
  for($i = 0; $i < count($q); $i++) {
    $res = OkolinaDB::query($q[$i]);
    if($res['msg'][0] == FAILURE) return $res['data'];
  }

  // Close Database Connection
  OkolinaDB::close();

  return 'Setup completed successfully.';
}

?>
