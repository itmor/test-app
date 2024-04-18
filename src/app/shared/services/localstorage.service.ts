import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

export enum LocalstorageKey {
  Users = 'users',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storageSubject = new Subject<any>();

  get(key: string): unknown {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.storageSubject.next({ key, value });
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    this.storageSubject.next({ key, value: null });
  }

  onChange(key: string): Observable<unknown> {
    return this.storageSubject.asObservable().pipe(
      filter((data) => data.key === key),
      map((data) => data.value),
    );
  }
}
