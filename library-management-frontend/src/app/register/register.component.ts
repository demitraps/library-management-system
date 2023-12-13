import { Component } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User, UserType } from '../models/models';
import { ApiService } from '../services/api.service';

/**
 * Represents the user registration component.
 */
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  /** Toggles visibility of the password input. */
  hide = true;
  /** Response message from the registration attempt. */
  responseMsg: string = '';
  /** Form group for user registration. */
  registerForm: FormGroup;

  /**
   * Creates an instance of RegisterComponent.
   *
   * @param fb - FormBuilder for creating reactive forms.
   * @param api - ApiService for interacting with the API.
   */
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.registerForm = fb.group(
      {
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        rpassword: fb.control(''),
      },
      {
        validators: [repeatPasswordValidator],
      } as AbstractControlOptions
    );
  }

  /**
   * Handles the registration attempt by sending user data to the API.
   */
  register() {
    let user: User = {
      id: 0,
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      userType: UserType.USER,
      mobile: '',
      password: this.registerForm.get('password')?.value,
      blocked: false,
      active: false,
      createdOn: '',
      fine: 0,
    };
    console.log(user);
    this.api.createAccount(user).subscribe({
      next: (res: any) => {
        console.log(res);
        this.responseMsg = res.toString();
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });
  }

  /**
   * Retrieves error message for the first name field.
   *
   * @returns The error message for the first name field.
   */
  getFirstNameErrors() {
    if (this.FirstName.hasError('required')) return 'Field is required.';
    return '';
  }

  /**
   * Retrieves error message for the last name field.
   *
   * @returns The error message for the last name field.
   */
  getLastNameErrors() {
    if (this.LastName.hasError('required')) return 'Field is required.';
    return '';
  }

  /**
   * Retrieves error message for the email field.
   *
   * @returns The error message for the email field.
   */
  getEmailErrors() {
    if (this.Email.hasError('required')) return 'Email is required.';
    if (this.Email.hasError('email')) return 'Email is invalid.';
    return '';
  }

  /**
   * Retrieves error message for the password field.
   *
   * @returns The error message for the password field.
   */
  getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Password is required.';
    if (this.Password.hasError('minlength'))
      return 'Minimum 8 characters are required.';
    if (this.Password.hasError('maxlength'))
      return 'Maximum 15 characters are required.';
    return '';
  }

  /** Retrieves the form control for the first name field. */
  get FirstName(): FormControl {
    return this.registerForm.get('firstName') as FormControl;
  }

  /** Retrieves the form control for the last name field. */
  get LastName(): FormControl {
    return this.registerForm.get('lastName') as FormControl;
  }

  /** Retrieves the form control for the email field. */
  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  /** Retrieves the form control for the password field. */
  get Password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  /** Retrieves the form control for the repeated password field. */
  get RPassword(): FormControl {
    return this.registerForm.get('rpassword') as FormControl;
  }
}

/**
 * Validator function to check if the password and repeated password fields match.
 *
 * @param control - The form group containing password and repeated password fields.
 * @returns ValidationErrors or null if the passwords match or not.
 */
export const repeatPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pwd = control.get('password')?.value;
  const rpwd = control.get('rpassword')?.value;
  if (pwd === rpwd) {
    control.get('rpassword')?.setErrors(null);
    return null;
  } else {
    control.get('rpassword')?.setErrors({ rpassword: true });
    return { rpassword: true };
  }
};
