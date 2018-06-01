// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  root: '',
  hashtag: 'assets/hashtag.json',
  search: 'assets/search-result.json',
  hashtagImage: 'assets/image-hashtag.json',
  // IdImage: 'assets/error-private.json',
  IdImage: 'assets/image-id.json',
  SESSION_ID: '',
  SESSION_ID2: '',
  QUERY_USERNAME: '',
  QUERY_HASHTAG: '',
  sendMini: 'http://app.memopresso.com/api/order/sendmini'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
