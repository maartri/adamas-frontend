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
            // this.router.navigate(['/admin/destination-address']);
        }
    }  
}
//ConfigurationAdmin 