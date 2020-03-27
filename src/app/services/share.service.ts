import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ShareService {
    private emitChangeSource = new Subject<any>();
    private emitOnSearchList = new BehaviorSubject(false);

    private pickedObject: any;

    changeEmitted$ = this.emitChangeSource.asObservable();
    emitOnSearchList$ = this.emitOnSearchList.asObservable();

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
}