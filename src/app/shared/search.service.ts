import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Injectable()
export class SearchService {
  private apiRoot = 'http://app.memopresso.com';
  private apiSearch = 'assets/search-result.json';
  private apiHashtag = 'assets/hashtag.json';
  private apiHashtagImage = 'assets/image-hashtag.json';
  private apiIdImage = 'assets/image-id.json';

  // TODO: use BehaviorSubject instead
  private subject: Subject<PostImage[]> = new Subject();
  public _images: Array<PostImage> = [];
  public images = this.subject.asObservable();
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

  getPostsData(resource: string, variables: object): Promise<PostsData> {
    const VARIABLES = JSON.stringify(variables);

    switch (resource) {
      case 'tag':
        return new Promise((resolve, reject) => {
          this.http.get(this.apiHashtagImage)
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
          this.http.get(this.apiIdImage)
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

  savePrevUrl(route: ActivatedRoute) {
    this.prevUrl = { url: route.snapshot.routeConfig.path, queryParams: route.snapshot.queryParams};
  }

}



