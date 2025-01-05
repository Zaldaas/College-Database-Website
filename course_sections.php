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

$sql = "SELECT Sections.section_number, Sections.classroom, Sections.meeting_days, Sections.beginning_time, Sections.ending_time, COUNT(Enrollments.student_id) as student_count, Professors.name as professor_name
        FROM Sections
        LEFT JOIN Enrollments ON Sections.section_number = Enrollments.section_number AND Sections.course_number = Enrollments.course_number
        LEFT JOIN Professors ON Sections.professor_social_security_number = Professors.social_security_number
        WHERE Sections.course_number = '$course_number'
        GROUP BY Sections.section_number, Sections.classroom, Sections.meeting_days, Sections.beginning_time, Sections.ending_time, Professors.name";

$result = $conn->query($sql);

echo "<h2>Sections for Course Number: $course_number</h2>";
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "Section: " . $row["section_number"]. " - Classroom: " . $row["classroom"]. " - Meeting Days: " . $row["meeting_days"]. " - Time: " . $row["beginning_time"]. " to " . $row["ending_time"]. " - Enrolled Students: " . $row["student_count"]. " - Professor: " . $row["professor_name"]. "<br>";
    }
} else {
    echo "<script>alert('Invalid course number'); window.history.back();</script>";
    $conn->close();
    exit();
}

echo '<button onclick="window.history.back()">Back</button>';

$conn->close();
?>
