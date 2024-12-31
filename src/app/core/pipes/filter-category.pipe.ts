import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategory',
  standalone: true
})
export class FilterCategoryPipe implements PipeTransform {

  transform(products: any[], searchInput: string, selectedCategoryName: string): any[] {

    let filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (!selectedCategoryName || selectedCategoryName.trim() === '') {
      return filteredProducts; // Do not apply category filtering
    }

    filteredProducts = filteredProducts.filter(product =>
      product.category.name.toLowerCase() === selectedCategoryName.toLowerCase()
    );

    return filteredProducts;
  }
}
