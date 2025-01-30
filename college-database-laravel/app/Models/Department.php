<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';

    protected $fillable = [
        'name',
        'telephone',
        'office_location',
        'chairperson_id',
    ];

    /**
     * A department belongs to a professor who is the chairperson.
     */
    public function chairperson()
    {
        return $this->belongsTo(Professor::class, 'chairperson_id');
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id');
    }
    
    /**
     * A department can have many students who major in it.
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'major_department_id');
    }
}
