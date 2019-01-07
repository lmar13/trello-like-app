import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { TrelloComponent } from './trello/trello.component';
import { TrelloListComponent } from './trello/trello-list/trello-list.component';
import { TrelloBoardComponent } from './trello/trello-board/trello-board.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    TrelloComponent,
    TrelloListComponent,
    TrelloBoardComponent,
  ],
})
export class PagesModule {
}
