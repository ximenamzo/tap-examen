import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Section } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SectionService {
  private baseUrl = `${environment.apiUrl}/sections`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Section[]> {
    return this.http.get<Section[]>(this.baseUrl);
  }
}