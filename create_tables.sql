USE cs332b4;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Professors;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Professors (
    social_security_number CHAR(9) PRIMARY KEY,
    name VARCHAR(100),
    street_address VARCHAR(100),
    city VARCHAR(50),
    state CHAR(2),
    zip_code CHAR(5),
    area_code CHAR(3),
    number CHAR(7),
    sex CHAR(1),
    title VARCHAR(50),
    salary DECIMAL(10, 2),
    college_degrees VARCHAR(255)
);

CREATE TABLE Departments (
    department_number INT PRIMARY KEY,
    name VARCHAR(50),
    telephone CHAR(10),
    office_location VARCHAR(100),
    chairperson_social_security_number CHAR(9),
    FOREIGN KEY (chairperson_social_security_number) REFERENCES Professors(social_security_number)
);

CREATE TABLE Courses (
    course_number INT PRIMARY KEY,
    title VARCHAR(100),
    textbook VARCHAR(255),
    units INT,
    department_number INT,
    FOREIGN KEY (department_number) REFERENCES Departments(department_number)
);

CREATE TABLE Sections (
    section_number INT,
    course_number INT,
    classroom VARCHAR(50),
    number_of_seats INT,
    meeting_days VARCHAR(20),
    beginning_time TIME,
    ending_time TIME,
    professor_social_security_number CHAR(9),
    PRIMARY KEY (section_number, course_number),
    FOREIGN KEY (course_number) REFERENCES Courses(course_number),
    FOREIGN KEY (professor_social_security_number) REFERENCES Professors(social_security_number)
);

CREATE TABLE Students (
    campus_wide_id CHAR(9) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    street_address VARCHAR(100),
    city VARCHAR(50),
    state CHAR(2),
    zip_code CHAR(5),
    area_code CHAR(3),
    number CHAR(7),
    major_department_number INT,
    FOREIGN KEY (major_department_number) REFERENCES Departments(department_number)
);

CREATE TABLE Enrollments (
    student_id CHAR(9),
    section_number INT,
    course_number INT,
    grade CHAR(2),
    PRIMARY KEY (student_id, section_number, course_number),
    FOREIGN KEY (student_id) REFERENCES Students(campus_wide_id),
    FOREIGN KEY (section_number, course_number) REFERENCES Sections(section_number, course_number)
);
