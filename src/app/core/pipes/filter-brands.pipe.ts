import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBrands',
  standalone: true
})
export class FilterBrandsPipe implements PipeTransform {

  transform(products: any[], searchInput: string, selectedBrandName: string): any[] {
    let filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (!selectedBrandName || selectedBrandName.trim() === '') {
      return filteredProducts; // Do not apply Brand filtering
    }

    filteredProducts = filteredProducts.filter(product =>
      product.brand.name.toLowerCase() === selectedBrandName.toLowerCase()
    );

    return filteredProducts;
  }

}
