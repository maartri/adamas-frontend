import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges, NgZone, AfterViewInit } from '@angular/core';
import Cropper from "cropperjs";


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild("image", { static: false }) public image: ElementRef;

  @Input() src: any;
  @Output() imgBLOB = new EventEmitter<FormData>();
  public imageDestination: string = "";

  private cropper: Cropper;
  private canvas: HTMLCanvasElement;

  constructor(
    public ngZone: NgZone
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'src' && 
        !changes[property].isFirstChange() && changes[property].currentValue != null) {
          this.replace(changes[property].currentValue) 
      }
    }
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initCropper();
    });
  }

  initCropper() {
    this.cropper = new Cropper(this.image.nativeElement,
      {
        zoomable: false,
        scalable: false,
        autoCropArea: 1,
        minContainerWidth: 340,
        minContainerHeight: 240,
        aspectRatio: 1,
        viewMode: 2,
        cropBoxMovable: true,
        cropBoxResizable: false,
        ready: () => {
          this.cropImage();
        },
        cropstart: () => {
          this.cropImage();
        },
        // crop: () => {
        //   this.cropImage();
        // },
        cropend: (e) => {
          this.cropImage();
        }
      });
  }

  cropImage() {

    var cnvs = this.cropper.getCroppedCanvas({
      imageSmoothingQuality: "low",
      width: 360,
      height: 360,
    });

    this.canvas = this.getRoundedCanvas(cnvs);
    this.imageDestination = this.canvas.toDataURL("image/png", 0.7);

    this.canvas.toBlob((blob) => {
      var formData = new FormData();
      formData.append('files', blob, 'profile.png');
      // formData.append('uniqueID', this.user);
      // formData.append('role', this.role);

      this.imgBLOB.emit(formData);
    });

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
    console.log(file);
    if (FileReader && file) {
      
      this.cropper.destroy();

      var fr = new FileReader();

      fr.onloadend = (e) => {
        this.image.nativeElement.src = fr.result;
        this.cropper.replace(this.image.nativeElement.src);
      }

      fr.readAsArrayBuffer(file);
    }     
  }
  
  errorUrl(event: any) {
    // this.cropper.replace(`assets/logo/profile.png`);
  }

}
