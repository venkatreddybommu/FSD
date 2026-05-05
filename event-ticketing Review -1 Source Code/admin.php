<?php
session_start();
if($_SESSION['role'] != 'admin'){
    header("Location: login.php");
}
?>

<link rel="stylesheet" href="style.css">
<div class="container">
<h2>Admin Panel</h2>
<a href="create-event.php">Create Event</a>
<br><br>
<a href="logout.php">Logout</a>
</div>