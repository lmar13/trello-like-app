import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { WebSocketService } from '../../../@core/data/ws.service';
import { Board, Card, Column } from '../../../@core/model';
import { TrelloCardService } from '../trello-card/trello-card.service';
import { TrelloBoardService } from './trello-board.service';

@Component({
  selector: 'ngx-trello-board',
  templateUrl: './trello-board.component.html',
  styleUrls: ['./trello-board.component.scss']
})
export class TrelloBoardComponent implements OnInit {

  board = {} as Board;
  columns = [] as Column[];
  cards = [] as Card[];

  constructor(
    private socketService: WebSocketService,
    private boardService: TrelloBoardService,
    private cardService: TrelloCardService,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.initConfig();
    this.initFetchData();
  }

  ngOnDestroy(){
    console.log(`leaving board ${this.board._id}`);
    this.socketService.leave(this.board._id);
  }

  initConfig() {
    this.route.params.subscribe(param => {
      this.board._id = param.boardId;
      this.socketService.join(param.boardId);
    });

    this.socketService.onUpdateCard().subscribe(card => {
      this.cardService.getAllForBoardId(this.board._id).subscribe(cards => {
        console.log('updating card from server');
        console.log(cards);
        this.cards = cards;
      });
    });
  }

  initFetchData() {
    this.boardService.getBoardWithColumnsAndCards(this.board._id)
      .subscribe(data => [this.board, this.columns, this.cards] = data);
  }

  addCard(card: Card) {
    this.cards.push(card);
  }

  updateCard(event) {
    const columnId = event.target.dataset.columnId;
    const cardId = event.item.dataset.cardId;
    const newIndex = event.newIndex;

    this.cards = this.cards.map((val, index) => {
      return {
        ...val,
        order: cardId === val._id ? newIndex : index,
        // order: index,
        columnId: cardId === val._id ? columnId : val.columnId
      }
    });

    this.cardService.editAll(this.board._id, this.cards)
      .subscribe(cards => console.log(cards));
  }
}
