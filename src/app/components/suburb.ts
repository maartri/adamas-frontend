import { Component, forwardRef, ElementRef, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';

import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Subject, Subscription, Observable, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators'
import { ClientService, GlobalService } from '@services/index';

const noop = () => 
{
};

@Component({
    selector: 'suburb',
    templateUrl: './suburb.html',
    styles: [`        
        nz-select {
            margin-right: 8px;
            width: 100%;
        }
    `],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => SuburbComponent),
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SuburbComponent implements OnInit, OnDestroy, ControlValueAccessor {
    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    @Input() placeholder: string = '';


    private searchStream = new Subject<string>();
    private _subscription$: Subscription;
    private searchResult$: Observable<any>;

    innerValue: any = null;
    lists: Array<any> = [];
    isLoading: boolean;

    loadComponent: boolean;


    constructor(
        private clientS: ClientService,
        private globalS: GlobalService,
        private cd: ChangeDetectorRef,
        // @SkipSelf() @Optional() private control: NgControl
    ) {

        this.searchResult$ = this.searchStream.pipe(
            debounceTime(200),
            switchMap(data => {
                if (!data) return EMPTY;

                let pcode = /(\d+)/g.test(data) ? data.match(/(\d+)/g)[0] : "";
                let suburb = /(\D+)/g.test(data) ? data.match(/(\D+)/g)[0] : "";

                let finalSuburb = suburb && suburb.split(',').length > 0 ? suburb.split(',')[0] : suburb;
                this.lists = [];

                return this.clientS.getsuburb({
                    Postcode: pcode,
                    SuburbName: finalSuburb,
                });
            })
        );

        this._subscription$ = this.searchResult$.pipe(debounceTime(500)).subscribe(data => {
            this.lists = data;
            var index = this.searchListIndex(this.innerValue, this.lists);

            if (this.lists.length > index && this.innerValue) {     
                var index = this.searchListIndex(this.innerValue, this.lists);       
                if(index > -1)
                    this.innerValue = `${this.lists[index].suburb} ${this.lists[index].postcode}, ${this.lists[index].state}`;                
            }
            
            this.select(this.innerValue);

            this.isLoading = false;
            this.loadComponent = false;

            this.cd.markForCheck();
            this.cd.detectChanges();
        });
    }

    searchListIndex(address: any, lists: Array<any>): number{
        if(!this.lists || this.lists.length == 0)   return 0;        
        if(address == null) return 0;
        let suburb = /(\D+)/g.test(address) ? address.match(/(\D+)/g)[0].trim() : "";
        if(suburb != "")    return lists.findIndex(x => x.suburb == suburb);        
        return 0;
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.searchStream.next();
        this.searchStream.complete();
    }

    change() {

    }

    select(value: any) {
        this.onChangeCallback(value);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {

        let _value = value ? value.trim() : '';
  
        if (this.globalS.isEmpty(_value)) {
            this.lists = [];
            this.innerValue = null;
        } else {
            this.lists.push(this.innerValue);
            this.innerValue = value;
            this.loadComponent = true;          
            this.searchStream.next(value);
            console.log('suburb') 
        }

        this.cd.markForCheck();
        this.cd.detectChanges();
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
            this.isLoading = true;
            this.searchStream.next(value);
        }
    }

    format(value: any): string {
        return `${value.suburb} ${value.postcode}, ${value.state}`
    }

    // ControlValueAccessor methods and others

    //    public get invalid(): boolean {
    //         return this.control ? this.control.invalid : false;
    //     }

    //     public get showError(): boolean {
    //         if (!this.control) {
    //         return false;
    //         }

    //         const { dirty, touched } = this.control;

    //         return this.invalid ? (dirty || touched) : false;
    //     }
}