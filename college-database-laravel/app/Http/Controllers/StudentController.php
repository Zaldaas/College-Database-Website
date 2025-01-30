<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('majorDepartment')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'campus_wide_id' => 'required|unique:students,campus_wide_id|size:9',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'major_department_id' => 'nullable|exists:departments,id',
            'street_address' => 'required|string|max:100',
            'city' => 'required|string|max:50',
            'state' => 'required|string|max:2',
            'zip_code' => 'required|string|max:5',
            'area_code' => 'nullable|string|max:3',
            'number' => 'nullable|string|max:7',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show($id)
    {
        $student = Student::with('majorDepartment', 'enrollments.section.course')
                          ->findOrFail($id);
        return $student;
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'campus_wide_id' => 'sometimes|unique:students,campus_wide_id,'.$student->id.'|size:9',
            'first_name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'major_department_id' => 'nullable|exists:departments,id',
            'street_address' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:50',
            'state' => 'sometimes|string|max:2',
            'zip_code' => 'sometimes|string|max:5',
            'area_code' => 'nullable|string|max:3',
            'number' => 'nullable|string|max:7',
        ]);

        $student->update($validated);

        return $student;
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted']);
    }

    /**
     * OPTIONAL CUSTOM METHOD
     * GET /api/students/{id}/enrollments
     * Return the student's enrollments (including course info)
     */
    public function enrollments($id)
    {
        $student = Student::with('enrollments.section.course')->findOrFail($id);
        return $student->enrollments;
    }
}
