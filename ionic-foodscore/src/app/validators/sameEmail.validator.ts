import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function sameEmail(emailCompare: FormControl): ValidatorFn {
  return (email: AbstractControl): ValidationErrors | null => {
    if (emailCompare.value !== email.value) {
      console.log(emailCompare.value + '---' + email.value);
      return { sameEmail: true };
    }

    return null;
  };
}
