<?php
$servername = "mariadb";
$username = "cs332b4";
$password = "00vhYNjC";
$dbname = "cs332b4";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$student_id = $_GET['student_id'];

// Fetch student's name
$name_sql = "SELECT first_name, last_name FROM Students WHERE campus_wide_id = '$student_id'";
$name_result = $conn->query($name_sql);

if ($name_result->num_rows > 0) {
    $name_row = $name_result->fetch_assoc();
    $student_name = $name_row['first_name'] . ' ' . $name_row['last_name'];
    echo "<h2>$student_name</h2>";
} else {
    echo "<script>alert('Invalid CWID'); window.history.back();</script>";
    $conn->close();
    exit();
}

$sql = "SELECT Courses.course_number, Courses.title, Enrollments.grade 
        FROM Enrollments
        JOIN Courses ON Enrollments.course_number = Courses.course_number
        WHERE Enrollments.student_id = '$student_id'";

$result = $conn->query($sql);

echo "<h2>Courses and Grades</h2>";
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "Course Number: " . $row["course_number"]. " - Course: " . $row["title"]. " - Grade: " . $row["grade"]. "<br>";
    }
} else {
    echo "0 results";
}

echo "<h3>Course Lookup</h3>";
echo '<form action="course_sections.php" method="get">
        <input type="text" name="course_number" placeholder="Enter Course Number" required>
        <button type="submit">Submit</button>
      </form>';

echo '<button onclick="window.history.back()">Back</button>';

$conn->close();
?>
