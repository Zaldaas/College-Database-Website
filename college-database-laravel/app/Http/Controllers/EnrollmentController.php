<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index()
    {
        // Eager-load the student and section relationships
        return Enrollment::with(['student', 'section.course'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'section_id' => 'required|exists:sections,id',
            'grade' => 'nullable|string|max:2'
        ]);

        // If you need to ensure uniqueness (student cannot enroll in same section twice),
        // also check if Enrollment::where(...) exists

        $enrollment = Enrollment::create($validated);

        return response()->json($enrollment, 201);
    }

    public function show($id)
    {
        $enrollment = Enrollment::with(['student', 'section.course'])->findOrFail($id);
        return $enrollment;
    }

    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);

        $validated = $request->validate([
            'grade' => 'nullable|string|max:2',
            'student_id' => 'sometimes|exists:students,id',
            'section_id' => 'sometimes|exists:sections,id',
        ]);

        $enrollment->update($validated);

        return $enrollment;
    }

    public function destroy($id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->delete();

        return response()->json(['message' => 'Enrollment deleted']);
    }
}
