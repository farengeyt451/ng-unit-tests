// Mark Twain Quote service gets quotes from server
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError, Observer } from 'rxjs';
import { concat, map, retryWhen, switchMap, take, tap } from 'rxjs/operators';

import { Quote } from '../interfaces/quote.interface';

@Injectable()
export class TwainService {
  constructor(private http: HttpClient) {}

  private nextId = 1;

  getQuote(): Observable<string> {
    return new Observable((observer: Observer<number>) => {
      return observer.next(this.nextId++);
    }).pipe(
      switchMap((id: number) => this.http.get<Quote>(`api/quotes/${id}`)),
      map((quote: Quote) => quote.quote),

      retryWhen((errors) =>
        errors.pipe(
          switchMap((error: HttpErrorResponse) => {
            if (error.status === 404) {
              /** Queried for quote that doesn't exist */
              this.nextId = 1; // Retry with quote id:1
              return of(null); // Signal OK to retry
            }
            /** Some other HTTP error */
            console.error(error);
            return throwError('Cannot get Twain quotes from the server');
          }),
          take(2),
          /** If a second retry value, then didn't find id:1 and triggers the following error */
          concat(throwError('There are no Twain quotes')) // Didn't find id:1
        )
      )
    );
  }
}
