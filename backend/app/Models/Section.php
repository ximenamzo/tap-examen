<?php

namespace App\Models;

# use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model;

class Section extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'sections';

    protected $fillable = [
        'name', // para el front
        'key', // identificador 
    ];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_section');
    }
}