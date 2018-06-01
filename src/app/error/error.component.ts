import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  sub: Subscription;
  code: string;
  error: string;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.error = params['error'];

      console.log(this.error);
      switch (this.error) {
        case '65544':
          this.code = 'Paper low. Please add paper';
          break;
        case '65552':
          this.code = 'Ribbon low. Please change ribbon';
          break;
        case '-2147483648':
          this.code = `If retry didn't work. Restart printer and check connection`;
          break;
        default:
          this.code = `If retry didn't work. Restart computer and printer`;
      }
    });
  }

  tap() {
    this.router.navigate(['']);
  }

}
