<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'campus_wide_id',
        'first_name',
        'last_name',
        'street_address',
        'city',
        'state',
        'zip_code',
        'area_code',
        'number',
        'major_department_id',
    ];

    /**
     * A student belongs to a department (major).
     */
    public function majorDepartment()
    {
        return $this->belongsTo(Department::class, 'major_department_id');
    }

    /**
     * A student can have many enrollment records.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * A student can belong to many sections through enrollments.
     */
    public function sections()
    {
        return $this->belongsToMany(Section::class, 'enrollments')
                    ->withPivot('grade')
                    ->withTimestamps();
    }
}
