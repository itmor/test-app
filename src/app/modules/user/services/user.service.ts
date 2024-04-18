import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

import { LocalstorageKey, LocalStorageService } from '@shared/services/localstorage.service';

import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localStorageService = inject(LocalStorageService);

  getUsers(): Observable<UserModel[]> {
    return of(this.localStorageService.get(LocalstorageKey.Users) as UserModel[]).pipe(delay(500));
  }

  addUser(user: UserModel): Observable<number> {
    const users = this.localStorageService.get(LocalstorageKey.Users) as UserModel[];
    user.id = users.length + 1;
    const isUserNameTaken = users.some((existingUser) => existingUser.userName === user.userName);
    if (isUserNameTaken) {
      return throwError({ control: 'userName', error: 'isUserNameTaken' });
    }

    users.push(user);
    this.localStorageService.set(LocalstorageKey.Users, users);
    return of(user.id).pipe(delay(1000));
  }

  updateUser(user: UserModel): Observable<number> {
    const users = this.localStorageService.get(LocalstorageKey.Users) as UserModel[];
    const index = users.findIndex((u) => u.id === user.id);

    const isUserNameTaken = users.some((u) => u.id !== user.id && u.userName === user.userName);

    if (isUserNameTaken) {
      return throwError({ control: 'userName', error: 'isUserNameTaken' });
    }

    users[index] = user;
    this.localStorageService.set(LocalstorageKey.Users, users);

    return of(user.id).pipe(delay(1000));
  }

  removeUser(userId: number): Observable<number> {
    const users = this.localStorageService.get(LocalstorageKey.Users) as UserModel[];
    const index = users.findIndex((user) => user.id === userId);

    users.splice(index, 1);
    this.localStorageService.set(LocalstorageKey.Users, users);

    return of(userId).pipe(delay(1000));
  }
}
