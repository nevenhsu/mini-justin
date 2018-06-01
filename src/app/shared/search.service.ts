import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';


@Injectable()
export class SearchService {
  // TODO: use BehaviorSubject instead
  private subject: Subject<PostImage[]> = new Subject();
  public _images: Array<PostImage> = [];
  public images$ = this.subject.asObservable();
  public imagesData: string[] = [];
  public prevUrl: {url: string, queryParams?: Object};

  static getSafe(fn) {
    try {
      return fn();
    } catch (e) {
      return undefined;
    }
  }

  constructor(private http: HttpClient) { }

  getHashTag(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.hashtag)
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
      if (isDevMode()) {term = ''; }
      // http://app.memopresso.com/api/instagram/search/ + term
      this.http.get(`${environment.search}/${term}`)
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

  getPostsData(resource: string, variables: {query: string, after: string}): Promise<PostsData> {
    const VARIABLES = JSON.stringify(variables);
    if (isDevMode()) {
      variables = {
        query: '',
        after: ''
      };
    }

    switch (resource) {
      case 'tag':
        return new Promise((resolve, reject) => {
          // 'http://127.0.0.1:8080/ + hashtag/'+ igid + '/' + end_cursor+'/' + SESSION_ID +'/'+ QUERY_HASHTAG;
          // VARIABLES2 = {'query': this.hashtagName, 'after': AFTER};
          this.http.get(`${environment.root}/${environment.hashtagImage}/${variables.query}/${variables.after}/${environment.SESSION_ID}/${environment.QUERY_HASHTAG}`)
            .toPromise()
            .then(
              res => {// Success
                const POSTSDATA: PostsData = {};
                // Parse hashtag data to PostsData
                const data = SearchService.getSafe(() => res['data'].hashtag);
                POSTSDATA.status = SearchService.getSafe(() => res['status']);
                POSTSDATA.name = SearchService.getSafe(() => data.name);
                POSTSDATA.count = SearchService.getSafe(() => data['edge_hashtag_to_media'].count);
                POSTSDATA.end_cursor = SearchService.getSafe(() => data['edge_hashtag_to_media'].page_info.end_cursor);
                const IMAGES: Array<object> = SearchService.getSafe(() => data['edge_hashtag_to_media'].edges) || [];
                POSTSDATA.images = IMAGES.map(edge => SearchService.getSafe(() => edge['node']));

                resolve(POSTSDATA);
              },
              msg => { // Error
                reject(msg);
              }
            );
        });
      case 'id':
        return new Promise((resolve, reject) => {

          // 'http://127.0.0.1:8080/ + username/'+ pk + '/' + end_cursor+'/' + SESSION_ID2 +'/'+ QUERY_USERNAME;
          // VARIABLES = {'query': this.user.pk.toString(), 'after': AFTER};
          this.http.get(`${environment.root}/${environment.IdImage}/${variables.query}/${variables.after}/${environment.SESSION_ID2}/${environment.QUERY_USERNAME}`)
            .toPromise()
            .then(
              res => {// Success
                const POSTSDATA: PostsData = {};
                // Parse id data to PostsData
                const data = SearchService.getSafe(() => res['data'].user);
                POSTSDATA.status = SearchService.getSafe(() => res['status']);
                POSTSDATA.name = undefined;
                POSTSDATA.count = SearchService.getSafe(() => data['edge_owner_to_timeline_media'].count);
                POSTSDATA.end_cursor = SearchService.getSafe(() => data['edge_owner_to_timeline_media'].page_info.end_cursor);
                const IMAGES: Array<object> = SearchService.getSafe(() => data['edge_owner_to_timeline_media'].edges) || [];
                POSTSDATA.images = IMAGES.map(edge => SearchService.getSafe(() => edge['node']));

                resolve(POSTSDATA);
              },
              msg => { // Error
                reject(msg);
              }
            );
        });
      default:
        return new Promise((resolve, reject) => {
          return reject('wrong api url');
        } );
    }
  }

  updateImages() {
    this.subject.next(this._images);
  }

  clearImages() {
    this._images  = [];
    this.subject.next(this._images);
  }

  savePrevUrl(route: ActivatedRoute) {
    this.prevUrl = { url: route.snapshot.routeConfig.path, queryParams: route.snapshot.queryParams};
  }

  sendMiniUsage(data) {
    this.http.post(environment.sendMini, data);
  }

}



