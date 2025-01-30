<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $table = 'sections';

    protected $fillable = [
        'section_number',
        'classroom',
        'number_of_seats',
        'meeting_days',
        'beginning_time',
        'ending_time',
        'course_id',
        'professor_id',
    ];

    /**
     * A section belongs to a course.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * A section is taught by a professor.
     */
    public function professor()
    {
        return $this->belongsTo(Professor::class);
    }

    /**
     * A section can have many enrollment records.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * A section has many students through enrollments.
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->withPivot('grade')
                    ->withTimestamps();
    }
}
