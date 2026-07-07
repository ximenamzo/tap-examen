<?php

namespace App\Exports;

use App\Models\Profile;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProfilesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Profile::all();
    }

    public function headings(): array
    {
        return ['Código', 'Nombre', 'Fecha de creación'];
    }

    public function map($profile): array
    {
        return [
            $profile->code,
            $profile->name,
            \Carbon\Carbon::parse($profile->created_at)->format('d/m/Y H:i'),
        ];
    }
}