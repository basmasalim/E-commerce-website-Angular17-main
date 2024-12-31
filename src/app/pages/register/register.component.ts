import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  isLoading: boolean = false;
  msgSuccess: boolean = false;
  msgError: string = '';
  registerSub!: Subscription;

  registerForm: FormGroup = this._FormBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
    rePassword: [null],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, { validators: [this.confirmPassword] })

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true
      this.registerSub = this._AuthService.handleRegisterForm(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === "success") {
            this.msgError = ''
            this.msgSuccess = true
            setTimeout(() => {
              this._Router.navigate(['/login'])
            }, 1000);
          }
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message
          this.isLoading = false
          console.log(err);
        }
      })
    }

  }

  confirmPassword(group: AbstractControl) {
    if (group.get('password')?.value === group.get('rePassword')?.value) {
      return null //No error
    }
    return { misMatch: true }
  }

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe()
  }
}
