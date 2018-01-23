<?php
//No es un codigo para poner en produccion... solo pruebas

$uploaddir = './img-documentos/';

$uploadfile = $uploaddir . basename($_FILES['file']['name']);

//$data = /** whatever you're serializing **/; header('Content-Type: application/json'); echo json_encode($data);


if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    $data['url'] = $uploadfile;
    http_response_code(200);
/*    header('Content-Type: application/json');
    echo json_encode($data);*/
} else {
    $data['error'] = 'No se pudo subir la imagen';
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($data);
}

?>