import { StateService } from './../../@core/data/state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

export const subMenu: NbMenuItem[] = [
  {
    title: 'Project List',
    link: '/pages/trello',
  },
  {
    title: 'Project Board',
    link: '/pages/trello/board'
  },
  {
    title: 'Something'
  }
];

@Component({
  selector: 'trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.scss']
})
export class TrelloComponent implements OnInit, OnDestroy {
  layouts = []

  constructor(private stateService: StateService) {
    this.stateService.getLayoutStates()
      .subscribe((layouts: any[]) => {
        this.layouts = layouts
        this.layoutSelect({
          name: 'Two Column',
          icon: 'nb-layout-two-column',
          id: 'two-column',
        })
      });
  }

  ngOnInit() {

  }

  layoutSelect(layout: any): boolean {
    this.layouts = this.layouts.map((l: any) => {
      l.selected = false;
      return l;
    });

    layout.selected = true;
    this.stateService.setLayoutState(layout);
    return false;
  }

  ngOnDestroy() {
    this.layoutSelect({
      name: 'One Column',
      icon: 'nb-layout-default',
      id: 'one-column',
    })
  }
}
