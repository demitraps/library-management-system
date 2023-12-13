import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';

/**
 * Represents the component for returning a book.
 */
@Component({
  selector: 'return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.scss'],
})
export class ReturnBookComponent {
  /** The status message for the return operation. */
  status: string = '';
  /** Form group for returning a book. */
  bookForm: FormGroup;

  /**
   * Creates an instance of ReturnBookComponent.
   *
   * @param api - ApiService for interacting with the API.
   * @param fb - FormBuilder for creating reactive forms.
   */
  constructor(private api: ApiService, private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      bookId: fb.control('', [Validators.required]),
      userId: fb.control('', [Validators.required]),
    });
  }

  /**
   * Handles the book return operation by sending book and user information to the API.
   */
  returnBook() {
    let book = (this.bookForm.get('bookId') as FormControl).value;
    let user = (this.bookForm.get('userId') as FormControl).value;
    this.api.returnBook(book, user).subscribe({
      next: (res: any) => {
        if (res === 'success') this.status = 'Book Returned!';
        else this.status = res;
      },
      error: (err: any) => console.log(err),
    });
  }
}
