import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  empties = [null, undefined];
  constructor() {}
  deepFind(obj: any, path: string | Array<string | number>): any {
    // console.log(path);
    if (!obj && obj != 0) return '';
    if (obj && !path) return '';

    if (typeof path == 'string') return this.deepFind(obj, path.split('.'));
    else if (path.length == 0)
      return this.empties.includes(obj)
        ? ''
        : Array.isArray(obj)
        ? obj.join(', ')
        : obj;
    else if (Array.isArray(obj)) return this.traverseArray(obj, path.join('.'));
    else return this.deepFind(obj[path[0]], path.slice(1));
  }
  traverseArray(arr: any[], path: string, values: any[] = []): any {
    if (!arr.length) return values.join(', ');

    const arrCopy = [...arr];
    const obj = arrCopy.splice(0, 1)[0];

    const foundVal = this.deepFind(obj, path);
    if (foundVal) values.push(foundVal);
    return this.traverseArray(arr.slice(1), path, values);
  }
}
