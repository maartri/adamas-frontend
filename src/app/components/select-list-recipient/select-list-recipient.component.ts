import { Component, OnInit, Input,forwardRef } from '@angular/core';

import { RECIPIENT_OPTION, ModalVariables } from '../../modules/modules';
import { SqlWizardService } from '@services/sqlwizard.service';
import { ListService, } from '@services/index';

import { Observable, of, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-list-recipient',
  templateUrl: './select-list-recipient.component.html',
  styleUrls: ['./select-list-recipient.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectListRecipientComponent),
      multi: true
    }
  ]
})
export class SelectListRecipientComponent implements OnInit, ControlValueAccessor {

  @Input() program: any;
  @Input() option: RECIPIENT_OPTION;

  lists$: Observable<string>;
  value: string;

  // Function to call when the rating changes.
  onChange = (data: any) => {};

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {};

  constructor(
    private sqlWiz: SqlWizardService,
    private listS: ListService
  ) { }

  ngOnInit(): void {
    this.populate(this.program, this.option);
  }

  populate(program: any, option: RECIPIENT_OPTION){

    var _input = {
      program: program,
      option: option
    }

    if(option == RECIPIENT_OPTION.REFER_IN)
      this.lists$ = this.listS.getwizardreferraltypes({ Program: program, TabType: 'REFERRAL-IN' });
    else{
      this.lists$ = of({}).pipe(
          switchMap(() =>{
            return this.sqlWiz.GETREFERRALTYPE_V2(_input);
          }),
          switchMap(x => {
            if(x && x.length > 0){
              this.onClickHandler(x[0]);
            }
            return of(x);
          })
      )
    }
  }


  writeValue(value: any): void {
     
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onClickHandler(data: any){   
    this.value = data;
    this.onChange(this.value);
  }
}
