import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentsService } from '../../core/services/payments.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _PaymentsService = inject(PaymentsService);
  private readonly _Router = inject(Router);

  isLoading: boolean = false
  cartId: string | null = '';

  onlineOrderSub!: Subscription;

  order: FormGroup = this._FormBuilder.group({
    details: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, [Validators.required]],
  })

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get('id')
      }
    });
  }

  ngOnDestroy(): void {
    this.onlineOrderSub?.unsubscribe()
  }

  orderSubmit() {
    this._ActivatedRoute.queryParams.subscribe({
      next: (queryParams) => {
        const paymentType = queryParams['paymentType'];

        // Call the respective order method based on the payment type
        if (paymentType === 'onlineOrder') {
          this.processOnlineOrder();
        } else if (paymentType === 'cashOrder') {
          this.processCashOrder();
        }
      }
    });
  }


  processOnlineOrder() {
    this._PaymentsService.onlineOrder(this.cartId, this.order.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          window.open(res.session.url); // Redirect to payment page
        }
      }
    });
  }

  processCashOrder() {
    this._PaymentsService.cashOrder(this.cartId, this.order.value).subscribe({
      next: (res) => {
        console.log(res);
        this._Router.navigate(['/allorders']); // Redirect to order summary
      }
    });
  }

}
