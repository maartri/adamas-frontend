import { Component } from '@angular/core'
import { Router } from '@angular/router';


@Component({
    host: {
        '[style.display]': 'flex',
        '[style.flex-direction]': 'column',
        '[style.overflow]': 'hidden'
      },
    styles: [`
        
        button {
            width: 200pt !important;
            text-align: left !important;
        }
        .btn{
            border:none;
            cursor:pointer;
            outline:none;
            transition: background-color 0.5s ease;
            padding: 5px 7px;
            border-radius: 3px;
            text-align: center !important;
            width: 100px !important;
        }
        label{
            font-weight: bold; 
        }
        
        .form-group label{
            font-weight: bold;
        }
        nz-select{
            width:100%;
            x
        }
        label.checks{
            margin-top: 4px;
            font-weight: 300 !important;
        }
        nz-date-picker{
            margin:5pt;
        }
        
    `],
    templateUrl: './configuration.html'
})
export class ConfigurationAdmin   {
    
    drawerVisible: boolean = false;
    
    tabset = false;
    isVisibleTop =false;
    showtabother = false;
    showtabRostcriteria= false;
    showtabstaffcriteria= false;
    showtabRegcriteria= false;
    showtabrecpcriteria = false;
    show =false ;
    showoption = true;
    tryDoctype: any;
    
    constructor(private router: Router)
    {
        
    }
    handleCancelTop(): void {
        this.isVisibleTop = false;
        this.drawerVisible = false;
    }
    onChange(result: Date): void {
        console.log('onChange: ', result);
    }  
    view(index: number) {
        console.log(index);
        if (index == 0) {
            this.router.navigate(['/admin/branches'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/funding-region'])
        }
        if(index == 2){
            this.router.navigate(['/admin/claim-rates'])
        }
        if(index == 3){
            this.router.navigate(['/admin/target-groups'])
        }
        if(index == 4 ){
            this.router.navigate(['/admin/purpose-statement']);
        }
        if(index == 5){
            this.router.navigate(['/admin/budget-groups']);
        }
        if(index == 6){
            this.router.navigate(['/admin/budgets']);
        }
        if(index == 8){
            this.router.navigate(['/admin/contact-groups']);
        }
        if(index == 9){
            this.router.navigate(['/admin/contact-types']);
        }
        if(index == 10){
            this.router.navigate(['/admin/address-types']);
        }
        if(index == 11){
            this.router.navigate(['/admin/phone-email-types']);
        }
        if(index == 12){
            this.router.navigate(['/admin/occupations']);
        }
        if(index == 13){
            this.router.navigate(['/admin/religions']);
        }
        if(index == 14){
            this.router.navigate(['/admin/financial-class']);
        }
        if(index == 15){
            this.router.navigate(['/admin/postcodes']);
        }
        if(index == 16){
            this.router.navigate(['/admin/holidays']);
        }
        if(index == 17){
            this.router.navigate(['/admin/medical-contact']);
        }
        if(index == 18){
            this.router.navigate(['/admin/destination-address']);
        }
        if(index == 19){
            this.router.navigate(['/admin/program-coordinates']);
        }
        if(index == 20){
            this.router.navigate(['/admin/distribution-list']);
        }
        if(index == 21){
            this.router.navigate(['/admin/initial-actions']);
        }
        if(index == 22){
            this.router.navigate(['/admin/ongoing-actions']);
        }
        if(index == 23){
            this.router.navigate(['/admin/incident-sub-category']);
        }
        if(index == 24){
            this.router.navigate(['/admin/incident-trigger']);
        }
        if(index == 25){
            this.router.navigate(['/admin/incident-types']);
        }
        if(index == 26){
            this.router.navigate(['/admin/incident-location-categories']);
        }
        if(index == 27){
            this.router.navigate(['/admin/recipient-incident-note-category']);
        }
        if(index == 28){
            this.router.navigate(['/admin/staff-incident-note-category']);
        }
        if(index == 29){
            this.router.navigate(['/admin/filling-classification']);
        }
        if(index == 30){
            this.router.navigate(['/admin/document-categories']);
        }
        if(index == 31){
            // this.router.navigate(['/admin/document-categories']);
        }
        if(index == 32){
            this.router.navigate(['/admin/recipients-categories']);
        }
        if(index == 33){
            this.router.navigate(['/admin/recipients-groups']);
        }
        if(index == 34){
            this.router.navigate(['/admin/recipients-minor-group']);
        }
        if(index == 35){
            this.router.navigate(['/admin/recipients-billing-cycles']);
        }
        if(index == 36){
            this.router.navigate(['/admin/debtor-terms']);
        }
        if(index == 37){
            this.router.navigate(['/admin/recipient-goals']);
        }
        if(index == 38){
            this.router.navigate(['/admin/consent-types']);
        }
        if(index == 39){
            this.router.navigate(['/admin/care-plan-types']);
        }
        if(index == 40){
            this.router.navigate(['/admin/clicnical-notes-groups']);
        }
        if(index == 41){
            this.router.navigate(['/admin/case-notes-categories']);
        }
        if(index == 42){
            this.router.navigate(['/admin/op-notes-categories']);
        }
        if(index == 43){
            this.router.navigate(['/admin/care-domains']);
        }
        if(index == 44){
            this.router.navigate(['/admin/discharge-reasons']);
        }
        if(index == 45){
            this.router.navigate(['/admin/refferal-reasons'])
        }
        if(index == 46){
            this.router.navigate(['/admin/user-define-reminders'])
        }
        if(index == 47){
            this.router.navigate(['/admin/recipient-prefrences'])
        }
        if(index == 48){
            this.router.navigate(['/admin/mobility-codes'])
        }
        if(index == 49){
            this.router.navigate(['/admin/tasks'])
        }
        if(index == 50){
            this.router.navigate(['/admin/health-conditions'])
        }
        if(index == 51){
            this.router.navigate(['/admin/medications'])
        }
        if(index == 52){
            this.router.navigate(['/admin/nursing-dignosis'])
        }
        if(index == 53){
            this.router.navigate(['/admin/medical-dignosis'])
        }
        if(index == 54){
            this.router.navigate(['/admin/medical-procedures'])
        }
        if(index == 55){
            this.router.navigate(['/admin/clinical-reminders'])
        }
        if(index == 56){
            this.router.navigate(['/admin/clinical-alerts'])
        }
        if(index == 57){
            this.router.navigate(['/admin/admitting-priorities']);
        }
        if(index == 58){
            this.router.navigate(['/admin/service-not-categories']);
        }
        if(index == 59){
            this.router.navigate(['/admin/referral-sources']);
        }
        if(index == 60){
            this.router.navigate(['/admin/lifecycle-events']);
        }
        if(index == 61){
            this.router.navigate(['/admin/job-category']);
        }
        if(index == 62){
            this.router.navigate(['/admin/admin-category']);
        }
        if(index == 63){
            this.router.navigate(['/admin/user-groups']);
        }
        if(index == 64){
            this.router.navigate(['/admin/staff-positions']);
        }
        if(index == 65){
            this.router.navigate(['/admin/staff-teams']);
        }
        if(index == 66){
            this.router.navigate(['/admin/award-levels']);
        }
        if(index == 67){
            this.router.navigate(['/admin/award-details']);
        }
        if(index == 68){
            this.router.navigate(['/admin/competency-groups']);
        }
        if(index == 69){
            this.router.navigate(['/admin/staff-competency']);
        }
        if(index == 70){
            this.router.navigate(['/admin/hr-notes-categories']);
        }
        if(index == 71){
            this.router.navigate(['/admin/op-staff-notes']);
        }
        if(index == 72){
            this.router.navigate(['/admin/staff-reminder']);
        }
        if(index == 73){
            this.router.navigate(['/admin/service-deciplines']);
        }
        if(index == 74){
            this.router.navigate(['/admin/leave-description']);
        }
        if(index == 75){
            this.router.navigate(['/admin/staff-preferences']);
        }
        if(index == 76){
            this.router.navigate(['/admin/service-note-categories']);
        }
        if(index == 77){
            this.router.navigate(['/admin/vehicles']);
        }
        if(index == 78){
            this.router.navigate(['/admin/activity-groups']);
        }
        if(index == 79){
            this.router.navigate(['/admin/equipments']);
        }
        if(index == 80){
            this.router.navigate(['/admin/center-facility-location']);
        }
        if(index == 81){
            this.router.navigate(['/admin/funding-sources']);
        }
        if(index == 82){
            this.router.navigate(['/admin/pay-types']);
        }
        if(index == 83){
            this.router.navigate(['/admin/program-packages']);
        }
        if(index == 84){
            this.router.navigate(['/admin/services']);
        }
        if(index == 85){
            this.router.navigate(['/admin/items-consumables']);
        }
        if(index == 86){
            this.router.navigate(['/admin/menu-meals']);
        }
        if(index == 87){
            this.router.navigate(['/admin/case-management-admin']);
        }
    }  
}
//ConfigurationAdmin 