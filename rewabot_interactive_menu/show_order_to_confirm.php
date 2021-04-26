<?php
    $list_of_table_order=array();
    $fileList = glob('./json/to_confirm/*.json');
    usort($fileList, create_function('$a,$b', 'return filemtime($a)-filemtime($b);'));
    foreach($fileList as $filename){
        if(is_file($filename)){
            $order_file = fopen($filename, "r");
            $order = fgets($order_file);
            fclose($order_file);
            array_push($list_of_table_order, $order);
            break;
        }
    }
    echo json_encode($list_of_table_order);

?>
