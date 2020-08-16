import { Component, OnInit, Output, forwardRef, OnDestroy, ChangeDetectorRef,EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';

import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { filter } from 'rxjs/operators';

const noop = () => {
};

const UPLOADSHARED_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  multi: true,
  useExisting: forwardRef(() => UploadSharedComponent),
};


@Component({
  selector: 'app-upload-shared',
  templateUrl: './upload-shared.component.html',
  styleUrls: ['./upload-shared.component.css'],
  providers: [
    UPLOADSHARED_VALUE_ACCESSOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UploadSharedComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output() uploadEvent = new EventEmitter();

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  acceptedTypes: string = "image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";

  fileList2: Array<any> = [];
  isVisible: boolean = false;

  urlPath: string;
  private innerValue: any;

  fileList: UploadFile[] = [];
  uploading: boolean = false;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private msg: NzMessageService) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  handleCancel(){
    this.isVisible = false;
    this.fileList2 = [];
  }

  // handleOk(){

  // }

  // customReq = (item: UploadXHRArgs) => {

  //   const formData = new FormData();
  //   formData.append('file', item.file as any);

  //   const req = new HttpRequest('POST', item.action!, formData, {
  //     reportProgress: true,
  //     withCredentials: true
  //   });

  //   return this.http.request(req).subscribe(
  //     (event: HttpEvent<any>) => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         if (event.total! > 0) {
  //           (event as any).percent = (event.loaded / event.total!) * 100;
  //         }
  //         item.onProgress!(event, item.file!);
  //       } else if (event instanceof HttpResponse) {
  //         item.onSuccess!(event.body, item.file!, event);
  //       }
  //     },
  //     err => {
  //       item.onError!(err, item.file!);
  //     }
  //   );
  // }

  // handleChange({ file, fileList }: UploadChangeParam): void {
  //   const status = file.status;
  //   if (status !== 'uploading') {
  //     // console.log(file, fileList);
  //   }
  //   if (status === 'done') {
  //     this.msg.success(`${file.name} file uploaded successfully.`);
  //     this.loadFiles();
  //   } else if (status === 'error') {
  //     this.msg.error(`${file.name} file upload failed.`);
  //   }
  // }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(){
    const formData = new FormData();

    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });

    this.uploading = true;

    const req = new HttpRequest('POST', this.urlPath, formData, {
      // reportProgress: true
    });

    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(data => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('Upload success');
          this.uploadEvent.emit(true);
          this.handleCancel();
        },(err: any) => {
          this.uploading = false;
          this.uploadEvent.emit(false);
          this.msg.error('Upload failed');
        }, () => {
          this.cd.detectChanges();
          this.cd.markForCheck();
        }
      );
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    console.log(value);
    if (value != null) {
      this.innerValue = value;
      this.urlPath = `api/v2/file/upload/document/${this.innerValue.id}`;
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
