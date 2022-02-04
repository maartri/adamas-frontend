import { Component, OnChanges, OnInit, OnDestroy, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-dex-upload',
  templateUrl: './dex-upload.component.html',
  styleUrls: ['./dex-upload.component.css']
})
export class DexUploadComponent implements OnInit, OnChanges, OnDestroy {

  @Input() open: any;
  @Input() option: any;
  @Input() user: any;
  
  isVisible: boolean = false;
  index: number = 0;
  
  dateRange: any;
  selectedValue: any;

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
