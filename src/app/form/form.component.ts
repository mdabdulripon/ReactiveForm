import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, FormControlName  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
// Model
import { City } from '../model/city';
import { CompanyInfo } from '../model/company';
// Service
import { companyServiceService } from '../company-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {

	title: string =  'Company Edit';
	companyForm: FormGroup;
	errorMessage: string;

	companies: CompanyInfo;
	private sub: Subscription;

	displayMessage : { [ key: string]: string } = {};
	private validationMessage: {
		[key: string]: { [key: string] : string}
	};

	get places(): FormArray {
        return <FormArray>this.companyForm.get('places');
    }

	constructor(
		private _fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private _httpService: companyServiceService,
	) {	
		this.validationMessage = {

		}
	}

	ngOnInit() {
		this.companyForm = this._fb.group({
			companyName:[''],
			companyUrl: [''],
			companyBio: [''],
			facebook: [''],
			twitter: [''],
			linkedin: [''],
			cities: this._fb.array([
				this.initCities()
			]),
		});
		this.sub = this.route.params.subscribe(
			params => {
				let id = +params['id'];
				this.getCompany(id);
			}
		);
	}

	initCities() {
		return this._fb.group({
			cityName: [''],
			// places: this._fb.array([]),
		})
	}

	addRow() {
		alert('Adding');
		const control = <FormArray>this.companyForm.controls['cities'];
		control.push(this.initCities());
	}
	
	removeRow() {
		alert('Adding')
	}



	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	addPlace(): void {
        this.places.push(new FormControl());
    }

	getCompany(id: number): void {
		this._httpService.getCompany(id).subscribe(
			(companies: CompanyInfo)=> this.onCompanyRetrive(companies),
			(error: any)=> this.errorMessage = <any>error
		);
	}

	onCompanyRetrive(companies: CompanyInfo): void {
		if(this.companyForm) {
			this.companyForm.reset();
		}
		this.companies = companies;

		if (this.companies.id === 0 ){
			this.title = 'Add Company Profile'
		}
		else {
			this.title = 'Edit Company Profile'
		}


		this.companyForm.patchValue ({
			companyName: this.companies.companyName,
			companyUrl: this.companies.companyUrl,
			companyBio: this.companies.companyBio,
			facebook: this.companies.facebook,
			twitter: this.companies.twitter,
			linkedin: this.companies.linkedin,
		});
	}


}
