import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';

import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TimeSheetService, GlobalService, UploadService } from '@services/index';
import * as _ from 'lodash';

const noop = () => {
};

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UploadFileComponent),
    }
  ]
})

export class UploadFileComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  acceptedTypes: string = "image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
  defaultFileList = [];
  fileList2: Array<any> = [];
  urlPath: string;

  loadedFiles: Array<any> = [];
  token: any;
  loadDocument: boolean = false;

  private innerValue: any;

  constructor(
    private msg: NzMessageService,
    private http: HttpClient,
    private uploadS: UploadService,
    private globalS: GlobalService
  ) {

  }

  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      // console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
      this.loadFiles();
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  ngOnInit() {
    this.token = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember) : this.globalS.decode();
    console.log(this.token);
  }

  loadFiles() {
    this.loadDocument = true;

    if(!this.globalS.isEmpty(this.token.code) && typeof this.token.code !== 'undefined'){
      this.uploadS.getFileDocuments(this.token.code, this.innerValue.view)
      .subscribe(data => {
        this.loadedFiles = data;
        this.loadDocument = false;
      });
    }
  }

  ngOnDestroy() {

  }

  customReq = (item: UploadXHRArgs) => {
    console.log(item);
    const formData = new FormData();
    formData.append('file', item.file as any);
    formData.append('data', JSON.stringify({
      PersonId: this.token.uniqueID,
      DocPath: this.token.recipientDocFolder,
      SourceDocPath: "C:\\Users\\mark\\Desktop\\Programming\\Adamas\\adamasv3\\document",
      DestinationDocPath: "C:\\Users\\mark\\Desktop\\Programming\\Adamas\\adamasv3\\WebHookFile"
    }))

    const req = new HttpRequest('POST', item.action!, formData, {
      reportProgress: true,
      withCredentials: true
    });

    return this.http.request(req).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            (event as any).percent = (event.loaded / event.total!) * 100;
          }
          item.onProgress!(event, item.file!);
        } else if (event instanceof HttpResponse) {
          item.onSuccess!(event.body, item.file!, event);
        }
      },
      err => {
        item.onError!(err, item.file!);
      }
    );
    
  };

  deleteDocument(index: number) {
    if (index < 0) return;

    const { docID, filename } = this.loadedFiles[index];
    this.uploadS.deleteFileDocuments(this.token.code, {
      id: docID,
      filename: filename
    }).subscribe(({ success }: any) => {
      if (success) {
        this.msg.success(`${filename} is deleted.`);
        this.loadedFiles.splice(index, 1);
      }
    })
  }

  downloadDocument(index: number) {
    const { docID, filename, type, originalLocation } = this.loadedFiles[index];

    console.log(this.loadedFiles[index]);



    this.uploadS.downloadFileDocumentRemoteServer({
      PersonID: this.token.id,
      Extension: type,
      FileName: filename,
      SourceDocPath: originalLocation,
      DestinationDocPath: "\\\\sjcc-sydgw01\\portal$\\document"
    }).subscribe(blob => {
        // console.log(blob);
        let data = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = data;
        link.download = filename;
        link.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(data);
        }, 100);
        
        this.globalS.sToast('Success','Download Successful')

      }, (err: HttpErrorResponse) => {
        this.globalS.eToast('Error','Failed to download')
      });

  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null) {
      this.innerValue = value;
      this.token = value.token;
      this.urlPath = `api/v2/file/upload-document-remote`;

      this.loadFiles();
      // this.pathForm(this.innerValue);
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
