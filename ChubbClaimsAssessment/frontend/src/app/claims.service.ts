import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Claim, CreateClaimRequest } from './claim.model';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ClaimsService {
  private readonly base = '/api';
  constructor(private http: HttpClient) {}
  list(): Observable<Claim[]> { return this.http.get<Claim[]>(`${this.base}/claims`); }
  get(id: string): Observable<Claim> { return this.http.get<Claim>(`${this.base}/claims/${id}`); }
  create(data: CreateClaimRequest): Observable<Claim> { return this.http.post<Claim>(`${this.base}/claims`, data); }
  updateStatus(id: string, status: string, note?: string, officer?: string): Observable<Claim> {
    return this.http.patch<Claim>(`${this.base}/claims/${id}/status`, { status, note, officer });
  }
}
