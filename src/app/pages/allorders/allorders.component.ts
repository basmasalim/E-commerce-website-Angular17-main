import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PaymentsService } from '../../core/services/payments.service';
import { Allorders } from '../../core/interfaces/allorders';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss']
})
export class AllordersComponent implements OnInit, OnDestroy {
  private readonly _PaymentsService = inject(PaymentsService);

  currentDate: Date = new Date();

  userId: any;
  allUserOrders: Allorders[] = [];

  displayUserOrdersSub!: Subscription

  ngOnInit(): void {
    const userData = this._PaymentsService.decodeUserData()
    this.userId = userData.id;
    this.displayUserOrders();
  }
  ngOnDestroy(): void {
    this.displayUserOrdersSub?.unsubscribe()
  }

  displayUserOrders() {
    this._PaymentsService.getUserOrders(this.userId).subscribe({
      next: (response) => {
        this.allUserOrders = response
      }
    });
  }
}


