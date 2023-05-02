<?php
    $hostname = "localhost";
    $username = "root";
    $password = "1234";
    $database = "db_catalogo";

    $connection = new mysqli($hostname, $username, $password, $database) or die ('Could not connect to the database server' . mysqli_connect_error() );
?>