import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges, NgZone, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import Cropper from "cropperjs";


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild("image", { static: false }) public image: ElementRef;

  @Input("src")  public imageSource: string;
  @Input()  public role: string;
  @Input()  public id: string;
  
  @Output() imgBLOB = new EventEmitter<any>();
  public imageDestination: string = "";

  private cropper: Cropper;
  private canvas: HTMLCanvasElement;

  load: boolean;

  constructor(
    public ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //this.initCropper();
    // console.log(this.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'imageSource' && changes[property].currentValue != null) {          
          this.replace(changes[property].currentValue) 
      }
    }
  }

  ngAfterViewInit() {
    if (this.image.nativeElement) {
      this.ngZone.runOutsideAngular(() => {
        this.initCropper();
      });
    }
  }

  initCropper() {
    this.cropper = new Cropper(this.image.nativeElement,
      {
        zoomable: false,
        scalable: true,
        autoCrop: false,
        background: false,
        autoCropArea: 1,
        minContainerWidth: 340,
        minContainerHeight: 240,
        aspectRatio: 1,
        viewMode: 2,
        cropBoxMovable: false,
        cropBoxResizable: false,
        ready: () => {     
          this.cropImage();        
        },
        cropstart: () => {
          this.cropImage();
        },
        crop: () => {
          this.cropImage();
        },
        cropend: (e) => {
          //this.cropImage();
        }
      });
    
    //this.cropper.disable();
  }

  cropImage() {

    var cnvs = this.cropper.getCroppedCanvas({
      imageSmoothingQuality: "low",
      imageSmoothingEnabled: false,
      fillColor: '#fff' 
      // width: 360,
      // height: 360,
    });

    this.canvas = cnvs;    

    this.canvas.toBlob((blob) => {
      var formData = new FormData();
      formData.append('files', blob, `${+new Date}-${this.id}-profile.png`);
      formData.append('uniqueID', this.id);
      formData.append('role', this.role);

      this.imgBLOB.emit({
        formData
      });
    });

    //this.imageDestination = this.canvas.toDataURL("image/png", 0.7);

  }

  getRoundedCanvas(sourceCanvas: any) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }

  replace(file: File) {
    this.load = true;    

    if (!(typeof file == 'string') && FileReader && file) {
      this.cropper.destroy();

      var fr = new FileReader();

      fr.onloadend = (e) => {
        this.image.nativeElement.src = fr.result;
        this.cropper.replace(this.image.nativeElement.src);
      }

      fr.readAsDataURL(file);
    }
    
    
    setTimeout(() => {
      this.load = false;
      this.cd.markForCheck();
      this.cd.detectChanges();

    }, 500);
  }
  
  errorUrl(event: any) {
    console.log('error')
    // this.cropper.replace(`assets/logo/profile.png`);
  }

}
