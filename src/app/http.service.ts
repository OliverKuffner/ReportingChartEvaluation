import { Injectable } from '@angular/core';
import { Observable } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public getPieValues() {
    const fakeValues = {
      name: 'Lieblingseis',
      results: [
        {
          label: 'Vanille',
          value: this.getRandomNumber(5, 12),
          color: 'rgb(255, 206, 86)'
        },
        {
          label: 'Schokolade',
          value: this.getRandomNumber(6, 12),
          color: 'rgb(74, 48, 0)'
        },
        {
          label: 'Erdbeer',
          value: this.getRandomNumber(3, 8),
          color: 'rgb(255, 99, 132)'
        },
        {
          label: 'Zitrone',
          value: this.getRandomNumber(2, 8),
          color: 'rgb(255, 250, 59)'
        },
        {
          label: 'Schlumpf',
          value: this.getRandomNumber(1, 4),
          color: 'rgb(54, 162, 235)'
        }
      ]
    };
    return this.getDeferredObservable(fakeValues);
  }

  getDeferredObservable<T>(value: T): Observable<T> {
    return Observable.create(observer => {
      setTimeout(() => {
        observer.next(value);
      }, this.getRandomNumber(1000, 2500));
    });
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
