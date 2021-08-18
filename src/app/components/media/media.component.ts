import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GlobalService, UploadService, TimeSheetService } from '@services/index';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http'


import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';

import { UploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() personID: string;
  
  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;

  mediaList: Array<any>;
  isVisible: boolean = false;

  title: string = ''
  description: string = '';
  group: string;

  groupList: Array<string> = [];

  fileList: any[] = [];

  constructor(
    private http: HttpClient,
    private globalS: GlobalService,
    private uploadS: UploadService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private msg: NzMessageService,
    private timeS: TimeSheetService
  ) { }

  ngOnInit(): void {
    this.getMedia();

    this.timeS.getgrouplist('atay')
        .subscribe(x => {
          this.groupList = x;
        })
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  clear(){
    this.title = '';
    this.description = '';
    this.group = null;
  }


  getMedia() {

    

    this.uploadS.getMedia(this.personID)
      .subscribe(files => {

        this.mediaList = files.map(x => {
          return {
            clientGroup: x.clientGroup,
            endDate: x.endDate,
            fileBlob: x.fileBlob,
            item: x.item,
            media: x.media,
            mediaDisplay: x.mediaDisplay,
            mediaText: x.mediaText,
            program: x.program,
            startDate: x.startDate,
            target: x.target,
            type: x.type,
            url: `/media/${x.media}`
          }
        });

        this.detectChanges();
      });
  }

  detectChanges(){
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  handleCancel(){
    this.isVisible = false;
  }

  handleOk(){

  }

  beforeUpload = (file: any): boolean => {
    console.log(file);
    this.fileList = this.fileList.concat(file);
    return false;
  }

  // handleChange({ file, fileList }: UploadChangeParam): void {
  //   const status = file.status;
  //   if (status !== 'uploading') {
  //     console.log(file, fileList);
  //   }
  //   if (status === 'done') {
  //     this.msg.success(`${file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     this.msg.error(`${file.name} file upload failed.`);
  //   }
  // }

  handleUpload(){

      var formData = new FormData()
       
      for (var file of this.fileList) {
        formData.append(file.name, file)
      }
  
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("group", this.group);

  
      const req = new HttpRequest('POST', `api/upload/media/${this.personID}`, formData);
  
      this.http.request(req).subscribe(event => {
        if(event){
          this.globalS.sToast('Success','Media has been saved');
          this.getMedia();
          this.clear();
          // this.uploadModal = false;
        }           
      });
  }

}
