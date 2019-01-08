import { TrelloComponent } from "./trello.component";
import { TrelloListComponent } from "./trello-list/trello-list.component";
import { TrelloBoardComponent } from "./trello-board/trello-board.component";
import { NgModule } from "@angular/core";
import { TrelloRoutingModule } from "./trello-routing.module";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { NbActionsModule } from "@nebular/theme";


const TRELLO_COMPONENTS = [
  TrelloComponent,
  TrelloListComponent,
  TrelloBoardComponent,
];

@NgModule({
  imports: [
    TrelloRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbActionsModule,
  ],
  declarations: [
    ...TRELLO_COMPONENTS
  ],
  providers: [
    SmartTableService,
  ]
})
export class TrelloModule {
}
