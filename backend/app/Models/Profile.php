<?php

namespace App\Models;

# use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model;

class Profile extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'profiles';

    protected $fillable = [
        'code',
        'name',
    ];

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'profile_section');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_profile');
    }
}