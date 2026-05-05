<?php
$conn = new mysqli("localhost", "root", "", "payment_system");

if ($conn->connect_error) {
    die("Connection failed");
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $amount = $_POST['amount'];

    $conn->begin_transaction();

    try {

        // Check user balance
        $result = $conn->query("SELECT balance FROM accounts WHERE account_id = 1");
        $row = $result->fetch_assoc();
        $userBalance = $row['balance'];

        if ($userBalance < $amount) {
            throw new Exception("Insufficient Balance");
        }

        // Deduct from user
        $conn->query("UPDATE accounts SET balance = balance - $amount WHERE account_id = 1");

        // Add to merchant
        $conn->query("UPDATE accounts SET balance = balance + $amount WHERE account_id = 2");

        // Commit if everything successful
        $conn->commit();

        $message = "Payment Successful! ₹$amount transferred.";

    } catch (Exception $e) {

        $conn->rollback();

        $message = "Transaction Failed: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Payment Simulation</title>
    <style>
        body { font-family: Arial; padding: 30px; background:#f4f4f4; }
        .box { background:white; padding:20px; width:300px; margin:auto; border-radius:8px; box-shadow:0 3px 8px rgba(0,0,0,0.1); }
        input { width:100%; padding:8px; margin-bottom:10px; }
        button { width:100%; padding:8px; background:#28a745; color:white; border:none; }
        h2 { text-align:center; }
        p { text-align:center; font-weight:bold; }
    </style>
</head>
<body>

<div class="box">
    <h2>Online Payment</h2>

    <form method="POST">
        <input type="number" name="amount" placeholder="Enter amount" required>
        <button type="submit">Pay Now</button>
    </form>

    <p><?= $message ?></p>
</div>

</body>
</html>