<?php
   if (isset($_GET['web'])) {
      $req = $_GET['web'];
      if($req=='req') {
         $res = "";
         if (($handle = fopen("../json/request.json", "r")) !== FALSE) {
            while (($line = fgets($handle)) !== FALSE) {
               $res .= $line;
            }
            echo $_GET['callback'] . '(' . $res . ')';
         } else {
            echo "[ERROR] file not found!";
         }
      }
   }
?>
