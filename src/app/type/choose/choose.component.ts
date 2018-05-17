import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from 'shared/search.service';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.scss']
})
export class ChooseComponent implements OnInit {
  @Input('account') account: string;
  users: Array<User> = [];

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.getSearch();
  }

  async getSearch() {
    this.users = await this.searchService.getSearch(this.account).then(res => {
      if (res['status'] === 'ok') {
        return res['users'].map(value => {
          return value['user'];
        });
      }
    });
  }

}
