<?php
    $board_status = "";
    if (($handle = fopen("../json/board.json", "r")) !== FALSE) {
        while (($line = fgets($handle)) !== FALSE) {
            $board_status .= $line;
        }
        echo $board_status;
    } else {
        echo "[ERROR] file not found!";
    }
?>
