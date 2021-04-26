<?php
    $to_confirm=false;
    $confirmed=false;
    $path_to_confirm = './json/to_confirm';
    $num_table = $_POST['table_num'];

    $json_file_table = $path_to_confirm . '/table_' . $num_table . ".json"; 
    $fileList = glob($path_to_confirm . '/*.json');
    foreach($fileList as $filename) {
        if(is_file($filename)) {
            if($filename == $json_file_table) {
                $to_confirm=true;
                break;
            }
        }
    }

    if($to_confirm)
        echo "to_confirm";
    else {
        $path_confirmed = './json/confirmed';
        $json_file_table = $path_confirmed . '/table_' . $num_table . ".json"; 
        $fileList = glob($path_confirmed . '/*.json');
        foreach($fileList as $filename) {
            if(is_file($filename)) {
                if($filename == $json_file_table) {
                    $confirmed=true;
                    break;
                }
            }
        }
        
        if($confirmed)
            echo "confirmed";
        else
            echo "closed";
    }
?>
