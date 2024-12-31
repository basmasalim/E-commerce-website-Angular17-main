import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/interfaces/categories';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private readonly _CategoriesService = inject(CategoriesService);
  getAllCategoriesSub!: Subscription;
  categoryList: Categories[] = [];

  ngOnInit(): void {
    this.getAllCategories()
  }
  ngOnDestroy(): void {
    this.getAllCategoriesSub?.unsubscribe()
  }
  getAllCategories(): void {
    this.getAllCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data
      }
    })
  }

}
