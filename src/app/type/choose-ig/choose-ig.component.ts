import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchService } from 'shared/search.service';

@Component({
  selector: 'app-choose-ig',
  templateUrl: './choose-ig.component.html',
  styleUrls: ['./choose-ig.component.scss']
})
export class ChooseIgComponent implements OnInit {
  @Input('query') query: string;
  @Output('tapAccount') tapAccount = new EventEmitter();
  users: Array<User> = [];
  isLoading: boolean;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
		this.isLoading = true;

    this.users = await this.searchService.getSearch(this.query).then(res => {
			this.isLoading = false;
      if (res['status'] === 'ok') {
        return res['users'].map(value => {
          return value['user'];
        });
      }
    });
  }

  onTapAccount(user: User) {
    this.tapAccount.emit(user);
  }

}
