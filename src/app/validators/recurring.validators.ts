import { AbstractControl, ValidatorFn } from '@angular/forms';

export function recurringValidator(recurring, dependent): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (recurring && !dependent) {
            return { 'forbiddenName': { value: control.value }}
        } else 
            return null        
    };
}