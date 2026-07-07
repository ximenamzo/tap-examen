import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bitacora } from '../models/bitacora.model';

@Injectable({ providedIn: 'root' })
export class BitacoraService {
  private baseUrl = `${environment.apiUrl}/bitacora`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bitacora[]> {
    return this.http.get<Bitacora[]>(this.baseUrl);
  }
}