import { Component, OnInit, ViewChild, ElementRef, Input,forwardRef } from '@angular/core';
import { GlobalService, UploadService } from '@services/index';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http'


import { DomSanitizer } from '@angular/platform-browser';



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

  constructor(
    private http: HttpClient,
    private globalS: GlobalService,
    private uploadS: UploadService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getMedia();
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
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
        })
      });
  }

}
