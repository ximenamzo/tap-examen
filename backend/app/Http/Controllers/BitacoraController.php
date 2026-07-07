<?php

namespace App\Http\Controllers;

use App\Models\Bitacora;
use App\Models\User;
use Illuminate\Http\Request;

class BitacoraController extends Controller
{
    public function index(Request $request)
    {
        $query = Bitacora::query();

        if ($request->has('entidad')) {
            $query->where('entidad', $request->entidad);
        }

        if ($request->has('entidad_id')) {
            $query->where('entidad_id', $request->entidad_id);
        }

        $records = $query->orderByDesc('created_at')->get();

        $userIds = $records->pluck('usuario_id')->filter()->unique();
        $usersById = User::whereIn('_id', $userIds)->get()->keyBy('_id');

        $records->transform(function ($record) use ($usersById) {
            $record->usuario_nombre = $record->usuario_id
                ? ($usersById[$record->usuario_id]->name ?? 'Usuario eliminado')
                : 'Sistema (autoservicio)';
            return $record;
        });

        return response()->json($records);
    }
}