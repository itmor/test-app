import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    public validate(form: UntypedFormGroup | UntypedFormArray): boolean {
        if (form instanceof UntypedFormGroup) {
            const formControls = (form.controls as { [key: string]: AbstractControl<any, any> });
            this.processControls(formControls);
        } else if (form instanceof UntypedFormArray) {
            const formControls = (form.controls as AbstractControl<any, any>[]);
            formControls.forEach(control => this.validateControl(control));
        }

        return form.valid;
    }

    private processControls(controls: { [key: string]: AbstractControl<any, any> }): void {
        Object.keys(controls).forEach((controlName) => {
            const control = controls[controlName];
            if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
                this.validate(control);
            }
            this.validateControl(control);
        });
    }

    private validateControl(control: AbstractControl): boolean {
        control.markAsTouched();
        control.markAsDirty();
        return control.valid;
    }
}
