<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';

    protected $fillable = [
        'course_number',
        'title',
        'textbook',
        'units',
        'department_id',
    ];

    /**
     * A course belongs to a department.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * A course has many sections.
     */
    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
