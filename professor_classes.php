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

$ssn = $_GET['ssn'];

// Fetch professor's name
$name_sql = "SELECT name FROM Professors WHERE social_security_number = '$ssn'";
$name_result = $conn->query($name_sql);

if ($name_result->num_rows > 0) {
    $name_row = $name_result->fetch_assoc();
    $professor_name = $name_row['name'];
    echo "<h2>$professor_name</h2>";
} else {
    echo "<script>alert('Invalid SSN'); window.history.back();</script>";
    $conn->close();
    exit();
}

$sql = "SELECT Courses.course_number, Courses.title, Sections.section_number, Sections.classroom, Sections.meeting_days, Sections.beginning_time, Sections.ending_time 
        FROM Professors 
        JOIN Sections ON Professors.social_security_number = Sections.professor_social_security_number 
        JOIN Courses ON Sections.course_number = Courses.course_number 
        WHERE Professors.social_security_number = '$ssn'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<a href='count_grades.php?course_number=" . $row["course_number"] . "&section_number=" . $row["section_number"] . "'>";
        echo "Course: " . $row["title"]. ", " . $row["course_number"]. " - Section: " . $row["section_number"]. " - Classroom: " . $row["classroom"]. " - Meeting Days: " . $row["meeting_days"]. " - Time: " . $row["beginning_time"]. " to " . $row["ending_time"];
        echo "</a><br>";
    }
} else {
    echo "0 results";
}

echo '<button onclick="window.history.back()">Back</button>';

$conn->close();
?>
