<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use Illuminate\Http\Request;

class ProfessorController extends Controller
{
    /**
     * GET /api/professors
     * List all professors
     */
    public function index()
    {
        // You could also do Professor::with('sections')->get() to eager-load sections
        return Professor::all();
    }

    /**
     * POST /api/professors
     * Create a new professor
     */
    public function store(Request $request)
    {
        // Example validation; adjust rules as needed
        $validated = $request->validate([
            'social_security_number' => 'required|unique:professors,social_security_number|size:9',
            'name' => 'required|string|max:100',
            'street_address' => 'required|string|max:100',
            'city' => 'required|string|max:50',
            'state' => 'required|string|max:2',
            'zip_code' => 'required|string|max:5',
            'area_code' => 'required|string|max:3',
            'number' => 'required|string|max:7',
            'sex' => 'required|string|max:1',
            'title' => 'required|string|max:50',
            'salary' => 'required|numeric',
            'college_degrees' => 'nullable|string|max:255',
        ]);

        $professor = Professor::create($validated);

        return response()->json($professor, 201);
    }

    /**
     * GET /api/professors/{id}
     * Show a single professor
     */
    public function show($id)
    {
        $professor = Professor::findOrFail($id);
        return $professor;
    }

    /**
     * PUT or PATCH /api/professors/{id}
     * Update an existing professor
     */
    public function update(Request $request, $id)
    {
        $professor = Professor::findOrFail($id);

        $validated = $request->validate([
            'social_security_number' => 'sometimes|unique:professors,social_security_number,'.$professor->id.'|size:9',
            'name' => 'sometimes|string|max:100',
            'street_address' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:50',
            'state' => 'sometimes|string|max:2',
            'zip_code' => 'sometimes|string|max:5',
            'area_code' => 'sometimes|string|max:3',
            'number' => 'sometimes|string|max:7',
            'sex' => 'sometimes|string|max:1',
            'title' => 'sometimes|string|max:50',
            'salary' => 'sometimes|numeric',
            'college_degrees' => 'nullable|string|max:255',
        ]);

        $professor->update($validated);

        return $professor;
    }

    /**
     * DELETE /api/professors/{id}
     * Remove a professor
     */
    public function destroy($id)
    {
        $professor = Professor::findOrFail($id);
        $professor->delete();

        return response()->json(['message' => 'Professor deleted']);
    }

    /**
     * OPTIONAL CUSTOM METHOD
     * GET /api/professors/{id}/sections
     * Returns all sections taught by this professor (including the course info)
     */
    public function sections($id)
    {
        $professor = Professor::with('sections.course')->findOrFail($id);
        
        // Return just the sections
        return $professor->sections; 
    }
}
