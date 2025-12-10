import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) return '';
    const str = value.toString();
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1 || str.length <= dotIndex + 2) return str;
    const integerPart = str.slice(0, dotIndex);
    const firstDecimal = str[dotIndex + 1];
    const lastChar = str[str.length - 1];
    return `${integerPart}.${firstDecimal}...${lastChar}`;
  }
}
