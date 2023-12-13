import { Component, OnInit } from '@angular/core';
import { Book, CategoryBooks } from '../models/models';
import { ApiService } from '../services/api.service';

/**
 * LibraryComponent is responsible for displaying and managing the library of available books.
 */
@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  /** List of all available books in the library. */
  availableBooks: Book[] = [];
  /** List of books categorized by category and subcategory for display. */
  booksToDisplay: CategoryBooks[] = [];
  /** Columns to be displayed in the book table. */
  displayedColumns: string[] = [
    'id',
    'title',
    'author',
    'price',
    'available',
    'order',
  ];

  /**
   * Constructor to inject the ApiService dependency.
   * @param api - An instance of the ApiService to interact with the backend API.
   */
  constructor(private api: ApiService) {}

  /**
   * Lifecycle hook called after component initialization.
   * Fetches all available books from the API and updates the display list.
   */
  ngOnInit(): void {
    this.api.getAllBooks().subscribe({
      next: (res: Book[]) => {
        this.availableBooks = [];
        console.log(res);
        for (var book of res) this.availableBooks.push(book);
        this.updateList();
      },
      error: (err: any) => console.log(err),
    });
  }

  /**
   * Updates the list of books categorized by category and subcategory.
   */
  updateList() {
    this.booksToDisplay = [];
    for (let book of this.availableBooks) {
      let exist = false;
      for (let categoryBooks of this.booksToDisplay) {
        if (
          book.category === categoryBooks.category &&
          book.subCategory === categoryBooks.subCategory
        )
          exist = true;
      }

      if (exist) {
        for (let categoryBooks of this.booksToDisplay) {
          if (
            book.category === categoryBooks.category &&
            book.subCategory === categoryBooks.subCategory
          )
            categoryBooks.books.push(book);
        }
      } else {
        this.booksToDisplay.push({
          category: book.category,
          subCategory: book.subCategory,
          books: [book],
        });
      }
    }
  }

  /**
   * Calculates and returns the total count of books in the displayed list.
   * @returns The total count of books in the displayed list.
   */
  getBookCount() {
    return this.booksToDisplay.reduce((pv, cv) => cv.books.length + pv, 0);
  }

  /**
   * Searches for books based on the provided value and updates the display list accordingly.
   * @param value - The search value.
   */
  search(value: string) {
    value = value.toLowerCase();
    this.updateList();
    if (value.length > 0) {
      this.booksToDisplay = this.booksToDisplay.filter((categoryBooks) => {
        categoryBooks.books = categoryBooks.books.filter(
          (book) =>
            book.title.toLowerCase().includes(value) ||
            book.author.toLowerCase().includes(value)
        );
        return categoryBooks.books.length > 0;
      });
    }
  }

  /**
   * Handles the order process for a selected book.
   * @param book - The book to be ordered.
   */
  orderBook(book: Book) {
    let userid = this.api.getTokenUserInfo()?.id ?? 0;
    this.api.orderBook(userid, book.id).subscribe({
      next: (res: any) => {
        if (res === 'success') {
          book.available = false;
        }
      },
      error: (err: any) => console.log(err),
    });
  }

  /**
   * Checks whether the current user is blocked.
   * @returns A boolean indicating whether the user is blocked.
   */
  isBlocked() {
    let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return blocked;
  }
}
