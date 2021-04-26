<?php

    $confirmed_path = './json/confirmed';
    if (!file_exists($confirmed_path))
        mkdir($confirmed_path, 0777, true);

    $num_table = $_POST['table_num'];
    $currentFilePath = './json/to_confirm/table_' . $num_table .'.json';
    $newFilePath = $confirmed_path . '/table_' . $num_table .'.json';
    $fileMoved = rename($currentFilePath, $newFilePath);
    if ($fileMoved) {
        echo "[INFO] ordine confermato sul tavolo: " . $num_table; 
    } else { 
        echo "[WARNING] errore di conferma nell'ordine sul tavolo: " . $num_table; 
    }
?>
