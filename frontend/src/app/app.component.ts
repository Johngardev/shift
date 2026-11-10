import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { ShiftService } from './services/shift.service';

interface Shift {
  workerCode: string;
  startTime: string | Date;
  totalTimeFormatted?: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Shift Management System - PRUEBA TECNICA';
  shiftForm: FormGroup;
  activeShift: Shift | null = null;
  timerDisplay: string = '00:00:00';
  private timerSub?: Subscription;
  isLoading = false;

  // Propiedades para la tabla de turnos
  shiftsHistory: Shift[] = [];
  displayedColumns: string[] = ['workerCode', 'startTime', 'endTime', 'totalTimeFormatted', 'status'];

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private snackBar: MatSnackBar
  ) {
    this.shiftForm = this.fb.group({
      workerCode: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadShiftsHistory();
  }

  // Cargar historial de turnos
  loadShiftsHistory(): void {
    this.shiftService.getAllShifts().subscribe({
      next: (response) => {
        this.shiftsHistory = response.data;
      },
      error: () => {
        this.showToast('No se pudo cargar el historial de turnos', 'error');
      }
    });
  }

  // 1. INICIAR JORNADA
  onStartShift(): void {
    if (this.shiftForm.invalid) return;
    const workerCode = this.shiftForm.get('workerCode')?.value.trim();
    this.isLoading = true;

    this.shiftService.startShift(workerCode).subscribe({
      next: (response) => {
        this.activeShift = response.data;
        this.startClientTimer(new Date(this.activeShift.startTime).getTime());
        this.isLoading = false;
        this.showToast('¡Jornada iniciada con éxito!', 'success');
        this.loadShiftsHistory(); // Recargar tabla
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Error al iniciar la jornada';
        this.showToast(errorMessage, 'error');
      }
    });
  }

  // 2. TERMINAR JORNADA
  onEndShift(): void {
    if (!this.activeShift) return;
    const workerCode = this.activeShift.workerCode;
    this.isLoading = true;

    this.shiftService.endShift(workerCode).subscribe({
      next: (response) => {
        this.stopClientTimer();
        this.showToast(`Jornada finalizada. Tiempo: ${response.data.totalTimeFormatted}`, 'success');
        this.activeShift = null;
        this.isLoading = false;
        this.shiftForm.reset();
        this.loadShiftsHistory(); // Recargar tabla
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Error al finalizar la jornada';
        this.showToast(errorMessage, 'error');
      }
    });
  }

  private startClientTimer(startTimeMs: number): void {
    this.timerSub = interval(1000).subscribe(() => {
      const now = Date.now();
      const diffMs = now - startTimeMs;
      this.timerDisplay = this.formatMilliseconds(diffMs);
    });
  }

  private stopClientTimer(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
    this.timerDisplay = '00:00:00';
  }

  private formatMilliseconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  ngOnDestroy(): void {
    this.stopClientTimer();
  }
}
