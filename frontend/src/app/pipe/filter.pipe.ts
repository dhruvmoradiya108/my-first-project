import { Pipe, PipeTransform } from '@angular/core';
import { product } from '../../data-type';

@Pipe({
  name: 'filter',
  standalone: true
})

export class FilterPipe implements PipeTransform {

  transform(value: product[], searchFilter : any): any {
    return value.filter((e: any) => {
      return e.category.toLowerCase().indexOf(searchFilter) > -1;
    })
  }

}
