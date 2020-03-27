import { Component, forwardRef, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Subject, Subscription, Observable, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators'
import { ClientService, GlobalService } from '@services/index';

const noop = () => {
};

@Component({
    selector: 'suburb',
    templateUrl: './suburb.html',
    styles: [`
        
        nz-select {
            margin-right: 8px;
            width: 200px;
        }
    `],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => SuburbComponent),
    }]
})

export class SuburbComponent implements OnInit, OnDestroy, ControlValueAccessor {
    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;


    private searchStream = new Subject<string>();
    private _subscription$: Subscription;
    private searchResult$: Observable<any>;

    innerValue: any;
    lists: Array<any> = [];
    isLoading: boolean;

    loadComponent: boolean;

    constructor(
        private clientS: ClientService,
        private globalS: GlobalService
    ) {
        this.searchResult$ = this.searchStream.pipe(
            debounceTime(500),
            switchMap(data => {
                this.isLoading = true;
                let pcode = /(\d+)/g.test(data) ? data.match(/(\d+)/g)[0] : "";
                let suburb = /(\D+)/g.test(data) ? data.match(/(\D+)/g)[0] : "";

                let finalSuburb = suburb && suburb.split(',').length > 0 ? suburb.split(',')[0] : suburb;
                this.lists = [];

                // if (this.globalS.isEmpty(pcode) || this.globalS.isEmpty(finalSuburb)) return EMPTY;
                return this.clientS.getsuburb({
                    Postcode: pcode,
                    SuburbName: finalSuburb,
                });
            })
        );

        this._subscription$ = this.searchResult$.pipe(debounceTime(1000)).subscribe(data => {
            this.lists = data;

            if (this.lists.length > 0) {
                this.innerValue = `${this.lists[0].postcode} ${this.lists[0].suburb}, ${this.lists[0].state}`;
                this.select(this.innerValue);
            }

            this.isLoading = false;
            this.loadComponent = false;
        });
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    change() {

    }

    select(value: any) {
        this.onChangeCallback(value);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (!value) {
            this.lists = [];
            this.innerValue = null;
            return;
        }
        if (value != null) {
            this.innerValue = value;
            this.loadComponent = true;
            this.searchStream.next(value);
            // this.tab = 1;
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

    search(value: string) {
        if (!this.globalS.isEmpty(value)) {
            this.searchStream.next(value);
        }
    }

    format(value: any): string {
        return `${value.postcode} ${value.suburb}, ${value.state}`
    }
}