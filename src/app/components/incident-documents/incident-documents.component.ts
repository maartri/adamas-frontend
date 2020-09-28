import { Component, OnInit, OnDestroy, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';

import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';


import { TimeSheetService, GlobalService, UploadService, ListService, dateFormat } from '@services/index';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';

const noop = () => { };

const defaultIncidentForm: any = {
  name: '',
  discipline: null,
  program: null,
  careDomain: null,
  classification: null,
  category: null,
  reminderDate: null,
  publishToApp: [false],
  reminderText: '',
  notes: ''
}


interface IncidentDocument {
  incidentId: string,
  id: string
}

@Component({
  selector: 'app-incident-documents',
  templateUrl: './incident-documents.component.html',
  styleUrls: ['./incident-documents.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => IncidentDocumentsComponent),
    }
  ]
})
export class IncidentDocumentsComponent implements OnInit {

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  acceptedTypes: string = "image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
  defaultFileList = [];
  fileList2: Array<any> = [];

  urlPath: string = `api/v2/file/upload-incident-document-procedure`;

  loadedFiles: Array<any> = [];
  token: any;
  loadDocument: boolean = false;
  modalInfoOpen: boolean =  false;

  innerValue: IncidentDocument;

  incidentForm: FormGroup;

  listPrograms: Array<any> = [];
  listCareDomain: Array<any> = [];
  listClassification: Array<any> = [];
  listCategories: Array<any> = [];
  listDiscipline: Array<any> = [];

  dateFormat: string = dateFormat;

  file: File;

  constructor(
    private msg: NzMessageService,
    private http: HttpClient,
    private uploadS: UploadService,
    private timeS: TimeSheetService,
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private listS: ListService
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
    this.buildForm();

    this.token = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember) : this.globalS.decode();
    console.log(this.token);
  }

  loadFiles() {
    this.timeS.getincidentdocuments(this.innerValue)
        .subscribe(data => {
          this.loadedFiles = data;

          this.cd.detectChanges();
          this.cd.markForCheck();
        });
  }

  ngOnDestroy() {

  }

  buildForm(){
    this.incidentForm = this.fb.group(defaultIncidentForm);

  }

  populate(){
    this.listS.getprogramsincident(this.innerValue.id).subscribe((data: Array<string>) =>{
      data.push('VARIOUS');
      this.listPrograms = data;

      this.incidentForm.patchValue({ program: 'VARIOUS'});
    });

    this.listS.getcaredomain().subscribe(data => {
      data.push('VARIOUS')
      this.listCareDomain = data;
      this.incidentForm.patchValue({ careDomain: 'VARIOUS'});
    })

    this.listS.getdiscipline().subscribe(data => {
      data.push('VARIOUS')
      this.listDiscipline = data;
      this.incidentForm.patchValue({ discipline: 'VARIOUS'});
    })

    this.listS.getfileclassification().subscribe(data => {
      this.listClassification = data;
    });

    this.listS.getdocumentcategory().subscribe(data => {
      this.listCategories = data;
    });
  }

  resetForm(){
    this.incidentForm.reset(defaultIncidentForm);
  }

  beforeUpload = (file: File): boolean => {
    this.file = file;
    console.log(file);
    
    this.incidentForm.patchValue({
      name: this.globalS.removeExtension(this.file.name)
    });

    this.modalInfoOpen = true;

    return false;
  };

  handleCancel(){
    this.modalInfoOpen = false;
  }

  customReq = () => {
    console.log(this.incidentForm.value)

    console.log(this.file);

    const formData = new FormData();

    const { program, discipline, careDomain, classification, category, reminderDate, publishToApp, reminderText, notes  } = this.incidentForm.value;
    
    formData.append('file', this.file as any);
    formData.append('data', JSON.stringify({
      PersonID: this.innerValue.id,
      DocPath: this.token.recipientDocFolder,
      
      Program: program,
      Discipline: discipline,
      CareDomain: careDomain,
      Classification: classification,
      Category: category,
      ReminderDate: reminderDate,
      PublishToApp: publishToApp,
      ReminderText: reminderText,
      Notes: notes,
      SubId: this.innerValue.incidentId
    }))

    const req = new HttpRequest('POST', this.urlPath, formData, {
      reportProgress: true,
      withCredentials: true
    });

    var id = this.globalS.loadingMessage(`Uploading file ${this.file.name}`)
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
      (event: HttpEvent<any>) => {
        this.msg.remove(id);
        this.globalS.sToast('Success','Document uploaded');
      },
      err => {
        console.log(err);
        this.globalS.eToast('Error',err.error.message);
        this.msg.remove(id);
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

    this.uploadS.downloadFileDocumentInProjectDirectory({
      PersonID: this.token.id,
      Extension: type,
      FileName: filename,
      DocPath: originalLocation
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
    });
  }

  //From ControlValueAccessor interface
  writeValue(value: IncidentDocument = null) {
    if (value != null) {
      this.innerValue = value;
      console.log(value);
      this.populate();      
      this.loadFiles();
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
