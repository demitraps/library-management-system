import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface TableElement {
  name: string;
  value: string | undefined;
}

/**
 * Represents the user profile component displaying user information.
 */
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  /** Table data source for user information. */
  dataSource: TableElement[] = [];
  /** Columns to be displayed in the profile table. */
  columns: string[] = ['name', 'value'];

  /**
   * Creates an instance of ProfileComponent.
   *
   * @param api - ApiService for interacting with the API.
   */
  constructor(private api: ApiService) {}

  /**
   * Initializes the profile component with user information.
   */
  ngOnInit() {
    let user = this.api.getTokenUserInfo();

    this.dataSource = [
      { name: 'Name', value: user?.firstName + ' ' + user?.lastName },
      { name: 'Email', value: user?.email ?? '' },
      { name: 'Mobile', value: user?.mobile },
      { name: 'Blocked', value: this.blockedStatus() },
      { name: 'Active', value: this.activeStatus() },
    ];
  }

  /**
   * Determines the blocked status of the user's account.
   *
   * @returns A string indicating the blocked status.
   */
  blockedStatus(): string {
    let blocked = this.api.getTokenUserInfo()!.blocked;
    return blocked ? 'Status: Account BLOCKED' : 'Status: Not blocked.';
  }

  /**
   * Determines the active status of the user's account.
   *
   * @returns A string indicating the active status.
   */
  activeStatus(): string {
    let active = this.api.getTokenUserInfo()!.active;
    return active
      ? 'Status: Account is active.'
      : 'Status: Account is NOT active.';
  }
}
