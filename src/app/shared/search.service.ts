import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SearchService {
  private apiRoot = 'http://app.memopresso.com';
  private apiSearch = 'assets/search-result.json';
  private apiHashtag = 'assets/hashtag.json';

  constructor(private http: HttpClient) { }

  getHashTag(term: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiHashtag)
        .toPromise()
        .then(
          res => {// Success
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
  }

  getSearch(term: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiSearch)
        .toPromise()
        .then(
          res => {// Success
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
  }

}
