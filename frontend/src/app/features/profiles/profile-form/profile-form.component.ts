import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { SectionService } from '../../../core/services/section.service';
import { Section } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent implements OnInit {
  isEditMode = signal(false);
  isViewMode = signal(false);
  profileId: string | null = null;

  name = '';
  selectedSectionIds: string[] = [];

  availableSections = signal<Section[]>([]);
  errorMessage = signal<string | null>(null);
  sectionError = signal<string | null>(null);

  constructor(
    private profileService: ProfileService,
    private sectionService: SectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileId = this.route.snapshot.paramMap.get('id');
    this.isViewMode.set(this.route.snapshot.queryParamMap.get('view') === 'true');

    this.sectionService.getAll().subscribe((sections) => this.availableSections.set(sections));

    if (this.profileId) {
      this.isEditMode.set(true);
      this.profileService.getOne(this.profileId).subscribe((profile) => {
        this.name = profile.name;
        this.selectedSectionIds = profile.sections?.map((s) => s.id) ?? [];
      });
    }
  }

  toggleSection(sectionId: string, checked: boolean): void {
    if (checked) {
      this.selectedSectionIds = [...this.selectedSectionIds, sectionId];
    } else {
      this.selectedSectionIds = this.selectedSectionIds.filter((id) => id !== sectionId);
    }
  }

  isSectionSelected(sectionId: string): boolean {
    return this.selectedSectionIds.includes(sectionId);
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.sectionError.set(null);

    if (this.selectedSectionIds.length === 0) {
      this.sectionError.set('Debes seleccionar al menos una sección.');
      return;
    }

    const payload = { name: this.name, section_ids: this.selectedSectionIds };

    const request$ = this.isEditMode()
      ? this.profileService.update(this.profileId!, payload)
      : this.profileService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/perfiles']),
      error: () => this.errorMessage.set('Ocurrió un error al guardar el perfil.')
    });
  }
}