import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

/**
 * LoginComponent handles user authentication and login functionality.
 */
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  /** Boolean flag to toggle password visibility in the login form. */
  hide = true;
  /** Form group for the login form containing email and password controls. */
  loginForm: FormGroup;
  /** Response message to display login outcomes. */
  responseMsg: string = '';

  /**
   * Constructs the LoginComponent with FormBuilder, ApiService, and Router dependencies.
   * Initializes the login form with email and password controls and their respective validators.
   * @param fb - FormBuilder instance for creating reactive forms.
   * @param api - ApiService instance for interacting with the backend API.
   * @param router - Router instance for navigating to different routes.
   */
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]),
    });
  }

  /**
   * Handles the login process by collecting user input, making an API call, and processing the response.
   */
  login() {
    let loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.api.login(loginInfo).subscribe({
      next: (res: any) => {
        if (res.toString() === 'Invalid')
          this.responseMsg = 'Invalid Credentials.';
        else {
          this.responseMsg = '';
          this.api.saveToken(res.toString());
          let isActive = this.api.getTokenUserInfo()?.active ?? false;
          if (isActive) this.router.navigateByUrl('/books/library');
          else {
            this.responseMsg = 'Your account is not activated.';
            this.api.deleteToken();
          }
        }
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });
  }

  /**
   * Gets error messages related to the email field for display in the template.
   * @returns Error message string.
   */
  getEmailErrors() {
    if (this.Email.hasError('required')) return 'Email is required.';
    if (this.Email.hasError('email')) return 'Email is invalid.';
    return '';
  }

  /**
   * Gets error messages related to the password field for display in the template.
   * @returns Error message string.
   */
  getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Password is required.';
    if (this.Password.hasError('minlength'))
      return 'Minimum 8 characters are required.';
    if (this.Password.hasError('maxlength'))
      return 'Maximum 15 characters are required.';
    return '';
  }

  /**
   * Gets the email FormControl from the login form.
   * @returns Email FormControl.
   */
  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  /**
   * Gets the password FormControl from the login form.
   * @returns Password FormControl.
   */
  get Password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
