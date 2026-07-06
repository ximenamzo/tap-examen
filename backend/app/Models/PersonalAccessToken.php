<?php

namespace App\Models;

# use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use MongoDB\Laravel\Eloquent\DocumentModel;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    # este trait traduce una clase pensaba para SQL a el comportamiento
    # de documento Mongo sin reescribir toda la clase de 0
    use DocumentModel;

    protected $connection = 'mongodb';
    protected $table = 'personal_access_tokens';
    protected $primaryKey = '_id';
    protected $keyType = 'string';

}
