import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)
  isLoading: boolean = false


  resetPassword: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],

  })

  resetPasswordSubmit(): void {
    this._AuthService.handleResetPassword(this.resetPassword.value).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userToken', res.token)
        this._AuthService.saveUserDate()
        this._Router.navigate(['/home'])
      },
      error: (err) => {
        console.log(err);
      }
    })

  }
}
