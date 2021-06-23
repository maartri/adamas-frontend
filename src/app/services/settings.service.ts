import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TimeSheetService } from '@services/timesheet.service';
import { GlobalService } from '@services/global.service';

@Injectable()
export class SettingsService {

    constructor(
        private timeS: TimeSheetService,
        private globalS: GlobalService
    ) { 

    }

    getSettings(name: any) {
        this.timeS.getusersettings(name).subscribe(data => {
            this.globalS.settings = data;
            console.log(data);
        });
    }

    getSettingsObservable(name: any){
        return this.timeS.getusersettings(name);
    }
    
    VERIFY_OUTPUT(value: string): boolean {
        if (!value) return false;

        let _value = value.toLowerCase();
        if (_value == 'true') return true;
        return false;
    }
    
    //allowBooking
    ALLOWBOOKING(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.allowBooking);
    }

    ALLOWCASENOTE(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.allowCaseNote);
    }
    
    CANCHOOSEPROVIDER(): boolean{
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canChooseProvider);
    }

    CANSEEPROVIDERGENDER(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canSeeProviderGender);
    }

    //canSeeProviderPhoto
    CANSEEPROVIDERPHOTO(): boolean{
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canSeeProviderPhoto);
    }

    //canSeeProviderAge
    CANSEEPROVIDERAGE(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canSeeProviderAge);
    }

    //canSeeProviderReviews
    CANESEEPROVIDERREVIEWS(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canSeeProviderReviews);
    }

    
    
    ALLOWMARKETING(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.allowsMarketing);
    }

    BOOKINGLEADTIME(): number{
        let settings: any = this.globalS.settings;
        if (!settings) return 0;

        return settings.bookingLeadTime ? parseInt(settings.bookingLeadTime) + 1 : 1;
    }

    CANMANAGESERVICES(): boolean{
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canManageServices);
    }

    CANMANAGEPREFERENCES(): boolean{
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canManagePreferences);
    }

    VIEWPACKAGESTATEMENT(): boolean{
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.viewPackageStatement);
    }


    CANQUERYSERVICE(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canQueryService);
    }

    CANCANCELSERVICE(): boolean {
        let settings: any = this.globalS.settings;
        if (!settings) return false;

        return this.VERIFY_OUTPUT(settings.canCancelService);
    }

    
}