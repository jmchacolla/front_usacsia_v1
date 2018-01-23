<?php

$data = array('nombre'=>'rosario');
//header("status: 304");
header('Content-Type: application/json');
http_response_code(208);
echo json_encode($data);

?>