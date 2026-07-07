<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return User::all();
    }

    public function headings(): array
    {
        return ['Código', 'Usuario', 'Nombre', 'Fecha de creación'];
    }

    public function map($user): array
    {
        return [
            $user->code,
            $user->email,
            $user->name,
            \Carbon\Carbon::parse($user->created_at)->format('d/m/Y H:i'),
        ];
    }
}