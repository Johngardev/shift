import { Component, OnDestroy } from '@angular/core';
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
    MatDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  title = 'Shift Management System - PRUEBA TECNICA';
  shiftForm: FormGroup;
  activeShift: Shift | null = null;
  timerDisplay: string = '00:00:00';
  private timerSub?: Subscription;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private snackBar: MatSnackBar
  ) {
    this.shiftForm = this.fb.group({
      workerCode: ['', [Validators.required, Validators.minLength(3)]]
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
      },
      error: (err) => {
        this.isLoading = false;
        // Captura el Error 1 (HTTP 400 - Ya tiene jornada activa)
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
        this.showToast(`Jornada finalizada. Tiempo total: ${response.data.totalTimeFormatted}`, 'success');
        this.activeShift = null;
        this.isLoading = false;
        this.shiftForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        // Captura el Error 2 (HTTP 404 - No hay jornada activa)
        const errorMessage = err.error?.message || 'Error al finalizar la jornada';
        this.showToast(errorMessage, 'error');
      }
    });
  }

  // Cronómetro en tiempo real usando RxJS interval
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
