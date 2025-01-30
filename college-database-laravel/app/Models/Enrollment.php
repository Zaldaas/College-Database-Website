<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';

    protected $fillable = [
        'student_id',
        'section_id',
        'grade',
    ];

    /**
     * An enrollment belongs to a student.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * An enrollment belongs to a section.
     */
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
