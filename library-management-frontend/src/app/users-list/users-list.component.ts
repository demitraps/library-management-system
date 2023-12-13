import { Component, OnInit } from '@angular/core';
import { User } from '../models/models';
import { ApiService } from '../services/api.service';

/**
 * Component representing the list of users.
 */
@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  /** Array of User objects representing the list of users. */
  users: User[] = [];
  /** Array of strings representing the columns to display in the user list table. */
  columnsToDisplay: string[] = [
    'id',
    'name',
    'email',
    'mobile',
    'fine',
    'blocked',
    'active',
    'created on',
    'action',
  ];

  /**
   * Constructor for UsersListComponent.
   * @param api - The ApiService for making API requests.
   */
  constructor(private api: ApiService) {}

  /** Lifecycle hook called after component initialization. Retrieves the list of users. */
  ngOnInit(): void {
    this.api.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = [];
        this.users = res;
      },
      error: (err: any) => console.log(err),
    });
  }

  /**
   * Blocks or unblocks a user based on their current blocked status.
   * @param user - The User object to perform the action on.
   */
  blockUser(user: User) {
    if (user.blocked) {
      this.api.unblockUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.blocked = false;
        },
        error: (err: any) => console.log(err),
      });
    } else {
      this.api.blockUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.blocked = true;
        },
        error: (err: any) => console.log(err),
      });
    }
  }

  /**
   * Enables or disables a user based on their current active status.
   * @param user - The User object to perform the action on.
   */
  enableUser(user: User) {
    if (user.active) {
      this.api.disableUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.active = false;
        },
        error: (err: any) => console.log(err),
      });
    } else {
      this.api.enableUser(user.id).subscribe({
        next: (res: any) => {
          if (res === 'success') user.active = true;
        },
        error: (err: any) => console.log(err),
      });
    }
  }
}
