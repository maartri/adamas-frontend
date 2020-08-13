import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class VersionCheckService {
    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
    private timer: any = null;
    private url: string; 
    constructor(
        private http: HttpClient,
        private modalService: NzModalService
    ) {}

    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
    public initVersionCheck(url) {
        this.url = url;
        this.startTimer(url);
    }

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
    private checkVersion(url) {
        // timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime())
            .subscribe(
                (response: any) => {
                    const hash = response.hash;
                    const hashChanged = this.hasHashChanged(this.currentHash, hash);     
                    this.currentHash = JSON.parse(localStorage.getItem('hash'));
                    // If new version, do something
                    console.log(this.currentHash + '   ' + hash);
                    if (hashChanged) {                        
                        // location.reload();
                        this.info();
                    }
                    localStorage.setItem('hash', JSON.stringify(hash));
                    // store the new hash so we wouldn't trigger versionChange again
                    // only necessary in case you did not force refresh
                    this.currentHash = hash;
                },
                (err) => {
                    console.error(err, 'Could not get version');
                }
            );
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }

        return currentHash !== newHash;
    }
    
    info(): void {
        this.stopTimer();
        this.modalService.info({
          nzTitle: 'Reload Version',
          nzContent: '<p>Reload the application to get the latest changes?</p>',
          nzOnOk: () => {
            location.reload();
            this.startTimer(this.url);
          }
        });
    }

    startTimer(url: string){
        this.stopTimer();
        this.timer =  setInterval(() => {
            this.checkVersion(url);
        }, 10000);
    }

    stopTimer(){
        if(this.timer){
            clearInterval(this.timer)
        }
    }
}
