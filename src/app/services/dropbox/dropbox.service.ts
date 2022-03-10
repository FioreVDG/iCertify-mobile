/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropboxService {
  accessToken =
    'grG-786_nYcAAAAAAAAAASZmkKtn8u4U73zIEwMUfUMsl4vqhoEXmrSL68uswJ4I';
  dbx: any;
  constructor() {
    let fetch = require('isomorphic-fetch');
    let Dropbox = require('dropbox').Dropbox;
    this.dbx = new Dropbox({
      fetch: fetch,
      accessToken: this.accessToken,
    });
  }

  checkAccount(): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbx
        .usersGetCurrentAccount()
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  checkPath(): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbx
        .filesListFolder({ path: '/docketph' })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          console.error(error);
        });
    });
  }

  getTempLink(path: string): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbx
        .filesGetTemporaryLink({
          path,
        })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          console.log(error);
          console.log(observer.error(error));
        });
    });
  }

  downloadFile(path: string): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbx
        .filesGetTemporaryLink({ path })
        .then((response: any) => {
          let link = document.createElement('a');
          link.href = response.result.link;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          console.log(error);
          console.log(observer.error(error));
        });
    });
  }

  getThumbnail(path: string): Observable<any> {
    let format = 'jpeg';
    return Observable.create((observer: any) => {
      this.dbx
        .filesGetThumbnail({
          path: path,
          format: format,
          size: 'w256h256',
          mode: 'strict',
        })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  getPreview(path: string): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbx
        .filesGetPreview({ path })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  getMetaData(path: string): Observable<any> {
    return Observable.create((observer: any) => {
      this.dbx
        .filesGetMetadata({ path })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((err: any) => {
          observer.error(err);
        });
    });
  }

  uploadFile(path: string, filename: string, file: any): Observable<any> {
    console.log(filename);
    return Observable.create((observer: any) => {
      this.dbx
        .filesUpload({
          path: path + filename,
          autorename: true,
          mode: 'overwrite',
          contents: file,
        })
        .then((response: any) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error: any) => {
          //console.log(error);
          observer.error(error);
        });
    });
  }
}
