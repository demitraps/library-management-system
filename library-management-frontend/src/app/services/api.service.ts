import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Book, Category, Order, User, UserType } from '../models/models';

/**
 * Service for interacting with the API.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /** Base URL of the API. */
  baseUrl = 'https://localhost:7025/api/Library/';

  /**
   * Creates an instance of ApiService.
   *
   * @param http - HttpClient for making HTTP requests.
   * @param jwt - JwtHelperService for decoding JWT tokens.
   */
  constructor(private http: HttpClient, private jwt: JwtHelperService) {}

  /**
   * Creates a new user account.
   *
   * @param user - User information to create an account.
   * @returns Observable with the response text.
   */
  createAccount(user: User) {
    return this.http.post(this.baseUrl + 'CreateAccount', user, {
      responseType: 'text',
    });
  }

  /**
   * Logs in a user.
   *
   * @param loginInfo - Object containing email and password for login.
   * @returns Observable with the response text.
   */
  login(loginInfo: any) {
    let params = new HttpParams()
      .append('email', loginInfo.email)
      .append('password', loginInfo.password);
    return this.http.get(this.baseUrl + 'Login', {
      params: params,
      responseType: 'text',
    });
  }

  /**
   * Saves the JWT token to the local storage.
   *
   * @param token - JWT token to be saved.
   */
  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  /**
   * Checks if a user is logged in.
   *
   * @returns True if a user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Deletes the JWT token from the local storage and reloads the page.
   */
  deleteToken() {
    localStorage.removeItem('access_token');
    location.reload();
  }

  /**
   * Gets the user information from the decoded JWT token.
   *
   * @returns User object or null if not logged in.
   */
  getTokenUserInfo(): User | null {
    if (!this.isLoggedIn()) return null;
    let token = this.jwt.decodeToken();
    let user: User = {
      id: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      email: token.email,
      mobile: token.mobile,
      password: '',
      blocked: token.blocked.toLowerCase() === 'true',
      active: token.active.toLowerCase() === 'true',
      createdOn: token.createdAt,
      fine: 0,
      userType: token.userType === 'USER' ? UserType.USER : UserType.ADMIN,
    };
    return user;
  }

  /**
   * Gets all books from the API.
   *
   * @returns Observable with the list of books.
   */
  getAllBooks() {
    return this.http.get<Book[]>(this.baseUrl + 'GetAllBooks');
  }

  /**
   * Places an order for a book.
   *
   * @param userId - ID of the user placing the order.
   * @param bookId - ID of the book to be ordered.
   * @returns Observable with the response text.
   */
  orderBook(userId: number, bookId: number) {
    return this.http.get(this.baseUrl + 'OrderBook/' + userId + '/' + bookId, {
      responseType: 'text',
    });
  }

  /**
   * Gets the orders of a specific user from the API.
   *
   * @param userid - ID of the user.
   * @returns Observable with the list of orders.
   */
  getOrdersOfUser(userid: number) {
    return this.http.get<Order[]>(this.baseUrl + 'GetOrders/' + userid);
  }

  /**
   * Gets all orders from the API.
   *
   * @returns Observable with the list of all orders.
   */
  getAllOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'GetAllOrders');
  }

  /**
   * Returns a book to the library.
   *
   * @param bookId - ID of the book to be returned.
   * @param userId - ID of the user returning the book.
   * @returns Observable with the response text.
   */
  returnBook(bookId: string, userId: string) {
    return this.http.get(this.baseUrl + 'ReturnBook/' + bookId + '/' + userId, {
      responseType: 'text',
    });
  }

  /**
   * Gets all users from the API.
   *
   * @returns Observable with the list of users.
   */
  getAllUsers() {
    return this.http.get<User[]>(this.baseUrl + 'GetAllUsers').pipe(
      map((users) =>
        users.map((user) => {
          let temp: User = user;
          temp.userType = user.userType == 0 ? UserType.USER : UserType.ADMIN;
          return temp;
        })
      )
    );
  }

  /**
   * Blocks a user by changing the block status.
   *
   * @param id - ID of the user to be blocked.
   * @returns Observable with the response text.
   */
  blockUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeBlockStatus/1/' + id, {
      responseType: 'text',
    });
  }

  /**
   * Unblocks a user by changing the block status.
   *
   * @param id - ID of the user to be unblocked.
   * @returns Observable with the response text.
   */
  unblockUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeBlockStatus/0/' + id, {
      responseType: 'text',
    });
  }

  /**
   * Enables a user by changing the enable status.
   *
   * @param id - ID of the user to be enabled.
   * @returns Observable with the response text.
   */
  enableUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeEnableStatus/1/' + id, {
      responseType: 'text',
    });
  }

  /**
   * Disables a user by changing the enable status.
   *
   * @param id - ID of the user to be disabled.
   * @returns Observable with the response text.
   */
  disableUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeEnableStatus/0/' + id, {
      responseType: 'text',
    });
  }

  /**
   * Gets all categories from the API.
   *
   * @returns Observable with the list of categories.
   */
  getCategories() {
    return this.http.get<Category[]>(this.baseUrl + 'GetAllCategories');
  }

  /**
   * Inserts a new book into the library.
   *
   * @param book - Book information to be inserted.
   * @returns Observable with the response text.
   */
  insertBook(book: any) {
    return this.http.post(this.baseUrl + 'InsertBook', book, {
      responseType: 'text',
    });
  }

  /**
   * Deletes a book from the library.
   *
   * @param id - ID of the book to be deleted.
   * @returns Observable with the response text.
   */
  deleteBook(id: number) {
    return this.http.delete(this.baseUrl + 'DeleteBook/' + id, {
      responseType: 'text',
    });
  }

  /**
   * Inserts a new category into the library.
   *
   * @param category - Category name.
   * @param subcategory - Subcategory name.
   * @returns Observable with the response text.
   */
  insertCategory(category: string, subcategory: string) {
    return this.http.post(
      this.baseUrl + 'InsertCategory',
      { category: category, subCategory: subcategory },
      { responseType: 'text' }
    );
  }
}
