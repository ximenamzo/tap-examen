<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Product::all();
    }

    public function headings(): array
    {
        return ['Código', 'Nombre', 'Marca', 'Precio', 'Fecha de creación'];
    }

    public function map($product): array
    {
        return [
            $product->code,
            $product->name,
            $product->brand,
            $product->price,
            \Carbon\Carbon::parse($product->created_at)->format('d/m/Y H:i'),
        ];
    }
}