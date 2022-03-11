import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from './../../services/product.service';
import { CartItem } from './../../common/cart-item';
import { CartService } from './../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productListService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(event: any) {
    this.thePageSize = event.target.value;
    this.thePageNumber = 1;
    this.listProducts(); // refresh page view
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

    // reset pagination if search keyword is changed
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    // keep track of previous category
    this.previousKeyword = theKeyword;

    console.log(`keyword: ${theKeyword}. thePageNumber ${this.thePageNumber}`);


    // search for the products using keyword
    this.productListService.seachProductsByNamePaginate(this.thePageNumber - 1,
                                                   this.thePageSize,
                                                   theKeyword)
    .subscribe(this.procesResult());
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

    // reset pagination if category is changed
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    // keep track of previous category selected
    this.previousCategoryId = this.currentCategoryId;

    this.productListService.getProductListPaginate(this.thePageNumber - 1,
                                                   this.thePageSize,
                                                   this.currentCategoryId)
    .subscribe(this.procesResult());
  }

  procesResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(product: any) {
    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
  }
}
