<?php include 'navbar.php'; ?>

<div class="main">
<div class="card">

<h2>Create Event</h2>

<form method="POST">
<input type="text" name="event_name" placeholder="Event Name" required>
<input type="date" name="event_date" required>
<input type="number" name="price" placeholder="Ticket Price" required>

<button class="btn btn-primary">Create</button>
</form>

</div>
</div>