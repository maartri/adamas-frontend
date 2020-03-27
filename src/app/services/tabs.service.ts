import { Injectable } from '@angular/core'


@Injectable({
    providedIn: 'root'
})

export class TabService {

    getName(){
        return 'Mark Aris Trinidad'
    }
}