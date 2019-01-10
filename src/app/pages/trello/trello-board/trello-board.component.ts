import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jQuery from 'jquery';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { WebSocketService } from '../../../@core/data/ws.service';
import { Board, Card, Column} from '../../../@core/model';
import { TrelloColumnService } from '../trello-column/trello-column.service';
import { TrelloBoardService } from './trello-board.service';

// declare var jQuery: any;
var curYPos = 0,
  curXPos = 0,
  curDown = false;
@Component({
  selector: 'ngx-trello-board',
  templateUrl: './trello-board.component.html',
  styleUrls: ['./trello-board.component.scss']
})
export class TrelloBoardComponent implements OnInit {

  board = {} as Board;
  columns = [] as Column[];
  cards = [] as Card[];
  addingColumn = false;
  addColumnText: string;
  editingTitle = false;
  currentTitle: string;
  boardWidth: number;
  columnsAdded: number = 0;

  constructor(
    private smartTableService: SmartTableService,
    public el: ElementRef,
    private ws: WebSocketService,
    private boardService: TrelloBoardService,
    private columnService: TrelloColumnService,
    private route: ActivatedRoute

  ) {
    this.smartTableService.selectedBoard.subscribe(id => this.board._id = id);
    // this.columnService.getAll().subscribe(columns => this.columns = columns);

  }

  ngOnInit() {
    this.ws.connect();

    this.ws.onCardAdd.subscribe(card => {
      console.log('adding card from server');
      this.cards.push(card);
    });

    let boardId = this.route.snapshot.params['id'];
    boardId = '5c2f3beb5088023f44e874ae';

    //let boardId = this.routeParams.get('id');
    this.boardService.getBoardWithColumnsAndCards(boardId)
      .subscribe(data => {
        console.log(`joining board ${boardId}`);
        this.ws.join(boardId);

        console.log(data);

        this.board = data[0];
        this.columns = data[1];
        this.cards = data[2];
        document.title = this.board.title + " | Generic Task Manager";
      });
  }

  ngOnDestroy(){
    // console.log(`leaving board ${this.board._id}`);
    // this.ws.leave(this.board.id);
  }

  cardsForColumn(column: Column) {
    return this.cards.filter(val => column._id === val.columnId);
  }

  bindPane() {
    let el = document.getElementById('content-wrapper');
    el.addEventListener('mousemove', function (e) {
      e.preventDefault();
      if (curDown === true) {
        el.scrollLeft += (curXPos - e.pageX) * .25;// x > 0 ? x : 0;
        el.scrollTop += (curYPos - e.pageY) * .25;// y > 0 ? y : 0;
      }
    });

    el.addEventListener('mousedown', function (e) {
      if (e.srcElement.id === 'main' || e.srcElement.id === 'content-wrapper') {
        curDown = true;
      }
      curYPos = e.pageY; curXPos = e.pageX;
    });
    el.addEventListener('mouseup', function (e) {
      curDown = false;
    });
  }

  // updateBoardWidth() {
  //   // this.boardWidth = ((this.board.columns.length + (this.columnsAdded > 0 ? 1 : 2)) * 280) + 10;
  //   this.boardWidth = ((this.columns.length + 1) * 280) + 10;

  //   if (this.boardWidth > document.body.scrollWidth) {
  //     document.getElementById('main').style.width = this.boardWidth + 'px';
  //   } else {
  //     document.getElementById('main').style.width = '100%';
  //   }

  //   if (this.columnsAdded > 0) {
  //     let wrapper = document.getElementById('content-wrapper');
  //     wrapper.scrollLeft = wrapper.scrollWidth;
  //   }

  //   this.columnsAdded++;
  // }

  updateBoard() {
    if (this.board.title && this.board.title.trim() !== '') {
      this.boardService.edit(this.board);
    } else {
      this.board.title = this.currentTitle;
    }
    this.editingTitle = false;
    document.title = this.board.title + " | Generic Task Manager";
  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTitle = true;

    let input = this.el.nativeElement
      .getElementsByClassName('board-title')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function () { input.focus(); }, 0);
  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  addCard(card: Card) {
    this.cards.push(card);
  }

  foreceUpdateCards() {
    var cards = JSON.stringify(this.cards);
    this.cards = JSON.parse(cards);
  }

  onCardUpdate(card: Card) {
    this.foreceUpdateCards();
  }
}
