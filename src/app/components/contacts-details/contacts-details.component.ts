import { Component, OnInit, Input, forwardRef, ViewChild, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, contactGroups, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import * as _ from 'lodash';
import { mergeMap, takeUntil, concatMap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TitleCasePipe } from '@angular/common';

import { ProfileInterface} from '@modules/modules';

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
  
export class ContactsDetailsComponent implements OnInit, OnDestroy, OnChanges,ControlValueAccessor {
  private unsubscribe: Subject<void> = new Subject();

  @Input() user: any;  

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  innerValue: ProfileInterface;
  kinsArray: Array<any> = [];
  kindetailsGroup: FormGroup;
  inputForm: FormGroup;  

  contactGroups: Array<string> = contactGroups;

  modalOpen: boolean = false;
  postLoading: boolean = false;  

  selected: any;
  current: number = 0;
  loading: boolean;

  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private titleCase: TitleCasePipe
  ) { }

  ngOnInit(): void {    
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      console.log(this.user)
        this.searchKin(this.user);      
    }
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

    this.inputForm = this.formBuilder.group({
      group: [''],
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
    })
  }

  ngAfterViewInit(): void{
    
  }

  ngOnDestroy(): void{
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  searchKin(token: ProfileInterface){
    this.loading = true;

    if (token.view == view.recipient) {
        this.timeS.getcontactskinrecipient(token.id)
        .subscribe(data => {
          console.log(data);
          this.kinsArray = data.list;

          if (data.length > 0) {
            this.selected = data[0];
            this.showDetails(data[0]);
          }
          this.loading = false
          this.cd.markForCheck();
          this.cd.detectChanges();
        });
    }

    if (token.view == view.staff) {
    
      this.timeS.getcontactskinstaff(token.name)
        .subscribe(data => {
          this.kinsArray = data;

          if (data.length > 0) {
            this.selected = data[0];
            this.showDetails(data[0]);
          }
          this.loading = false
          this.cd.markForCheck();
          this.cd.detectChanges();
        });
    }

  }

  showDetails(kin: any) {

    this.timeS.getcontactskinstaffdetails(kin.recordNumber)
      .subscribe(data => {
       
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
    console.log(value)
    if (value != null) {
      this.innerValue = value;
      this.searchKin(this.innerValue);
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

  save() {
    if (this.innerValue.view === view.staff)
    {
      var sub = this.kindetailsGroup.get('suburbcode').value;
      let address = sub ? this.getPostCodeAndSuburb(sub) : null;

      if (!this.globalS.isEmpty(address)) {
        this.kindetailsGroup.controls["postcode"].setValue(address.pcode);
        this.kindetailsGroup.controls["suburb"].setValue(address.suburb);
      }
     

      if (this.kindetailsGroup.get('oni1').value) {
        this.kindetailsGroup.controls['ecode'].setValue('PERSON1')
      } else if (this.kindetailsGroup.get('oni2').value) {
        this.kindetailsGroup.controls['ecode'].setValue('PERSON2')
      }

      const details = this.kindetailsGroup.value;

      this.timeS.updatecontactskinstaffdetails(
        details,
        details.recordNumber
      ).subscribe(data => {    
          this.searchKin(this.innerValue);
          this.globalS.sToast('Success', 'Contact Updated');       
      })

    }

    if (this.innerValue.view === view.recipient)
    {

    }

  }

  getPostCodeAndSuburb(address: any): any {
    const rs = address;
    let pcode = /(\d+)/g.test(rs) ? rs.match(/(\d+)/g)[0] : "";
    let suburb = /(\D+)/g.test(rs) ? rs.match(/(\D+)/g)[0].split(',')[0] : "";

    return {
      pcode: pcode.trim() || '',
      suburb: suburb.trim() || ''
    }
  }


  get nextRequired() {
    const { group, type, name } = this.inputForm.value;
    
    if (this.current == 0 && this.globalS.isEmpty(group)) {
      return false;
    }

    if (this.current == 1 && (this.globalS.isEmpty(type) || this.globalS.isEmpty(name)) ) {
      return false;
    }

    return true;
  }

  add() {
    
    console.log(this.user);

    if (this.inputForm.controls['suburbcode'].dirty) {
      var rs = this.inputForm.get('suburbcode').value;
      let pcode = /(\d+)/g.test(rs) ? rs.match(/(\d+)/g)[0].trim() : "";
      let suburb = /(\D+)/g.test(rs) ? rs.match(/(\D+)/g)[0].trim() : "";

      if (pcode !== "") {
        this.inputForm.controls["postcode"].setValue(pcode);
        this.inputForm.controls["suburb"].setValue(suburb);
      }
    }

    if (this.inputForm.get('oni1').value) {
      this.inputForm.controls['ecode'].setValue('PERSON1')
    } else if (this.inputForm.get('oni2').value) {
      this.inputForm.controls['ecode'].setValue('PERSON2')
    }
    
    this.timeS.postcontactskinstaffdetails(
      this.inputForm.value,
      this.user.id
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.globalS.sToast('Success', 'Contact Inserted');
      this.searchKin(this.innerValue);
    });
  }

  delete() {
    this.timeS.deletecontactskin(this.kindetailsGroup.value.recordNumber).subscribe(data => {      
      if (data)
        this.globalS.sToast('Success', 'Contact Deleted');      
      this.searchKin(this.innerValue);
    });
  }

  handleCancel() {
    this.modalOpen = false;
    this.inputForm.reset();
    this.current = 0;
  }

  pre() {
    this.current -= 1;
  }

  next() {
    this.current += 1;
  }



}
