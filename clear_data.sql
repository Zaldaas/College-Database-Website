USE cs332b4;

-- Disable foreign key checks to avoid constraint issues
SET FOREIGN_KEY_CHECKS = 0;

-- Delete existing records from tables
DELETE FROM Enrollments;
DELETE FROM Students;
DELETE FROM Sections;
DELETE FROM Courses;
DELETE FROM Departments;
DELETE FROM Professors;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
