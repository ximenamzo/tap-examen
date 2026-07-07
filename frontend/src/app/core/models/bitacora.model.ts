export interface Bitacora {
  id: string;
  entidad: string;
  entidad_id: string;
  accion: string;
  valor_anterior: any;
  valor_nuevo: any;
  usuario_id: string | null;
  usuario_nombre: string;
  created_at: string;
}