<?php

/**
 * Primary Logic
 */

// Check for form submission (POST) data
if (isset($_POST["setup"])) {
  // Run Setup
  $results = runSetup();
  // Redirect to confirmation
  header('Location: admin.php?result=' . urlencode($results));
}

// Start the page
displayHeader();

// Check for results (GET) data
if (isset($_GET["result"])) {
  // Result data exists = Run setup & display result message
  displayResults();
}
else {
  // Default = Show setup options
  displayOptions();
}

// End the page
displayFooter();


/**
 * Page Display Functions
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

  <?php
  echo '<p>' . htmlspecialchars($_GET["result"]) . '</p>';
}

/**
 * Setup Functions
 */

 function runSetup() {
   return 'It worked.';
 }

?>
