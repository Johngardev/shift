import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveShiftResponse, ApiResponse, Shift } from '../models/shift';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private apiUrl = 'http://localhost:3000/api/shifts';

  constructor(private http: HttpClient) { }

  startShift(workerCode: string): Observable<ApiResponse<Shift>> {
    return this.http.post<ApiResponse<Shift>>(`${this.apiUrl}/start`, { workerCode });
  }

  endShift(workerCode: string): Observable<ApiResponse<Shift>> {
    return this.http.post<ApiResponse<Shift>>(`${this.apiUrl}/end`, { workerCode });
  }

  getActiveShift(workerCode: string): Observable<ActiveShiftResponse> {
    return this.http.get<ActiveShiftResponse>(`${this.apiUrl}/active/${workerCode}`);
  }

  getAllShifts(): Observable<ApiResponse<Shift[]>> {
    return this.http.get<ApiResponse<Shift[]>>(this.apiUrl);
  }
}
