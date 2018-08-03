import { Injectable } from '@angular/core';
import { Observable } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private iceValues = {
    name: 'Lieblingseis',
    results: [
      {
        name: 'Vanille',
        value: this.getRandomNumber(5, 12),
        color: 'rgb(255, 206, 86)'
      },
      {
        name: 'Schokolade',
        value: this.getRandomNumber(6, 12),
        color: 'rgb(74, 48, 0)'
      },
      {
        name: 'Erdbeer',
        value: this.getRandomNumber(3, 8),
        color: 'rgb(255, 99, 132)'
      },
      {
        name: 'Zitrone',
        value: this.getRandomNumber(2, 8),
        color: 'rgb(255, 250, 59)'
      },
      {
        name: 'Schlumpf',
        value: this.getRandomNumber(1, 4),
        color: 'rgb(54, 162, 235)'
      }
    ]
  };

  private developerAttributes = ['Browser', 'Chat', 'Console', 'Email client', 'File explorer', 'IDE'];

  private developerValues = {
    attributes: this.developerAttributes,
    values: [this.generateDeveloperValues(), this.shuffleArray(this.generateDeveloperValues())],
    names: ['Frontend Developer', 'Backend Developer']
  };

  public getIceCreamValues() {
    return this.getDeferredObservable(this.iceValues);
  }

  public getDeveloperValues() {
    return this.getDeferredObservable(this.developerValues);
  }

  private getDeferredObservable<T>(value: T): Observable<T> {
    return Observable.create(observer => {
      setTimeout(() => {
        observer.next(value);
      }, this.getRandomNumber(500, 1500));
    });
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private generateDeveloperValues() {
    const percentages = this.getRandomPercentages(6);
    return [
      percentages[0], percentages[1], percentages[2],
      percentages[3], percentages[4], percentages[5],
    ];
  }

  // TODO
  private getRandomPercentages(amount: number): number[] {
    const percentages = [];
    let sum = 0;

    for (let i = 0; i < amount; i++) {
      let min = 5;
      let max = 40;

      if (i > 0) {
        max = (100 - sum) / amount;
      }

      let p = Math.floor(this.getRandomNumber(min, max));

      if (i == amount - 1) {
        p = 100 - sum;
      }

      sum += p;
      percentages[i] = p;
    }
    return percentages;
  }

  private shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
