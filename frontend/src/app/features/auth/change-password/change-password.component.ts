import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.authService.changePassword(this.currentPassword, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.successMessage.set('Contraseña actualizada correctamente.');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Ocurrió un error al cambiar la contraseña.');
      }
    });
  }
}