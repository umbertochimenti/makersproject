<?php
   if (isset($_GET['led'])) {
      $led = $_GET['led'];
      $json_led = '(' . "{'led' : '" . $led . "'}" . ')';
      $file = fopen("../json/board.json", "w") or die ("can't open!");
      fwrite($file, $json_led);
      fclose($file);
   }
?>
