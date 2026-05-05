<?php
include 'includes/db.php';
include 'navbar.php';
?>

<div class="main">
<div class="card">

<h2>Payment History</h2>

<table>
<tr>
<th>User</th>
<th>Event</th>
<th>Amount</th>
<th>Method</th>
</tr>

<?php
$result = $conn->query("SELECT * FROM payments");

while($row = $result->fetch_assoc()) {
    echo "<tr>
    <td>".$row['user_name']."</td>
    <td>".$row['event_name']."</td>
    <td>".$row['amount']."</td>
    <td>".$row['payment_method']."</td>
    </tr>";
}
?>

</table>

</div>
</div>