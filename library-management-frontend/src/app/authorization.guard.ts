import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserType } from './models/models';
import { ApiService } from './services/api.service';

/**
 * Guard to restrict access to routes based on user authorization.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(private api: ApiService) {}
  /**
   * Determines whether the user is authorized to access the route.
   * @param route The route snapshot.
   * @param state The router state snapshot.
   * @returns A boolean indicating whether the user is authorized to access the route.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.api.isLoggedIn()) {
      if (this.api.getTokenUserInfo()?.userType === UserType.ADMIN) {
        return true;
      }
      return false;
    }
    return false;
  }
}
