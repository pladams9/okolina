<?php
/*******************************************************************************
 * ajax.php
 *
 * This script handles any AJAX requests from the client.
 ******************************************************************************/

/**
 * HANDLE REQUESTS
 */

session_start();

// Stop warnings from tainting our script output
ob_start();

// Parse the incoming request
$request = json_decode(file_get_contents('php://input'), true);

// Handle the request
require __DIR__ . '/ajax/requests.php';
$output = HandleRequest($request);

// Tag on any warnings from PHP
$pm = ob_get_contents();
if ($pm != '') $output['debug'] = $pm; // Comment this out to suppress warnings
ob_end_clean();

// Output
echo json_encode($output);
return;

?>
