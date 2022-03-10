import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 0;
  searchMode: boolean = false;

  constructor(private productListService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  // list all products by mode
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSeachProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSeachProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // search for the products using keyword
    this.productListService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {

    // if id is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get id and convert it to number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // category id not available... default category id 1
      this.currentCategoryId = 1;
    }

    this.productListService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
