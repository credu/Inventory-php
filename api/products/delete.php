<?php
    $id = $_POST["id"] or die(header("HTTP/1.x 404 No se recibieron datos"));

    include("../../controller/product.controller.php");

    deleteWithFile($id);
?>