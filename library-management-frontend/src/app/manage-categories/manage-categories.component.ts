import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';

/**
 * ManageCategoriesComponent handles the management of book categories, including adding new categories.
 */
@Component({
  selector: 'manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
})
export class ManageCategoriesComponent {
  /** Form group for managing categories, containing category and subcategory controls. */
  categoryForm: FormGroup;
  /** Message to display after adding a new category. */
  msg: string = '';

  /**
   * Constructs the ManageCategoriesComponent with FormBuilder and ApiService dependencies.
   * Initializes the categoryForm with category and subcategory controls.
   * @param fb - FormBuilder instance for creating reactive forms.
   * @param api - ApiService instance for interacting with the backend API.
   */
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.categoryForm = this.fb.group({
      category: this.fb.control(''),
      subcategory: this.fb.control(''),
    });
  }

  /**
   * Adds a new category by collecting user input, making an API call, and processing the response.
   */
  addNewCategory() {
    let c = this.Category.value;
    let s = this.Subcategory.value;

    this.api.insertCategory(c, s).subscribe({
      next: (res: any) => {
        this.msg = res.toString();
        setInterval(() => (this.msg = ''), 5000);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  /** Gets the category FormControl from the categoryForm. */
  get Category(): FormControl {
    return this.categoryForm.get('category') as FormControl;
  }
  
  /** Gets the subcategory FormControl from the categoryForm. */
  get Subcategory(): FormControl {
    return this.categoryForm.get('subcategory') as FormControl;
  }
}
