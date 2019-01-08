import { NgModule } from "@angular/core";
import { NbActionsModule } from "@nebular/theme";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { OrderBy, Where } from "../../@core/pipes";
import { ThemeModule } from "../../@theme/theme.module";
import { TrelloBoardComponent } from "./trello-board/trello-board.component";
import { TrelloCardComponent } from "./trello-card/trello-card.component";
import { TrelloColumnComponent } from "./trello-column/trello-column.component";
import { TrelloListComponent } from "./trello-list/trello-list.component";
import { TrelloRoutingModule } from "./trello-routing.module";
import { TrelloComponent } from "./trello.component";
import { WebSocketService } from "../../@core/data/ws.service";


const TRELLO_COMPONENTS = [
  TrelloComponent,
  TrelloListComponent,
  TrelloBoardComponent,
  TrelloCardComponent,
  TrelloColumnComponent,
  OrderBy,
  Where,
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
    // SmartTableService,
    // WebSocketService,
  ]
})
export class TrelloModule {
}
