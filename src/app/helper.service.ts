import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  
   createProcessData(values1: number[], values2: number[]): number[] {
    const combined = [];
    for (let i = 0; i < values1.length; i++) {
      const average = (values1[i] + values2[i]) / 2;
      combined.push(average);
    }
    return combined;
  }

   getCanvasContext(name: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(name);
    return canvas.getContext('2d');
  }

   getRandomColor(): string {
    const r = this.getRGBValue();
    const g = this.getRGBValue();
    const b = this.getRGBValue();
    return 'rgb(' + r + ',' + g + ',' + b + ') ';
  }

   getRGBValue(): number {
    return this.getRandomNumber(0, 255);
  }

   getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

   getTransparentColors(colors: string[]): string[] {
    return colors.map(c => {
      return this.getTransparentColor(c, 0.85);
    });
  }

   getTransparentColor(color: string, alpha: number): string {
    return color.replace('rgb', 'rgba')
      .replace(')', ',' + alpha + ')');
  }
}
