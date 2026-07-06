<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Bitacora extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'bitacora';

    protected $fillable = [
        'entidad',
        'entidad_id',
        'accion',
        'valor_anterior',
        'valor_nuevo',
        'usuario_id',
    ];

    protected $casts = [
        'valor_anterior' => 'array',
        'valor_nuevo'    => 'array',
    ];
}