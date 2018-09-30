<?php
	
$param = $argv[1];

$param = base64_decode($param);
$param = json_decode($param,true);

$_REQUEST = $param;

include_once("./server/index.php");