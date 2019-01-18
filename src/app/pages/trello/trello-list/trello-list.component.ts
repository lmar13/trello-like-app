import { AuthService } from './../../../@core/auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableService } from './../../../@core/data/smart-table.service';

@Component({
  selector: 'trello-list',
  templateUrl: './trello-list.component.html',
  styleUrls: ['./trello-list.component.scss']
})
export class TrelloListComponent implements OnInit {

  selectedRow = null;
  settings = {
    actions: false,
    // actions: {
    //   position: 'right',
    // },
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      _id: {
        title: 'ID',
        type: 'string',
        editable: false,
      },
      title: {
        title: 'Project Name',
        type: 'string',
      },
      owner: {
        title: 'Owner',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private smartTableService: SmartTableService,
              private activeRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
    this.activeRoute.url.subscribe(x => {
      if(x.length > 0){
        this.smartTableService.getDataForUser(this.authService.decToken.id)
          .subscribe(data => this.source.load(data.slice(0,5)));
          return;
      }
      this.smartTableService.getData()
        .subscribe(data => this.source.load(data))
    });
  }

  ngOnInit() {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onUserRowSelect(event) {
    this.selectedRow = event.selected[0];
  }

  getRowData() {
    if(this.selectedRow){
      this.router.navigate([`/pages/trello/board/${this.selectedRow._id}`]);
    } else {
      alert('You need to choose project');
    }
  }

}
