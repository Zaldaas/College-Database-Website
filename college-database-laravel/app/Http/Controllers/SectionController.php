<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index()
    {
        // Possibly eager-load the course and professor
        return Section::with(['course', 'professor'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_number' => 'required|integer',
            'course_id' => 'required|exists:courses,id',
            'professor_id' => 'nullable|exists:professors,id',
            'classroom' => 'nullable|string|max:50',
            'number_of_seats' => 'nullable|integer',
            'meeting_days' => 'nullable|string|max:20',
            'beginning_time' => 'nullable|date_format:H:i:s',
            'ending_time' => 'nullable|date_format:H:i:s',
        ]);

        $section = Section::create($validated);

        return response()->json($section, 201);
    }

    public function show($id)
    {
        // Eager-load relationships
        $section = Section::with(['course', 'professor', 'enrollments.student'])->findOrFail($id);
        return $section;
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $validated = $request->validate([
            'section_number' => 'sometimes|integer',
            'course_id' => 'sometimes|exists:courses,id',
            'professor_id' => 'nullable|exists:professors,id',
            'classroom' => 'nullable|string|max:50',
            'number_of_seats' => 'nullable|integer',
            'meeting_days' => 'nullable|string|max:20',
            'beginning_time' => 'nullable|date_format:H:i:s',
            'ending_time' => 'nullable|date_format:H:i:s',
        ]);

        $section->update($validated);

        return $section;
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);
        $section->delete();

        return response()->json(['message' => 'Section deleted']);
    }

    /**
     * OPTIONAL CUSTOM METHOD
     * GET /api/sections/{id}/enrollments
     * Show students enrolled in this section
     */
    public function enrollments($id)
    {
        $section = Section::with('enrollments.student')->findOrFail($id);
        return $section->enrollments;
    }
}
