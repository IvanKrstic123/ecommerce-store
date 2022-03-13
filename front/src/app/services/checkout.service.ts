import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchase } from './../common/purchase';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private http: HttpClient) { }

  plaseOrder(purchase: Purchase): Observable<any> {

    return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }
}
