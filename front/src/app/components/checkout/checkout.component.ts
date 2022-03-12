import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { zip } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.checkoutFormGroup = new FormGroup({
      customer: new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl('')
      }),
      shippingAddress: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        zipCode: new FormControl('')
      }),
      billingAddress: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        zipCode: new FormControl('')
      }),
      creditCard: new FormGroup({
        cardType: new FormControl(''),
        nameOnCard: new FormControl(''),
        cardNumber: new FormControl(''),
        securityCode: new FormControl(''),
        expirationMonth: new FormControl(''),
        expirationYear: new FormControl('')
      })
    });
  }

  onSubmit() {
    console.log('Handling submit button');
    console.log(this.checkoutFormGroup);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);

  }

  copyShippingAddressToBillingAddress(event: any){
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
}
