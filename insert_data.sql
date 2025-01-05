USE cs332b4;

-- Insert records into Professors table
INSERT INTO Professors (social_security_number, name, street_address, city, state, zip_code, area_code, number, sex, title, salary, college_degrees) VALUES
('123456789', 'John Doe', '123 Moonbrook St', 'Los Angeles', 'CA', '90005', '323', '8546234', 'M', 'Professor', 90000.00, 'PhD in Computer Science'),
('987654321', 'Jane Smith', '456 Cathedral Dr', 'Irvine', 'CA', '92657', '949', '3629942', 'F', 'Associate Professor', 80000.00, 'MS in Mathematics'),
('111223333', 'Alice Johnson', '789 Barren St', 'Anaheim', 'CA', '92815', '714', '6629012', 'F', 'Assistant Professor', 70000.00, 'PhD in Software Engineering');

-- Insert records into Departments table
INSERT INTO Departments (department_number, name, telephone, office_location, chairperson_social_security_number) VALUES
(1, 'Computer Science', '6575551234', 'CS Building Room 110', '123456789'),
(2, 'Mathematics', '6575555678', 'Math Building Room 210', '987654321');

-- Insert records into Courses table
INSERT INTO Courses (course_number, title, textbook, units, department_number) VALUES
(101, 'Introduction to Computer Science', 'Computer Science 101', 3, 1),
(102, 'Data Structures', 'Data Structures and Algorithms', 3, 1),
(201, 'Calculus I', 'Calculus I', 4, 2),
(202, 'Linear Algebra', 'Linear Fundamentals', 3, 2);

-- Insert records into Sections table
INSERT INTO Sections (section_number, course_number, classroom, number_of_seats, meeting_days, beginning_time, ending_time, professor_social_security_number) VALUES
(1, 101, 'Room 101', 30, 'MWF', '09:00:00', '10:00:00', '123456789'),
(2, 101, 'Room 102', 25, 'TTh', '10:00:00', '11:30:00', '111223333'),
(1, 102, 'Room 103', 20, 'MWF', '11:00:00', '12:00:00', '111223333'),
(1, 201, 'Room 201', 30, 'TTh', '13:00:00', '14:30:00', '987654321'),
(2, 201, 'Room 202', 35, 'MWF', '14:00:00', '15:00:00', '987654321'),
(1, 202, 'Room 203', 40, 'TTh', '15:00:00', '16:30:00', '123456789');

-- Insert records into Students table
INSERT INTO Students (campus_wide_id, first_name, last_name, street_address, city, state, zip_code, area_code, number, major_department_number) VALUES
('123456789', 'Robert', 'Brown', '123 Elm St', 'Fullerton', 'CA', '92831', '657', '1234567', 1),
('987654321', 'Emily', 'Davis', '456 Oak Ave', 'Corona', 'CA', '92882', '951', '7654321', 1),
('112233445', 'Michael', 'Wilson', '789 Pine St', 'Fullerton', 'CA', '92833', '714', '3259012', 2),
('519283746', 'Sarah', 'Miller', '321 Birch St', 'Fullerton', 'CA', '92831', '657', '7823456', 2),
('998877665', 'David', 'Taylor', '654 Cedar Blvd', 'Tustin', 'CA', '92780', '949', '9217890', 1),
('591827364', 'Jessica', 'Anderson', '987 Maple St', 'Fullerton', 'CA', '92834', '657', '1302345', 1),
('808007911', 'Daniel', 'Thomas', '654 Spruce Cir', 'Riverside', 'CA', '92505', '951', '4106789', 2),
('829158368', 'Laura', 'Jackson', '321 Willow St', 'Fullerton', 'CA', '92831', '714', '6630123', 2),
('648385912', 'Paul', 'Smith', '839 Briar Ln', 'Anaheim', 'CA', '92816', '714', '8472723', 2),
('773828964', 'Sophia', 'Dunn', '934 Berry St', 'Fullerton', 'CA', '92833', '657', '7774813', 2);

-- Insert records into Enrollments table
INSERT INTO Enrollments (student_id, section_number, course_number, grade) VALUES
('123456789', 1, 101, 'A'),
('987654321', 2, 101, 'B+'),
('112233445', 1, 102, 'A-'),
('519283746', 2, 101, 'B'),
('998877665', 1, 201, 'C+'),
('591827364', 2, 201, 'B-'),
('808007911', 1, 202, 'A'),
('829158368', 2, 201, 'B+'),
('123456789', 2, 201, 'B-'),
('987654321', 1, 102, 'A'),
('112233445', 2, 201, 'B'),
('519283746', 1, 202, 'C'),
('998877665', 2, 101, 'A-'),
('591827364', 1, 102, 'B+'),
('808007911', 2, 201, 'C+'),
('829158368', 1, 202, 'B-'),
('648385912', 1, 102, 'A+'),
('773828964', 1, 101, 'B'),
('648385912', 1, 201, 'A-'),
('773828964', 2, 201, 'C+');
