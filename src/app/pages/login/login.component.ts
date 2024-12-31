import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router)

  isLoading: boolean = false
  msgError: string = '';
  loginSub!: Subscription;

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  })

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.loginSub = this._AuthService.handleLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === "success") {
            this.msgError = ''
            localStorage.setItem('userToken', res.token)
            this._AuthService.saveUserDate()
            this._Router.navigate(['/home'])
          }
          this.isLoading = false

        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message
          this.isLoading = false
          console.log(err);

        }
      })
    }
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe()
  }
}
