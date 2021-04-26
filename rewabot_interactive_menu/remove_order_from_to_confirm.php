<?php
    $num_table = $_POST['table_num'];
    $filename = './json/to_confirm/table_' . $num_table .'.json';
    if (!unlink($filename)) { 
        echo ($filename . " cannot be deleted due to an error"); 
    } 
    else { 
        echo "[INFO] ordine riaperto sul tavolo: " . $num_table; 
    }
?>
