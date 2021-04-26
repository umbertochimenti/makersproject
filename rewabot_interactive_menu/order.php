<?php

    $to_confirm_path = './json/to_confirm';

    if (!file_exists($to_confirm_path))
        mkdir($to_confirm_path, 0777, true);

    $json_order = $_POST['json_string'];
    $order = json_decode($json_order);
    $file_name = $to_confirm_path . "/table_" . $order[sizeof($order)-1]->table_num . ".json";
    $order_file = fopen($file_name, "w");
    fwrite($order_file, $json_order);
    fclose($order_file);
    echo "[INFO] Ordine correttamente salvato!";
?>
