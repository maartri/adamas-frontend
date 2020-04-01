import { Injectable } from '@angular/core'
import { Router, CanDeactivate } from '@angular/router'
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

export interface GenericComponent {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<GenericComponent> {

    constructor(
        private globalS: GlobalService,
        private router: Router
    ) {

    }

    canDeactivate(component: GenericComponent) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}