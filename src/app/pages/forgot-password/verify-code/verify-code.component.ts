import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)
  isLoading: boolean = false

  verifyCode: FormGroup = this._FormBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  })
  verifyCodeSubmit(): void {
    this._AuthService.handleVerifyCode(this.verifyCode.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === "Success") {
          this._Router.navigate(['/resetPassword'])
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

  }
}
