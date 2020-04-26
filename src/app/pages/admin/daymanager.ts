import { Component, OnInit, OnDestroy, Input } from '@angular/core'

@Component({
    styles: [`
    .dm-input{
        margin-bottom:1rem;
    }
    `],
    templateUrl: './daymanager.html'
})


export class DayManagerAdmin implements OnInit, OnDestroy {
    date: any = new Date();
    dayView: number = 7;
    dayViewArr: Array<number> = [5, 7, 10, 14];
    reload: boolean = false;
    toBePasted: Array<any>;

    constructor() {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    showDetail(data: any) {
        console.log(data);
    }

    showOptions(data: any) {
        console.log(data);
    }

    highlighted(data: any) {

    }

    data(data: any) {

    }

    pasted(data: any) {

    }

}