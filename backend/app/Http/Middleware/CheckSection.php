<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSection
{
    public function handle(Request $request, Closure $next, string $sectionKey): Response
    {
        $user = $request->user();

        $hasAccess = $user->profiles()
            ->with('sections')
            ->get()
            ->contains(fn ($profile) => $profile->sections->contains('key', $sectionKey));

        if (! $hasAccess) {
            abort(403, 'No tienes acceso a esta sección.');
        }

        return $next($request);
    }
}
