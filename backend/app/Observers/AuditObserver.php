<?php

namespace App\Observers;

use App\Models\Bitacora;
use Illuminate\Support\Facades\Auth;

class AuditObserver
{
    private array $camposSensibles = ['password', 'remember_token'];

    public function created($model)
    {
        $this->log($model, 'creacion', null, $this->limpiar($model->fresh()->toArray()));
    }

    public function updated($model)
    {
        $this->log($model, 'actualizacion', $this->limpiar($model->getOriginal()), $this->limpiar($model->fresh()->toArray()));
    }

    public function deleted($model)
    {
        $this->log($model, 'eliminacion', $this->limpiar($model->getOriginal()), null);
    }

    private function limpiar(?array $datos): ?array
    {
        if ($datos === null) {
            return null;
        }

        return collect($datos)->except($this->camposSensibles)->toArray();
    }

    private function log($model, string $accion, ?array $anterior, ?array $nuevo)
    {
        Bitacora::create([
            'entidad'        => class_basename($model),
            'entidad_id'     => (string) $model->getKey(),
            'accion'         => $accion,
            'valor_anterior' => $anterior,
            'valor_nuevo'    => $nuevo,
            'usuario_id'     => Auth::id(),
        ]);
    }
}