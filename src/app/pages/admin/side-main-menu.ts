import { Component, OnInit, OnDestroy, Input } from '@angular/core'

@Component({
    styles: [`
      .bg{
        height: 80vh;
      }
      .landing-container{
        display: grid;
        grid-template-columns: minmax(min-content, 1fr) minmax(min-content, 1fr) minmax(min-content, 1fr);
        grid-gap: 1rem;
        width: 50%;
        margin: 0 auto;
        padding-top: 5%;
      }
      figure{
        min-width:4rem;
        background-color:#85B9D5;
        color:#fff;
        border-radius: 3px;
        padding: 20px;
        font-size: 30px;
        text-align: center;
        margin:0;
        position: relative;
        height: 8rem;
        cursor:pointer;
      }
      figure:hover{
        background-color: #2466b9;
        color:#fff;
        -webkit-transition: background-color 300ms linear;
        -ms-transition: background-color 300ms linear;
        transition: background-color 300ms linear;
      }
      figure i,span{
        font-size: 2.7rem;
      }
      figcaption{
        font-size: 1.12rem;
        position: absolute;
        bottom: 1rem;
        left: 0;
        right: 0;
      }
    `],
    templateUrl: './side-main-menu.html'
})


export class SideMainMenu implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }
}