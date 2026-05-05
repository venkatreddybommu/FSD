<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h2>Student Registration Form</h2>

    <form action="insert.php" method="POST">
        <input type="text" name="name" placeholder="Full Name" required>

        <input type="email" name="email" placeholder="Email" required>

        <input type="date" name="dob" required>

        <select name="department" required>
            <option value="">Select Department</option>
            <option>Computer Science</option>
            <option>Mechanical</option>
            <option>Electrical</option>
            <option>Civil</option>
        </select>

        <input type="text" name="phone" placeholder="Phone Number" required>

        <button type="submit">Register</button>
    </form>

    <br>
    <a href="view.php">View Students</a>
</div>

</body>
</html>