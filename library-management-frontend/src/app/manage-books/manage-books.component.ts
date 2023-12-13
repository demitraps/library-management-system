import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ApiService } from '../services/api.service';

/**
 * ManageBooksComponent handles the management of books, including adding and deleting books.
 */
@Component({
  selector: 'manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss'],
})
export class ManageBooksComponent {
  /** Form group for adding books, containing title, author, category, subcategory, and price controls. */
  addBookForm: FormGroup;
  /** Form control for deleting books, containing book ID to be deleted. */
  deleteBookForm: FormControl;

  /** Message to display after successfully adding a book. */
  addMsg: string = '';
  /** Message to display after successfully deleting a book. */
  delMsg: string = '';

  /**
   * Constructs the ManageBooksComponent with FormBuilder and ApiService dependencies.
   * Initializes the addBookForm and deleteBookForm with their respective controls and validators.
   * @param fb - FormBuilder instance for creating reactive forms.
   * @param api - ApiService instance for interacting with the backend API.
   */
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.addBookForm = fb.group({
      title: fb.control('', [Validators.required]),
      author: fb.control('', [Validators.required]),
      category: fb.control('', [Validators.required]),
      subcategory: fb.control('', [Validators.required]),
      price: fb.control('', [Validators.required]),
    });

    this.deleteBookForm = fb.control('', [Validators.required]);
  }

  /**
   * Inserts a new book by collecting user input, making an API call, and processing the response.
   */
  insertBook() {
    let book = {
      id: 0,
      title: this.Title.value,
      category: {
        category: this.Category.value,
        subCategory: this.Subcategory.value,
      },
      price: this.Price.value,
      available: true,
      author: this.Author.value,
    };
    this.api.insertBook(book).subscribe({
      next: (res: any) => {
        this.addMsg = 'Book Inserted';
        setInterval(() => (this.addMsg = ''), 5000);
        this.Title.setValue('');
        this.Author.setValue('');
        this.Category.setValue('');
        this.Subcategory.setValue('');
        this.Price.setValue('');
      },
      error: (err: any) => console.log(err),
    });
  }

  /**
   * Deletes a book by collecting user input, making an API call, and processing the response.
   */
  deleteBook() {
    let id: number = parseInt(this.deleteBookForm.value);

    this.api.deleteBook(id).subscribe({
      next: (res: any) => {
        if (res === 'success') {
          this.delMsg = 'Book Deleted';
        } else {
          this.delMsg = 'Book not found!';
        }
        setInterval(() => (this.delMsg = ''), 5000);
      },
      error: (err: any) => console.log(err),
    });
  }

  /** Gets the title FormControl from the addBookForm. */
  get Title(): FormControl {
    return this.addBookForm.get('title') as FormControl;
  }

  /** Gets the author FormControl from the addBookForm. */
  get Author(): FormControl {
    return this.addBookForm.get('author') as FormControl;
  }

  /** Gets the category FormControl from the addBookForm. */
  get Category(): FormControl {
    return this.addBookForm.get('category') as FormControl;
  }

  /** Gets the subcategory FormControl from the addBookForm. */
  get Subcategory(): FormControl {
    return this.addBookForm.get('subcategory') as FormControl;
  }

  /** Gets the price FormControl from the addBookForm. */
  get Price(): FormControl {
    return this.addBookForm.get('price') as FormControl;
  }
}
