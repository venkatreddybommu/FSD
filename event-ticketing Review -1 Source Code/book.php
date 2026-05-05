<?php
include 'includes/db.php';

if(isset($_POST['book'])) {

    $name = $_POST['name'];
    $event = $_POST['event'];

    $conn->query("INSERT INTO bookings (user_name, event_name)
                  VALUES ('$name','$event')");

    echo "<h3 style='color:green;'>Ticket Booked!</h3>";
}
?>

<?php include 'navbar.php'; ?>

<div class="main">
<div class="card">

<h2>Book Ticket</h2>

<form method="POST">
<input type="text" name="name" placeholder="Your Name" required>
<input type="text" name="event" placeholder="Event Name" required>

<button class="btn btn-success" name="book">Book Now</button>
</form>

</div>
</div>