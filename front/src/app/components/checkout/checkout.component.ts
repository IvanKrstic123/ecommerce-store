import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { zip } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from './../../services/form.service';
import { WhiteSpaceValidator } from './../../validators/white-space-validator';

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

  constructor(private formService: FormService) { }

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
    console.log(this.checkoutFormGroup);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
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
}
