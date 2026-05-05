<?php
$conn = new mysqli("localhost", "root", "", "order_management");

if ($conn->connect_error) {
    die("Connection failed");
}

// JOIN QUERY
$sql = "
SELECT c.name, p.product_name, p.price, o.quantity, o.order_date,
       (p.price * o.quantity) AS total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN products p ON o.product_id = p.product_id
ORDER BY o.order_date DESC
";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Order Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Customer Order History</h2>

<table>
<tr>
    <th>Customer</th>
    <th>Product</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
    <th>Date</th>
</tr>

<?php while($row = $result->fetch_assoc()) { ?>
<tr>
    <td><?= $row['name'] ?></td>
    <td><?= $row['product_name'] ?></td>
    <td><?= $row['price'] ?></td>
    <td><?= $row['quantity'] ?></td>
    <td><?= $row['total_amount'] ?></td>
    <td><?= $row['order_date'] ?></td>
</tr>
<?php } ?>

</table>

</body>
</html>