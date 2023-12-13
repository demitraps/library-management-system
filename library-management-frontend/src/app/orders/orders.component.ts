import { Component, OnInit } from '@angular/core';
import { Order } from '../models/models';
import { ApiService } from '../services/api.service';

/**
 * OrdersComponent handles the display and filtering of all orders.
 */
@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  /** List of all orders to be displayed. */
  listOfOrders: Order[] = [];
  /** Filtered orders to be displayed based on the user's selection. */
  ordersToDisplay: Order[] = [];
  /** Columns to be displayed in the order table. */
  columns: string[] = [
    'id',
    'userid',
    'name',
    'bookid',
    'book',
    'date',
    'returned',
  ];

  /**
   * Constructs the OrdersComponent with the ApiService dependency.
   * @param api - ApiService instance for interacting with the backend API.
   */
  constructor(private api: ApiService) {}

  /**
   * Initializes the component by fetching all orders from the backend API.
   */
  ngOnInit(): void {
    this.api.getAllOrders().subscribe({
      next: (res: Order[]) => {
        this.listOfOrders = res;
        this.ordersToDisplay = this.listOfOrders;
      },
      error: (err: any) => console.log(err),
    });
  }

  /**
   * Filters the orders based on the user's selection.
   * @param value - The filter value selected by the user ('all', 'pending', or 'returned').
   */
  filter(value: string) {
    if (value === 'all') {
      this.ordersToDisplay = this.listOfOrders.filter((value) => value);
    } else if (value === 'pen') {
      this.ordersToDisplay = this.listOfOrders.filter(
        (value) => value.returned == false
      );
    } else {
      this.ordersToDisplay = this.listOfOrders.filter(
        (value) => value.returned
      );
    }
  }
}
