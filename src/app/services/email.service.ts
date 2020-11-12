import { Injectable } from '@angular/core'
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { EmailMessage } from '@modules/modules';

const email: string = "api/email"
@Injectable()
export class EmailService {

    constructor(
        private auth: AuthService
    ){  }

    sendMail(message: EmailMessage = null): Observable<any>{
        return this.auth.post(`${email}/email`, message);
    }

    
}