<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professor extends Model
{
    use HasFactory;

    protected $table = 'professors';

    protected $fillable = [
        'social_security_number',
        'name',
        'street_address',
        'city',
        'state',
        'zip_code',
        'area_code',
        'number',
        'sex',
        'title',
        'salary',
        'college_degrees',
    ];


    /**
     * A professor can teach many sections.
     */
    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
