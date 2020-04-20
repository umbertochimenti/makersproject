<?php
   if (isset($_POST['json_req'])) {
      $json_req = $_POST['json_req'];
      $file = fopen("../json/request.json", "w") or die ("can't open!");
	   fwrite($file, $json_req);
	   fclose($file);
   }
?>
