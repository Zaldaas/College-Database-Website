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

$course_number = $_GET['course_number'];
$section_number = $_GET['section_number'];

$sql = "SELECT grade, COUNT(*) as count, GROUP_CONCAT(CONCAT(Students.first_name, ' ', Students.last_name) SEPARATOR ', ') as student_names
        FROM Enrollments 
        JOIN Students ON Enrollments.student_id = Students.campus_wide_id
        WHERE course_number = '$course_number' AND section_number = '$section_number'
        GROUP BY grade";

$result = $conn->query($sql);

echo "<h2>Grades for Course: $course_number, Section: $section_number</h2>";
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "Grade: " . $row["grade"]. " - Count: " . $row["count"]. " - Student: " . $row["student_names"]. "<br>";
    }
} else {
    echo "<script>alert('Invalid course/section number'); window.history.back();</script>";
    $conn->close();
    exit();
}

echo '<button onclick="window.history.back()">Back</button>';

$conn->close();
?>
