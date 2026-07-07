import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onDelete(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.userService.delete(id).subscribe(() => {
      this.users.update((list) => list.filter((u) => u.id !== id));
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onExportPdf(): void {
    this.userService.exportPdf().subscribe((blob) => this.downloadFile(blob, 'usuarios.pdf'));
  }

  onExportExcel(): void {
    this.userService.exportExcel().subscribe((blob) => this.downloadFile(blob, 'usuarios.xlsx'));
  }
}