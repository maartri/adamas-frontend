import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ShareService {
    private emitChangeSource = new Subject<any>();
    private emitOnSearchList = new BehaviorSubject(false);
    private emitRouteChangeSource = new Subject<any>();
    private emitMemberPicked = new Subject<any>();


    private pickedObject: any;

    changeEmitted$ = this.emitChangeSource.asObservable();
    emitRouteChangeSource$ = this.emitRouteChangeSource.asObservable();
    emitOnSearchList$ = this.emitOnSearchList.asObservable();
    emitMemberPicked$ = this.emitMemberPicked.asObservable();

    
    private emitProfileStatus = new Subject<any>();
    emitProfileStatus$ = this.emitProfileStatus.asObservable();

    emitChange(change: any) {
        this.pickedObject = change;
        this.emitChangeSource.next(change);
    }

    getPicked() {
        return this.pickedObject;
    }

    emitOnSearchListNext(change: any) {
        this.emitOnSearchList.next(change);
    }

    emitRouteChange(index: number, changeRoute: boolean = false) {
        const route = {
            index: index,
            changeRoute: changeRoute
        }
        this.emitRouteChangeSource.next(route);
    }

    emitMemberPickedChange(change: any){        
        this.emitMemberPicked.next(change);
    }

    emitRecipientStatus(change: any){
        this.emitProfileStatus.next(change);
    }
}