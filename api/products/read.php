<?php
    include("../../controller/product.controller.php");

    @$from = $_GET["from"];
    @$rows = $_GET["rows"];

    if ( isset( $from ) and isset( $rows ) ) {
        read($from, $rows);
        die();
    }

    read();
?>