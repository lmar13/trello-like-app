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
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    open: {

    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
      private smartTableService: SmartTableService,
      private activeRoute: ActivatedRoute,
      private router: Router,
    ) {
    this.activeRoute.params.subscribe(x => {
      if(x.userId){
        this.smartTableService.getDataForUser(x.userId).subscribe(data => this.source.load(data.slice(0,5)))
        return;
      }
      this.smartTableService.getData().subscribe(data => this.source.load(data))
    })
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
      this.smartTableService.changeSelectedBoard(this.selectedRow.id);
      this.router.navigate(['/pages/trello/board']);
    } else {
      alert('You need to choose project');
    }
  }

}