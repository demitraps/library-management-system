import { Component, OnInit } from '@angular/core';
import { Order } from '../models/models';
import { ApiService } from '../services/api.service';

/**
 * OrderComponent handles the display of user orders.
 */
@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  /** List of user orders to be displayed. */
  listOfOrders: Order[] = [];
  /** Columns to be displayed in the order table. */
  columns: string[] = ['id', 'name', 'bookid', 'book', 'date', 'returned'];

  /**
   * Constructs the OrderComponent with the ApiService dependency.
   * @param api - ApiService instance for interacting with the backend API.
   */
  constructor(private api: ApiService) {}

  /**
   * Initializes the component by fetching user orders based on the authenticated user's ID.
   */
  ngOnInit(): void {
    let userid = this.api.getTokenUserInfo()?.id ?? 0;
    this.api.getOrdersOfUser(userid).subscribe({
      next: (res: Order[]) => {
        console.log(res);
        this.listOfOrders = res;
      },
      error: (err: any) => console.log(err),
    });
  }
}
