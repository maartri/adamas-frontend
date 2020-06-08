import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges, NgZone, Inject } from '@angular/core';
import Cropper from "cropperjs";


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit, OnChanges {

  @Input() src: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'src' && !changes[property].isFirstChange() && changes[property].currentValue != null) {
        console.log(changes[property].currentValue);
        console.log('iimage cropper')
      }
    }
  }

}
