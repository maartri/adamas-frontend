import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const upload: string = "api/upload";
const fileV2: string = "api/v2/file";

@Injectable()
export class UploadService {
   constructor(
      public http: HttpClient,
      public auth: AuthService
   ) { }

   getdocumentblob(data: any): Observable<any> {
      // return this.http.post(`${upload}/copy-mta-document`, data , { responseType: 'blob', reportProgress: true });
      return this.http.post(`${upload}/copy-mta-document`, data);
   }

   postprofilePic(data: any): Observable<any> {
      return this.http.post(`${upload}/profile`, data);
   }

   postdocumenttemplate(data: any): Observable<any> {
      return this.http.post(`${upload}/document/template`, data);
   }

   getdocumenttemplate(): Observable<any> {
      return this.http.get(`${upload}/document/template`);
   }

   upload(data: any, personID: string): Observable<any> {
      return this.http.post(`${upload}/upload/document/${personID}`, data);
   }

   getMedia(personID: string): Observable<any> {
      return this.auth.get(`${upload}/media/${personID}`);
   }

   uploadMedia(data: any, personID: string): Observable<any> {
      return this.http.post(`${upload}/media/${personID}`, data);
   }

   download(data: any): Observable<any> {
      return this.http.post(`${upload}/download/document`, data, { responseType: 'blob', reportProgress: true })
   }

   delete(personID: string, file: Dto.FileForm): Observable<any> {
      return this.auth.delete(`${upload}/delete/document/${personID}`, file)
   }

   staffdocuments(user: string): Observable<any> {
      return this.auth.get(`${upload}/documents/staff/${user}`)
   }

   clientdocuments(user: string): Observable<any> {
      return this.auth.get(`${upload}/documents/client/${user}`)
   }

   checkfiles(files: File[], personID: string): Observable<any> {
      const formData = new FormData()
      for (var file of files)
         formData.append(file.name, file)

      let params = new HttpParams();

      const options = {
         params: params,
         reportProgress: true,
      };

      const req = new HttpRequest('POST', `api/upload/check/filetypes/${personID}`, formData, options);

      return this.http.request(req);
   }

   uploadProfilePicture(file: FormData) {
      return this.auth.uploadFile(`${upload}/profile`, file);
   }


   // VERSION 2 API -----------------------------------------------------------------------------------------------------------------------------------

   getFileDocuments(name: string, view: string): Observable<any> {
      return this.auth.get(`${fileV2}/${name}/${view}`)
   }

   deleteFileDocuments(name: string, file: Dto.FileForm): Observable<any>{
      return this.auth.delete(`${fileV2}/${name}`, file);
   }

   downloadFileDocuments(data: any): Observable<any> {
      return this.http.post(`${fileV2}/download`, data, { responseType: 'blob', reportProgress: true });
   }

}
