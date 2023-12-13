import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../services/api.service';

/**
 * PageHeaderComponent represents the header section of the application page.
 */
@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  /** Event emitter for handling menu click events. */
  @Output() menuClicked = new EventEmitter<boolean>();

  /**
   * Constructs the PageHeaderComponent with the ApiService dependency.
   * @param api - ApiService instance for interacting with the backend API.
   */
  constructor(public api: ApiService) {}

  /**
   * Logs out the user by deleting the authentication token.
   */
  logOut() {
    this.api.deleteToken();
  }
}
