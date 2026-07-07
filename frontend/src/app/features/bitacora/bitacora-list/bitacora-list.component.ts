import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitacoraService } from '../../../core/services/bitacora.service';
import { Bitacora } from '../../../core/models/bitacora.model';

@Component({
  selector: 'app-bitacora-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bitacora-list.component.html',
  styleUrl: './bitacora-list.component.scss'
})
export class BitacoraListComponent implements OnInit {
  records = signal<Bitacora[]>([]);
  loading = signal(true);
  expandedId = signal<string | null>(null);

  constructor(private bitacoraService: BitacoraService) {}

  ngOnInit(): void {
    this.bitacoraService.getAll().subscribe({
      next: (data) => {
        this.records.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  accionLabel(accion: string): string {
    const labels: Record<string, string> = {
      creacion: 'Creación',
      actualizacion: 'Actualización',
      eliminacion: 'Eliminación'
    };
    return labels[accion] ?? accion;
  }

  getDiff(record: Bitacora): { field: string; before: any; after: any }[] {
    const before = record.valor_anterior ?? {};
    const after = record.valor_nuevo ?? {};
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const ignoredKeys = ['updated_at', 'created_at', 'id'];

    const diffs: { field: string; before: any; after: any }[] = [];

    allKeys.forEach((key) => {
      if (ignoredKeys.includes(key)) return;

      const beforeVal = JSON.stringify(before[key]);
      const afterVal = JSON.stringify(after[key]);

      if (beforeVal !== afterVal) {
        diffs.push({ field: key, before: before[key], after: after[key] });
      }
    });

    return diffs;
  }
}