<?php

    include("database.php");
    
    function create($id, $name, $price, $imagePath, $imageName) {
        global $connection;
        $name = str_replace(Array("'", '"'), Array("\'", '\"'), $name);

        $connection->query("insert into tbl_image (name, path, update_time) values ('$imageName', '$imagePath', CURRENT_TIMESTAMP);");
        $connection->query("insert into tbl_product (product, name, price, image) values ($id, '$name', $price, last_insert_id() );");
    }
    
    function read($from = null, $rows = null) {
        global $connection;

        if ( is_null($from) or is_null($rows) ) {
            $result = $connection->query("select product, product.name, price, image.path from tbl_product product inner join tbl_image image on product.image = image.image;");
            $count = $result->num_rows;
        }
        else {
            $result = $connection->query("select product, product.name, price, image.path from tbl_product product inner join tbl_image image on product.image = image.image LIMIT $from, $rows;");
            $count = $connection->query("select count(product) from tbl_product")->fetch_column();
        }
        $count = intval($count);

        $response = $result->fetch_all(MYSQLI_ASSOC);
        $object = (object) ( Array( "totalProducts" => $count, "products" => $response) );

        header('Content-type: text/json');
        echo json_encode($object, JSON_PRETTY_PRINT);
    }

    function update($id, $name, $price, $file = null) {
        global $connection;
        $name = str_replace(Array("'", '"'), Array("\'", '\"'), $name);
        
        if ( is_null($file) ) {
            $result = $connection->query("update tbl_product set name = '$name', price = '$price' where product = $id;");
        }
        else {
            $fileTmpName = $file["tmp_name"];
            $fileName = time()."-".rand(1000, 9999)."-" . $file["name"];
            $filePath = "src/uploads/" . $fileName;

            $result = $connection->query("select product.image, image.path from tbl_product product inner join tbl_image image on product.image = image.image where product.product = '$id';");
            $result = $result->fetch_object();

            $idImage = $result->image;
            $path = $result->path;

            unlink("../../$path") or die(header("HTTP/1.x 404 La imagen ya fue borrada."));
            move_uploaded_file( $fileTmpName, "../../" . $filePath );

            $connection->query("update tbl_image set path = '$filePath' where image = $idImage");
        }
    }

    function delete($id) {
        global $connection;
        $connection->query("delete from tbl_product where product = '$id';");
    }

    function deleteWithFile($id) {
        global $connection;
        $result1 = $connection->query("select path from tbl_product product inner join tbl_image image on product.image = image.image where product.product = $id;");
        $path = $result1->fetch_column();
        delete($id);
        unlink('../../'.$path) or die(header("HTTP/1.x 404 La imagen ya fue borrada."));
        $result2 = $connection->query("delete from tbl_image where path = '$path';");
    }
?>