<?php
session_start();
include 'includes/db.php';

$result = $conn->query("SELECT * FROM events");
?>

<link rel="stylesheet" href="style.css">
<div class="container">
<h2>Available Events</h2>

<?php while($row = $result->fetch_assoc()){ ?>
    <h3><?php echo $row['title']; ?></h3>
    <p><?php echo $row['description']; ?></p>
    <p>Price: ₹<?php echo $row['price']; ?></p>
    <a href="book.php?id=<?php echo $row['id']; ?>">Book Now</a>
    <hr>
<?php } ?>

<a href="my-bookings.php">My Bookings</a> |
<a href="logout.php">Logout</a>
</div>