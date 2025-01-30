<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return Course::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_number' => 'required|unique:courses,course_number',
            'title' => 'required|string|max:100',
            'department_id' => 'required|exists:departments,id',
            'units' => 'required|integer',
            'textbook' => 'nullable|string|max:255',
        ]);

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

    public function show($id)
    {
        // Eager-load department or sections
        $course = Course::with('department', 'sections')->findOrFail($id);
        return $course;
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'course_number' => 'sometimes|unique:courses,course_number,'.$course->id,
            'title' => 'sometimes|string|max:100',
            'department_id' => 'sometimes|exists:departments,id',
            'units' => 'sometimes|integer',
            'textbook' => 'nullable|string|max:255',
        ]);

        $course->update($validated);

        return $course;
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }

    /**
     * OPTIONAL CUSTOM METHOD
     * GET /api/courses/{id}/sections
     * Returns all sections for this course (including professor info)
     */
    public function sections($id)
    {
        $course = Course::with('sections.professor')->findOrFail($id);
        return $course->sections;
    }
}
