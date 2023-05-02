<?php
    $name = @$_POST["name"] or die(header("HTTP/1.x 404 No se recibio un nombre."));
    $price = @$_POST["price"] or die(header("HTTP/1.x 404 No se recibio un precio."));
    $id = @$_POST["product"] or die(header("HTTP/1.x 404 No se recibio un id."));
    $file = @$_FILES["file"];

    $fileTmpName = $file["tmp_name"] or die(header("HTTP/1.x 404 No se recibieron archivos."));
    $new_name = time()."-".rand(1000, 9999)."-" . $file["name"];
    $filePath = "src/uploads/" . $new_name;

    move_uploaded_file( $fileTmpName, "../../" . $filePath );

    include("../../controller/product.controller.php");

    create($id, $name, $price, $filePath, $fileTmpName);
?>