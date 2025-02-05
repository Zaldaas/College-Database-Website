export interface Professor {
    id: number;
    social_security_number: string;
    name: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    area_code: string;
    number: string;
    sex: string;
    title: string;
    salary: number;
    college_degrees?: string;
}

export interface Department {
    id: number;
    name: string;
    telephone: string;
    office_location: string;
    chairperson_id: number;
}

export interface Course {
    id: number;
    course_number: number;
    title: string;
    textbook?: string;
    units: number;
    department_id: number;
}

export interface Section {
    id: number;
    section_number: number;
    classroom?: string;
    number_of_seats?: number;
    meeting_days?: string;
    beginning_time?: string;
    ending_time?: string;
    course_id: number;
    professor_id?: number;
}

export interface Student {
    id: number;
    campus_wide_id: string;
    first_name: string;
    last_name: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    area_code?: string;
    number?: string;
    major_department_id?: number;
}

export interface Enrollment {
    id: number;
    student_id: number;
    section_id: number;
    grade?: string;
}
  