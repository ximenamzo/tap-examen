import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.baseUrl);
  }

  getOne(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/${id}`);
  }

  create(data: { name: string; section_ids: string[] }): Observable<Profile> {
    return this.http.post<Profile>(this.baseUrl, data);
  }

  update(id: string, data: Partial<{ name: string; section_ids: string[] }>): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}