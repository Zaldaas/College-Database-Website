# CSUF College Database
The objective of this project is to design and implement a web database application for a university. The database manages information related to professors, departments, courses, sections, students, and enrollments.

The project was initially developed using MySQL for the database management and PHP and HTML for the website functionality. It has now been redone to incorporate Vite/React for the frontend and Laravel for the backend.

## Database Creation
Initially, SQL scripts (create_tables.sql and insert_data.sql) were written to create the tables and populate them with sample data. The create_tables.sql script defined the structure of each table, specifying primary keys and foreign keys to enforce relationships. The insert_data.sql script inserted sample records into each table.

Now, the database is created using XAMPP and MySQL. The schema is created using Laravel, and is dynamically updated using REST APIs.



## Web Interface
In the first iteration, a series of PHP scripts as well as an HTML interface script were developed to provide functionalities for different users:
- Students: Students can log in using their campus-wide ID to view their enrolled courses and grades. They can also look up details about specific courses.
- Professors: Professors can log in using their SSN to view the sections they are teaching. They can also view the grades of students in each section.
- Administrators: Administrators can log in to access features similar to both students and professors, including looking up professors, students, courses, and grades.

The interface is now built using Vite/React with Typescript and Bootstrap to provide a more modern and user-friendly experience for the same users.

## How to Use
Password for admin login is "password". Note that this would normally be stored in a more secure manner in a production environment.
