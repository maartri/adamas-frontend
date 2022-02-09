import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cdc-claim-update',
  templateUrl: './cdc-claim-update.component.html',
  styleUrls: ['./cdc-claim-update.component.css']
})
export class CdcClaimUpdateComponent implements OnInit {

  @Input() open: any;
  @Input() option: any;
  @Input() user: any;
  
  isVisible: boolean = false;
  index: number = 0;
  
  dateRange: any;
  selectedValue: any;

  tableData: Array<any> = [];
  loading:any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let property in changes) {
      console.log(property)
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
          this.isVisible = true;
      }
    }
  }

  ngOnDestroy(){
      
  }


  handleCancel(){
    this.isVisible = false;
  }

  handleOk(){
    
  }

  view(index: any){
    this.index = index;
  }
}
