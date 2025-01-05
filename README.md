# CPSC 332 - College Database

The objective of this project was to design and implement a web database application for a university. The database manages information related to professors, departments, courses, sections, students, and enrollments. The project was developed using MySQL for the database management and PHP and HTML for the website functionality.

## Database Creation:
SQL scripts (create_tables.sql and insert_data.sql) were written to create the tables and populate them with sample data. The create_tables.sql script defined the structure of each table, specifying primary keys and foreign keys to enforce relationships. The insert_data.sql script inserted sample records into each table.

## PHP and HTML Web Interface:
A series of PHP scripts as well as an HTML interface script were developed to provide functionalities for different users:
- Students: Students can log in using their campus-wide ID to view their enrolled courses and grades. They can also look up details about specific courses.
- Professors: Professors can log in using their SSN to view the sections they are teaching. They can also view the grades of students in each section.
- Administrators: Administrators can log in to access features similar to both students and professors, including looking up professors, students, courses, and grades.

## User Interactions:
The web interface allows users to interact with the database through forms and links. Validations and error handling were implemented to ensure proper input and feedback. For example, pop-up alerts inform users of invalid inputs like incorrect CWIDs, SSNs, course numbers, or section numbers.

