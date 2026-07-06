<?php

namespace App\Http\Controllers;

use App\Models\Bitacora;
use Illuminate\Http\Request;

class BitacoraController extends Controller
{
    // GET /api/bitacora?entidad=Product&entidad_id=xxxx
    public function index(Request $request)
    {
        $query = Bitacora::query();

        if ($request->has('entidad')) {
            $query->where('entidad', $request->entidad);
        }

        if ($request->has('entidad_id')) {
            $query->where('entidad_id', $request->entidad_id);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }
}