<?php
$conn = new mysqli("localhost", "root", "", "student_db");

$result = $conn->query("SELECT * FROM students");
?>

<!DOCTYPE html>
<html>
<head>
    <title>View Students</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h2>Registered Students</h2>

    <table border="1" width="100%">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Department</th>
            <th>Phone</th>
        </tr>

        <?php while($row = $result->fetch_assoc()) { ?>
        <tr>
            <td><?php echo $row['id']; ?></td>
            <td><?php echo $row['name']; ?></td>
            <td><?php echo $row['email']; ?></td>
            <td><?php echo $row['dob']; ?></td>
            <td><?php echo $row['department']; ?></td>
            <td><?php echo $row['phone']; ?></td>
        </tr>
        <?php } ?>

    </table>

    <br>
    <a href="index.php">Back</a>
</div>

</body>
</html>