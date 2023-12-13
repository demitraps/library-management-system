import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

/**
 * Route guard that checks if the user is logged in before allowing access to a route.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  /**
   * Constructor to inject the ApiService dependency.
   * @param api - An instance of the ApiService to check the user's login status.
   */
  constructor(private api: ApiService) {}

  /**
   * CanActivate method to determine whether a route can be activated.
   * @param route - The activated route snapshot.
   * @param state - The router state snapshot.
   * @returns An observable, promise, boolean, or UrlTree indicating whether the route can be activated.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.api.isLoggedIn();
  }
}
