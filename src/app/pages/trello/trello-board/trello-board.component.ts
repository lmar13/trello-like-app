import { Component, OnInit } from '@angular/core';
import { SmartTableService } from '../../../@core/data/smart-table.service';

@Component({
  selector: 'trello-board',
  templateUrl: './trello-board.component.html',
  styleUrls: ['./trello-board.component.scss']
})
export class TrelloBoardComponent implements OnInit {

  boardId = null;
  constructor(private smartTableService: SmartTableService) {
    this.smartTableService.selectedBoard.subscribe(id => this.boardId = id);
  }

  ngOnInit() {
  }

}
