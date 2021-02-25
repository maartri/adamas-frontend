import { Component, OnInit, Input } from '@angular/core';

import { RECIPIENT_OPTION, ModalVariables } from '../../modules/modules';
import { SqlWizardService } from '@services/sqlwizard.service';
import { ListService, } from '@services/index';

import { Observable, of, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-select-list-recipient',
  templateUrl: './select-list-recipient.component.html',
  styleUrls: ['./select-list-recipient.component.css']
})
export class SelectListRecipientComponent implements OnInit {

  @Input() program: any;
  @Input() option: RECIPIENT_OPTION;

  lists$: Observable<string>;
  value: string;

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
              this.value = x[0];
            }
            return of(x);
          })
      )
    }      
  }

}
