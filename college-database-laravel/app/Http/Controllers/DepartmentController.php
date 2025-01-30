<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return Department::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'chairperson_id' => 'required|exists:professors,id',
            'telephone' => 'required|string|max:15',
            'office_location' => 'required|string|max:100',
        ]);

        $department = Department::create($validated);

        return response()->json($department, 201);
    }

    public function show($id)
    {
        $department = Department::with('chairperson', 'courses', 'students')->findOrFail($id);
        return $department;
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'chairperson_id' => 'sometimes|exists:professors,id',
            'telephone' => 'sometimes|string|max:15',
            'office_location' => 'sometimes|string|max:100',
        ]);

        $department->update($validated);

        return $department;
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(['message' => 'Department deleted']);
    }
}
