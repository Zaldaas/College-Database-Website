<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\EnrollmentController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('professors', ProfessorController::class);
Route::get('professors/{id}/sections', [ProfessorController::class, 'sections']);

Route::apiResource('departments', DepartmentController::class);

Route::apiResource('courses', CourseController::class);
Route::get('courses/{id}/sections', [CourseController::class, 'sections']);

Route::apiResource('sections', SectionController::class);
Route::get('sections/{id}/enrollments', [SectionController::class, 'enrollments']);

Route::apiResource('students', StudentController::class);
Route::get('students/{id}/enrollments', [StudentController::class, 'enrollments']);

Route::apiResource('enrollments', EnrollmentController::class);
