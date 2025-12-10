import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CoordinatePlateService } from '../../services/CoordinatePlateService';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HitService } from '../../services/HitService';
import { HitFormData } from '../../models/hitFormData';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import Big from 'big.js';

@Component({
  selector: 'app-hit-form',
  imports: [ButtonModule, ReactiveFormsModule, MessageModule, CommonModule],
  templateUrl: './hit-form.html',
  styleUrl: './hit-form.scss',
})
export class HitForm {
  private coordinatePlateService = inject(CoordinatePlateService);
  private hitService = inject(HitService);

  validNumbers = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
  serverErrorMessage: string | null = null;
  loading = false;


  hitForm = new FormGroup({
    x: new FormControl(0, [Validators.required, this.listValidator.bind(this)]),
    y: new FormControl('0', [Validators.required, this.yValidator]),
    r: new FormControl(1, [Validators.required, this.listValidator.bind(this)])
  });

  listValidator(control: AbstractControl) {
    return this.validNumbers.includes(Number(control.value)) ? null : { list: true };
  }

  yValidator(control: AbstractControl) {
    const value = (control.value ?? '').toString().replace(',', '.');
    if (value.length === 0) return null;
    if (!/^-?\d*\.?\d*$/.test(value)) return { pattern: true };
    try {
      const num = new Big(value);
      if (num.lt(-3) || num.gt(3)) return { range: true };
    } catch {
      return { pattern: true };
    }
    return null;
  }

  onBlur(field: 'y') {
    if (field === 'y') {
      const control = this.hitForm.get('y');
      if (control) control.setValue((control.value ?? '').toString().replace(',', '.'), { emitEvent: false });
    }
  }

  ngOnInit() {
    this.hitForm.valueChanges.subscribe(() => {
      if (this.hitForm.valid) {
        this.coordinatePlateService.setValue({
          x: Number(this.hitForm.get('x')?.value),
          y: Number(this.hitForm.get('y')?.value),
          r: Number(this.hitForm.get('r')?.value)
        });
      }
    });
  }

  send() {
    if (this.hitForm.valid) {
      const data: HitFormData = {
        x: Number(this.hitForm.get('x')?.value),
        y: Number(this.hitForm.get('y')?.value),
        r: Number(this.hitForm.get('r')?.value)
      };

      this.loading = true;
      this.hitService.hit(data).subscribe({
        next: (response) => {
          this.serverErrorMessage = null;
          this.loading = false;
        },
        error: (err) => {
          if (err.status === 400) {
            this.serverErrorMessage = err.error || 'Invalid input: please check x, y, r values.';
          } else if (err.status === 0) {
            this.serverErrorMessage = 'Server is unreachable. Please try again later.';
          } else {
            this.serverErrorMessage = 'Something went wrong: ' + err.message;
          }
          this.loading = false;
          setTimeout(() => {
            this.serverErrorMessage = null;
          }, 4000);
        }
      });
    }

  }
}
