import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Brands } from '../../core/interfaces/brands';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {
  private readonly _BrandsService = inject(BrandsService);
  getAllBrandsSub!: Subscription;
  brandsList: Brands[] = [];

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.getAllBrandsSub = this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList = res.data
      }
    })
  }

  ngOnDestroy(): void {
    this.getAllBrandsSub?.unsubscribe()
  }
}
