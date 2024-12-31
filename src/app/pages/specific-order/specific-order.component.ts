import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentsService } from '../../core/services/payments.service';
import { Allorders } from '../../core/interfaces/allorders';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-specific-order',
  standalone: true,
  imports: [RouterLink, DatePipe, NgFor, NgIf],
  templateUrl: './specific-order.component.html',
  styleUrl: './specific-order.component.scss'
})
export class SpecificOrderComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _PaymentsService = inject(PaymentsService)

  currentDate: Date = new Date();

  displaySpecificOrderSub!: Subscription;

  allordersUser: Allorders = {} as Allorders;

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        let idOrder = p.get('id')
        this.displaySpecificOrder(idOrder);
      },
    });
  }

  ngOnDestroy(): void {
    this.displaySpecificOrderSub?.unsubscribe()
  }

  displaySpecificOrder(id: string | null) {
    this._PaymentsService.getSpecificOrder(id).subscribe({
      next: (reponse) => {
        this.allordersUser = reponse.data;
        console.log(reponse.data);

      },
    });
  }
}
