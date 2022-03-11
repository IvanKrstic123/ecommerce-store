import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductList(id: number): Observable<Product[]> {

    // build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${id}`

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(page: number, pageSize: number, id: number): Observable<GetResponseProducts> {

    // build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId` +
                      `?id=${id}` +
                      `&page=${page}` +
                      `&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // search products by name
  seachProductsByNamePaginate(page: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {

    // build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByNameContaining` +
                      `?name=${keyword}` +
                      `&page=${page}` +
                      `&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

   // search products by category
   getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${id}`;

    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
    page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
    }
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
