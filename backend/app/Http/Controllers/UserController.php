<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        return response()->json(User::all());
    }

    // POST /api/users
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:mongodb.users,email',
            'profile_photo'  => 'required|url',
            'phone'          => 'nullable|regex:/^\+\d{1,4}\d{10}$/',
            'profile_ids'    => 'required|array|size:1',
            'profile_ids.*'  => 'string|exists:mongodb.profiles,_id',
        ]);

        $user = User::create([
            'code'          => 'USR-' . strtoupper(uniqid()),
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'phone'         => $validated['phone'] ?? null,
            'profile_photo' => $validated['profile_photo'],
            // Contraseña temporal aleatoria, el usuario la define al recuperar contraseña
            'password'      => Hash::make(str()->random(16)),
        ]);

        if (isset($validated['profile_ids'])) {
            $user->profiles()->sync($validated['profile_ids']);
        }

        return response()->json($user->load('profiles'), 201);
    }

    // GET /api/users/{id}  
    // (regresa: usuario, nombre, tel, foto, perfiles)
    public function show(string $id)
    {
        $user = User::with('profiles')->findOrFail($id);
        return response()->json($user);
    }

    // PUT /api/users/{id}
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'phone'          => 'nullable|regex:/^\+\d{1,4}\d{10}$/',
            'profile_photo'  => 'required|url',
            'profile_ids'    => 'required|array|size:1',
            'profile_ids.*'  => 'string|exists:mongodb.profiles,_id',
        ]);

        $user->update(collect($validated)->except('profile_ids')->toArray());

        if (isset($validated['profile_ids'])) {
            $user->profiles()->sync($validated['profile_ids']);
        }

        return response()->json($user->load('profiles'));
    }

    // DELETE /api/users/{id}
    public function destroy(string $id)
    {
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}