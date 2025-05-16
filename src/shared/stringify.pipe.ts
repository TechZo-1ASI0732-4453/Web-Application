import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stringify', standalone: true })
export class StringifyPipe implements PipeTransform {
  transform(value: any): string {
    return String(value);
  }
}
