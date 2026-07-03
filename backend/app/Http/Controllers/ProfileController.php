<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Section;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // GET /api/profiles
    public function index()
    {
        return response()->json(Profile::all());
    }

    // POST /api/profiles
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'section_ids'  => 'required|array|min:1',
            'section_ids.*' => 'string|exists:mongodb.sections,_id',
        ]);

        $profile = Profile::create([
            'code' => 'PRF-' . strtoupper(uniqid()),
            'name' => $validated['name'],
        ]);

        $profile->sections()->sync($validated['section_ids']);

        return response()->json($profile->load('sections'), 201);
    }

    // GET /api/profiles/{id}
    public function show(string $id)
    {
        $profile = Profile::with('sections')->findOrFail($id);
        return response()->json($profile);
    }

    // PUT /api/profiles/{id}
    public function update(Request $request, string $id)
    {
        $profile = Profile::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'section_ids'   => 'sometimes|array|min:1',
            'section_ids.*' => 'string|exists:mongodb.sections,_id',
        ]);

        $profile->update(collect($validated)->except('section_ids')->toArray());

        if (isset($validated['section_ids'])) {
            $profile->sections()->sync($validated['section_ids']);
        }

        return response()->json($profile->load('sections'));
    }

    // DELETE /api/profiles/{id}
    public function destroy(string $id)
    {
        Profile::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}