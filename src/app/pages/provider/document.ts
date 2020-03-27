import { Component, OnInit, OnDestroy, Input } from '@angular/core'

@Component({
    styles: [`

    `],
    templateUrl: './document.html'
})


export class DocumentProvider implements OnInit, OnDestroy {
    file: any;
    constructor() {

    }

    ngOnInit() {
        this.file = {
            view: 'staff'
        }
    }

    ngOnDestroy() {

    }
}