<?php
    $num_table = $_POST['table_num'];
    $filename = './json/confirmed/table_' . $num_table .'.json';
    if (!unlink($filename)) { 
        echo ($filename . " cannot be deleted due to an error"); 
    } 
    else { 
        echo "[INFO] ordine concluso sul tavolo: " . $num_table; 
    }
?>
