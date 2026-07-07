import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss'
})
export class ProfileListComponent implements OnInit {
  profiles = signal<Profile[]>([]);
  loading = signal(true);

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.profileService.getAll().subscribe({
      next: (data) => {
        this.profiles.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onDelete(id: string): void {
    if (!confirm('¿Seguro que deseas eliminar este perfil?')) return;

    this.profileService.delete(id).subscribe(() => {
      this.profiles.update((list) => list.filter((p) => p.id !== id));
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}