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

$request = json_decode(file_get_contents('php://input'), true);
require 'inc/ajax/requests.php';
echo json_encode(HandleRequest($request));
return;

?>
