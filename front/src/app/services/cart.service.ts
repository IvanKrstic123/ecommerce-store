import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from './../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    // check if item already in cart
    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id)!
      // mark if found
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    // if exists increment item quantity
    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    }
    else {
      // add new item to the array
      this.cartItems.push(cartItem);
    }

    // compute cart totals
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let tempCartItem of this.cartItems) {
      totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue += tempCartItem.quantity;
    }

    // publish the new values for subscribers...
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.cartItems.forEach(cartItem => {
      console.log(cartItem);
    })
  }
}
