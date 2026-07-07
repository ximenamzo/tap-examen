import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/user.model';

interface CountryCode {
  code: string;
  label: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  isEditMode = signal(false);
  isViewMode = signal(false);
  userId: string | null = null;

  name = '';
  email = '';
  countryCode = '+52';
  phoneDigits = '';
  profilePhoto = '';
  selectedProfileId: string | null = null;

  availableProfiles = signal<Profile[]>([]);
  errorMessage = signal<string | null>(null);
  profileError = signal<string | null>(null);

  countryCodes: CountryCode[] = [
    { code: '+52', label: 'MX +52' },
    { code: '+1', label: 'US/CA +1' },
    { code: '+34', label: 'ES +34' },
    { code: '+57', label: 'CO +57' },
    { code: '+54', label: 'AR +54' },
    { code: '+502', label: 'GT +502' },
  ];

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isViewMode.set(this.route.snapshot.queryParamMap.get('view') === 'true');

    this.profileService.getAll().subscribe((profiles) => this.availableProfiles.set(profiles));

    if (this.userId) {
      this.isEditMode.set(true);
      this.userService.getOne(this.userId).subscribe((user) => {
        this.name = user.name;
        this.email = user.email;
        this.profilePhoto = user.profile_photo;
        this.selectedProfileId = user.profiles?.[0]?.id ?? null;

        if (user.phone) {
          const match = this.countryCodes.find((c) => user.phone!.startsWith(c.code));
          if (match) {
            this.countryCode = match.code;
            this.phoneDigits = user.phone!.slice(match.code.length);
          } else {
            this.phoneDigits = user.phone!;
          }
        }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.profileError.set(null);

    if (!this.selectedProfileId) {
      this.profileError.set('Debes seleccionar un perfil para el usuario.');
      return;
    }

    const payload: any = {
      name: this.name,
      phone: this.phoneDigits ? `${this.countryCode}${this.phoneDigits}` : null,
      profile_photo: this.profilePhoto,
      profile_ids: [this.selectedProfileId],
    };

    // El email solo se manda al crear (es unico y no debe editarse despues)
    if (!this.isEditMode()) {
      payload.email = this.email;
    }

    const request$ = this.isEditMode()
      ? this.userService.update(this.userId!, payload)
      : this.userService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: () => this.errorMessage.set('Ocurrió un error al guardar el usuario.')
    });
  }
}
