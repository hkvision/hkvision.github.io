<?php
$name = $_GET['name'];
$email = $_GET['email'];
$msg = $_GET['message'];
mail("huangkaivision@gmail.com","From: ".$name." (".$email.")",$msg);
echo 'Thank you so much for your message. Look forward to my reply soon!';
?>