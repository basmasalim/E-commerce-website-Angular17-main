import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  isLoading: boolean = false

  verifyEmail: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  })

  verifyEmailSubmit(): void {
    this._AuthService.handleVerifyEmail(this.verifyEmail.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.statusMsg === "success") {
          this._Router.navigate(['/verifyCode'])
        }
      },
      error: (err) => {
        console.log(err);

      }
    })

  }
}
