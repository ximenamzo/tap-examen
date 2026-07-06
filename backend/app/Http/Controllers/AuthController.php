<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('profiles.sections'),
            'token' => $token,
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesion cerrada correctamente']);
    }

    // POST /api/forgot-password
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No existe un usuario registrado con ese correo.'],
            ]);
        }

        // contraseña temporal nueva ENVIADA por correo
        $newPassword = str()->random(10);
        $user->update(['password' => Hash::make($newPassword)]);

        // INTEGRACION de envio real de correo (Mail::to($user->email)->send(...))
        // para pruebas en Postman, se regresamos en la respuesta:
        return response()->json([
            'message' => 'Se generaron nuevas credenciales y se enviaron al correo registrado.',
            'temp_password_debug' => $newPassword, 
            // ELIMINAR antes de produccion
        ]);
    }
}