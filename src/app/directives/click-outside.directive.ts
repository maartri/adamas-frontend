import {Directive, OnInit, OnDestroy, Output, EventEmitter, ElementRef, AfterViewInit} from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { delay, takeUntil, mergeMap, tap } from 'rxjs/operators';


@Directive({
  selector: '[clickOutside]'
})

export class ClickOutsideDirective implements OnInit, OnDestroy {
    private listening:boolean;
    private globalClick:Observable<MouseEvent>;
    private subscription: Subscription;

    @Output('clickOutside') clickOutside:EventEmitter<Object>; 

    constructor(private _elRef:ElementRef) {
        this.listening = false;
        this.clickOutside = new EventEmitter();
    }  

    ngOnInit() {
        this.subscription = fromEvent<MouseEvent>(document, 'click')
            .pipe(delay(1), tap(() => this.listening = true)).subscribe(event => this.onGlobalClick(event));
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onGlobalClick(event:MouseEvent) {
        if (event instanceof MouseEvent && this.listening === true) {
            if(this.isDescendant(this._elRef.nativeElement, event.target) === true) {
                this.clickOutside.emit({
                target: (event.target || null),
                value: false
                });
            } else {
                this.clickOutside.emit({
                target: (event.target || null),
                value: true
                });
            }
        }
    }

    isDescendant(parent, child) {
        let node = child;
        while (node !== null) {
            if (node === parent) {
                return true;
            } else {
                node = node.parentNode;
            }
        }
        return false;
    }
}
