import { Component, OnInit, Input, forwardRef, ViewChild, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import * as _ from 'lodash';
import { mergeMap, takeUntil, concatMap, switchMap } from 'rxjs/operators';

const noop = () => {
};

@Component({
  selector: 'app-contacts-details',
  templateUrl: './contacts-details.component.html',
  styleUrls: ['./contacts-details.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ContactsDetailsComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  
export class ContactsDetailsComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() user: any;
  

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  innerValue: Dto.ProfileInterface;

  kinsArray: Array<any> = [];

  kindetailsGroup: FormGroup;

  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.buildForm();
  }

  buildForm(): void {
    this.kindetailsGroup = this.formBuilder.group({
      listOrder: [''],
      type: [''],
      name: [''],
      email: [''],
      address1: [''],
      address2: [''],
      suburbcode: [''],
      suburb: [''],
      postcode: [''],
      phone1: [''],
      phone2: [''],
      mobile: [''],
      fax: [''],
      notes: [''],
      oni1: false,
      oni2: false,
      ecode: [''],
      creator: [''],
      recordNumber: null
    });
  }

  ngAfterViewInit(): void{
    
  }

  ngOnDestroy(): void{

  }

  searchKin(token: Dto.ProfileInterface){

    if (token.view == view.recipient) {
      
    }

    if (token.view == view.staff) {
    
      this.timeS.getcontactskinstaff(token.name)
        .subscribe(data => {
          this.kinsArray = data;

          if (data.length > 0) {
            this.showDetails(data[0]);
          }

          this.cd.markForCheck();
          this.cd.detectChanges();
        });
    }

  }

  showDetails(kin: any) {

    this.timeS.getcontactskinstaffdetails(kin.recordNumber)
      .subscribe(data => {
        console.log(data);
        this.kindetailsGroup.patchValue({
          address1: data.address1,
          address2: data.address2,
          name: data.contactName,
          type: data.contactType,
          email: data.email,
          fax: data.fax,
          mobile: data.mobile,
          notes: data.notes,
          phone1: data.phone1,
          phone2: data.phone2,
          suburbcode: (data.postcode || '').trim() + ' ' + (data.suburb || '').trim(),
          suburb: data.suburb,
          postcode: data.postcode,
          listOrder: data.state,
          oni1: (data.equipmentCode || '').toUpperCase() == 'PERSON1',
          oni2: (data.equipmentCode || '').toUpperCase() == 'PERSON2',
          recordNumber: data.recordNumber
        })
      })

  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null) {
      this.innerValue = value;
      this.searchKin(this.innerValue);
      // this.tab = 1;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}
