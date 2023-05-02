<?php
    include("../../controller/product.controller.php");

    $id = $_POST["product"] or die(header("HTTP/1.x 404 No se recibio un id."));

    $name = $_POST["name"] or die(header("HTTP/1.x 404 No se recibio un nombre."));
    $price = $_POST["price"] or die(header("HTTP/1.x 404 No se recibio un precio."));
    $file = @$_FILES["file"];
    
    if ($file["tmp_name"]) {
        update($id, $name, $price, $file);
    }
    else {
        update( $id, $name, $price );
    }

?>