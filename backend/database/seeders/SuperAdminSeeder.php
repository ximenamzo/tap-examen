<?php

namespace Database\Seeders;

use App\Models\Section;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Crea las 3 secciones SI no existen
        $sectionsData = [
            ['name' => 'Productos', 'key' => 'products'],
            ['name' => 'Usuarios', 'key' => 'users'],
            ['name' => 'Perfiles', 'key' => 'profiles'],
        ];

        $sectionIds = [];
        foreach ($sectionsData as $data) {
            $section = Section::firstOrCreate(['key' => $data['key']], $data);
            $sectionIds[] = $section->_id;
        }

        // Crea el perfil de Super Admin SI no existe
        $profile = Profile::firstOrCreate(
            ['name' => 'Super Admin'],
            ['code' => 'PRF-SUPERADMIN']
        );
        $profile->sections()->sync($sectionIds);

        // Crea el usuario Super Admin SI no existe
        $user = User::firstOrCreate(
            ['email' => 'admin@email.com'],
            [
                'code'          => 'USR-SUPERADMIN',
                'name'          => 'Super Admin',
                'password'      => Hash::make('Admin123!'),
                'profile_photo' => 'https://i.pravatar.cc/150?u=admin',
            ]
        );
        $user->profiles()->sync([$profile->_id]);

        $this->command->info('Super Admin listo: admin@tapterminal.com / Admin123!');
    }
}