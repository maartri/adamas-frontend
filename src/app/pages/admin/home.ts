import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    styles: [`
      .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

nz-header {
    background: #fff;
    padding: 0;
}

nz-content {
    margin: 0 16px;
}

nz-breadcrumb {
    margin: 16px 0;
}

.inner-content {
    padding: 24px;
    background: #fff;
    min-height: 360px;
}

nz-footer {
    text-align: center;
}

nz-layout{
    height:100vh;
}



.nz-avatar-menu{
    display: inline-block;
    margin-right: 1rem;
}
nz-avatar{
    cursor:pointer;
    background-color:#87d068;
}
.dropdown{
    position: absolute;
    right: 7px;
    width: 8rem;
    background: #fff;
    border: 1px solid #6161611a;
    z-index: 10;
}
.dropdown ul{
    list-style:none;
    padding:0;
    margin:0;
}
.dropdown ul li{
    line-height:2.5rem;
    cursor:pointer;
    text-align:center;
}
.dropdown ul li i{
    margin-right:10px;
}
.dropdown ul li:hover{
    background: #f9f9f9;
}
.menu-button{
    text-align:right;
}

.main-list > li >>> div{
    font-size:12px;
}
.items li{
    height: 28px;
    line-height: 30px;
    font-size: 12px;
    margin:0;
}
.items li.ant-menu-submenu .ant-menu-submenu-title{    
    line-height: 30px;
    font-size: 12px;
}
.recipient{
    background: inherit;
    position: absolute;
    top: -11rem;
}
.others{
    background: inherit;
    position: absolute;
    top: -11rem;
}
.fix-to-top{
    background: inherit;
    position: absolute;
    top: -2rem;
}
    `],
    templateUrl: './home.html'
})


export class HomeAdmin implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('recipient') elRef: ElementRef;

    isCollapsed = false;
    constructor(
        private router: Router
    ) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void{
       
    }

    toHome() {
        this.router.navigate(['/admin/landing']);
    }

    change(event: any) {
        if (event) {
            var x = document.getElementById('cdk-overlay-2');
            console.log(x);
        }
        //document.getElementById('cdk-overlay-2').style.top = '100px !important';
    }
}