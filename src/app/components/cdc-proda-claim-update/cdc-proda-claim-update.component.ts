import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cdc-proda-claim-update',
  templateUrl: './cdc-proda-claim-update.component.html',
  styleUrls: ['./cdc-proda-claim-update.component.css']
})
export class CdcProdaClaimUpdateComponent implements OnInit {

  @Input() open: any;
  @Input() option: any;
  @Input() user: any;
  
  isVisible: boolean = false;
  index: number = 0;
  
  dateRange: any;
  selectedValue: any;

  tableData: Array<any> = [];
  loading:any;

  selectAll: boolean = false;

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
