import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { TimeSheetService, GlobalService, StaffService, ClientService } from '@services/index';

import { Observable, Subject } from 'rxjs';
import { takeUntil, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import format from 'date-fns/format';

@Component({
    selector: 'preferences-client',
    styles: [`
        ul {
            list-style:none;
            margin:0;
            padding:0;
        }
        ul.main-list > li{
            padding:5px 8px;
        }
        ul.main-list > li:nth-child(even){
            background: #f9f9f9;
        }
        h4{
            color: #004165;
        }
        button{
            margin-top:1rem;
        }
    `],
    templateUrl: './preferences.html'
})


export class PreferencesClient implements OnInit, OnDestroy {
    @Input() id;

    timesheets: Array<any>;

    tabStream = new Subject<number>();
    private unsubscribe = new Subject();

    loading: boolean = false;

    tabIndex: number;
    user: any;

    date = format(new Date(), 'yyyy/MM/dd');
    lists: Array<any> = [];

    constructor(
        private clientS: ClientService,
        private globalS: GlobalService
    ) {
        
    }

    ngOnInit() {
        this.user = this.id || this.globalS.decode()['code'];

        this.clientS.getcompetencies(this.user)
            .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                this.lists = data;
        })

        this.listpreferences();
    }

    ngOnDestroy() {

    }

    ifShow(data: any): boolean {
        var len = data.competenciesList.filter(x => x.selected == true);
        if (len.length > 0)
            return true;
        return false;
    }

    listpreferences() {
        this.clientS.getpreferences(this.globalS.decode().uniqueID).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {
                console.log(data);
            })
    }

    getSelectedPreference() {
        var tempArr: Array<string> = [];

        this.lists.forEach(x => {
            x.competenciesList.forEach(b => {
                console.log(b)
                if (b.selected) {
                    tempArr.push(b.description);
                }
            });
        });
        return tempArr;
    }

    postpreference() {
        this.clientS.postpreferences(this.globalS.decode().uniqueID, this.getSelectedPreference())
            .subscribe(data => {
                if (data) {
                    this.globalS.sToast('Sucess', 'Your preferences has been changed');
                }
            })
    }


}