import { Component } from '@angular/core';

@Component({
    selector: '',
    templateUrl: './home.html',
    styles: [
        `
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
        `
    ]
})

export class HomeProvider {

    isCollapsed = false;
}