import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { zip } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from './../../services/form.service';

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

  onSubmit() {
    console.log('Handling submit button');
    console.log(this.checkoutFormGroup);
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
