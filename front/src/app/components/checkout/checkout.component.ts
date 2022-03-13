import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { zip } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from './../../services/form.service';
import { WhiteSpaceValidator } from './../../validators/white-space-validator';
import { CartService } from './../../services/cart.service';
import { CheckoutService } from './../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from './../../common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from './../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formService: FormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = new FormGroup({
      customer: new FormGroup({
        firstName: new FormControl('',
        [
          Validators.required,
          Validators.minLength(4),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        lastName: new FormControl('',
        [
          Validators.required,
          Validators.minLength(4),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        email: new FormControl('',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      }),
      shippingAddress: new FormGroup({
        street: new FormControl('',
        [
          Validators.required,
          Validators.minLength(4),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        city: new FormControl('',
        [
          Validators.required,
          Validators.minLength(4),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ])
      }),
      billingAddress: new FormGroup({
        street: new FormControl('',
        [
          Validators.required,
          Validators.minLength(4),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        city: new FormControl('',
        [
          Validators.required,
          Validators.minLength(4),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ])
      }),
      creditCard: new FormGroup({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          WhiteSpaceValidator.notOnlyWhiteSpace
        ]),
        cardNumber: new FormControl('',
        [
          Validators.required,
          Validators.pattern('[0-9]{16}')
        ]),
        securityCode: new FormControl('',
        [
          Validators.required,
          Validators.pattern('[0-9]{3}')
        ]),
        expirationMonth: new FormControl(''),
        expirationYear: new FormControl('')
      })
    });

    // populating credit card months dropdown
    const startMonth: number = new Date().getMonth() + 1; // zero based
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    // populating credit card years dropdown
    this.formService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    // populating countries
    this.formService.getCountries().subscribe(
      data => this.countries = data
    );

    this.reviewCartDetails();
  }

  // customer form group getters
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  // shipping form group getters
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  // billing form group getters
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

    // credit card group getters
    get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
    get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
    get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
    get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
    get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
    get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  onSubmit() {

    // if form is invalid show all error messages
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // create orderItems from cartItems
    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item))

    // populate purchase - customer
    let purchase: Purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

    // populate purchase - billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    // populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via checkout service
    this.checkoutService.plaseOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`)

          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    );

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0)

    // reset form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products')
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = +creditCardFormGroup?.value.expirationYear;

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1; // zero based
    }
    else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
        console.log(this.creditCardMonths);
      }
    );
  }

  // call service to fetch states
  // set response data to property
  // add state to the form
  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    // fetch country added in form
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    // get states by country
    this.formService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // display first state on dropdown
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  // listening behavior subject - returning buffered last missed event
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }
}
