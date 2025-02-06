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

## Setup Instructions

### Prerequisites
- XAMPP with MySQL and PHP: Ensure XAMPP is installed and the MySQL services are running.
- Composer: Required for managing PHP dependencies.
- Node.js and npm: Needed to run the Vite/React development server.


### Backend Setup (Laravel)
1. Open your terminal and navigate to the college-database-laravel.
2. Run the following command to install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the `.env.example` file to `.env`:
   - On Windows:
     ```bash
     copy .env.example .env
     ```
4. Generate an application key by running:
   ```bash
   php artisan key:generate
   ```
5. Ensure your database connection in the `.env` file by updating `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` as per your MySQL configuration.
6. Run database migrations to set up the schema with:
   ```bash
   php artisan migrate
   ```
7. Start the Laravel development server with:
   ```bash
   php artisan serve
   ```
   (default URL: http://127.0.0.1:8000)

### Frontend Setup (Vite/React)
1. Navigate to the project root college-database-react.
2. Run the following command to install JavaScript dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server with:
   ```bash
   npm run dev
   ```
   (default URL: http://localhost:3000 or http://localhost:5173)

### Accessing the Application
- Open your web browser and go to the Vite/React server URL.
- Use the admin password "password" for administrator access.