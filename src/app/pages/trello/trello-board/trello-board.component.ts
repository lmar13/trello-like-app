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
  addingColumn = false;
  addColumnText: string;
  editingTilte = false;
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
    this.columnService.getAll().subscribe(columns => this.columns = columns);
  }

  ngOnInit() {
    this.ws.connect();

    this.ws.onCardAdd.subscribe(card => {
      console.log('adding card from server');
      this.board.cards.push(card);
    });

    let boardId = this.route.snapshot.params['id'];

    //let boardId = this.routeParams.get('id');
    this.boardService.getBoardWithColumnsAndCards(boardId)
      .subscribe(data => {
        console.log(`joining board ${boardId}`);
        this.ws.join(boardId);

        // this.board = data[0];
        // this.board.columns = data[1];
        // this.board.cards = data[2];
        document.title = this.board.title + " | Generic Task Manager";
        this.setupView();
      });
  }

  ngOnDestroy(){
    // console.log(`leaving board ${this.board._id}`);
    // this.ws.leave(this.board.id);
  }

  setupView() {
    let component = this;
    setTimeout(function () {
      var startColumn;
      // jQuery('#main').sortable({
      //   items: '.sortable-column',
      //   handler: '.header',
      //   connectWith: "#main",
      //   placeholder: "column-placeholder",
      //   dropOnEmpty: true,
      //   tolerance: 'pointer',
      //   start: function (event, ui) {
      //     ui.placeholder.height(ui.item.find('.column').outerHeight());
      //     startColumn = ui.item.parent();
      //   },
      //   stop: function (event, ui) {
      //     var columnId = ui.item.find('.column').attr('column-id');

      //     // component.updateColumnOrder({
      //     //   columnId: columnId
      //     // });
      //   }
      // }).disableSelection();

      //component.bindPane();;

      window.addEventListener('resize', function (e) {
        component.updateBoardWidth();
      });
      component.updateBoardWidth();
      document.getElementById('content-wrapper').style.backgroundColor = '';
    }, 100);
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

  updateBoardWidth() {
    // this.boardWidth = ((this.board.columns.length + (this.columnsAdded > 0 ? 1 : 2)) * 280) + 10;
    this.boardWidth = ((this.columns.length + 1) * 280) + 10;

    if (this.boardWidth > document.body.scrollWidth) {
      document.getElementById('main').style.width = this.boardWidth + 'px';
    } else {
      document.getElementById('main').style.width = '100%';
    }

    if (this.columnsAdded > 0) {
      let wrapper = document.getElementById('content-wrapper');
      wrapper.scrollLeft = wrapper.scrollWidth;
    }

    this.columnsAdded++;
  }

  updateBoard() {
    if (this.board.title && this.board.title.trim() !== '') {
      this.boardService.edit(this.board);
    } else {
      this.board.title = this.currentTitle;
    }
    this.editingTilte = false;
    document.title = this.board.title + " | Generic Task Manager";
  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTilte = true;

    let input = this.el.nativeElement
      .getElementsByClassName('board-title')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function () { input.focus(); }, 0);
  }

  // updateColumnElements(column: Column) {
  //   let columnArr = jQuery('#main .column');
  //   let columnEl = jQuery('#main .column[columnid=' + column._id + ']');
  //   let i = 0;
  //   for (; i < columnArr.length - 1; i++) {
  //     column.order < +columnArr[i].getAttibute('column-order');
  //     break;
  //   }

  //   columnEl.remove().insertBefore(columnArr[i]);
  // }

  // updateColumnOrder(event) {
  //   let i: number = 0,
  //     elBefore: number = -1,
  //     elAfter: number = -1,
  //     newOrder: number = 0,
  //     columnEl = jQuery('#main'),
  //     columnArr = columnEl.find('.column');

  //   for (i = 0; i < columnArr.length - 1; i++) {
  //     if (columnEl.find('.column')[i].getAttribute('column-id') == event.columnId) {
  //       break;
  //     }
  //   }

  //   if (i > 0 && i < columnArr.length - 1) {
  //     elBefore = +columnArr[i - 1].getAttribute('column-order');
  //     elAfter = +columnArr[i + 1].getAttribute('column-order');

  //     newOrder = elBefore + ((elAfter - elBefore) / 2);
  //   }
  //   else if (i == columnArr.length - 1) {
  //     elBefore = +columnArr[i - 1].getAttribute('column-order');
  //     newOrder = elBefore + 1000;
  //   } else if (i == 0) {
  //     elAfter = +columnArr[i + 1].getAttribute('column-order');

  //     newOrder = elAfter / 2;
  //   }

  //   let column = this.board.columns.filter(x => x._id === event.columnId)[0];
  //   column.order = newOrder;
  //   this.columnService.put(column).then(res => {
  //     this.ws.updateColumn(this.board._id, column);
  //   });
  // }


  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  // enableAddColumn() {
  //   this.addingColumn = true;
  //   let input = jQuery('.add-column')[0]
  //     .getElementsByTagName('input')[0];

  //   setTimeout(function () { input.focus(); }, 0);
  // }

  // addColumn() {
  //   let newColumn = <Column>{
  //     title: this.addColumnText,
  //     order: (this.board.columns.length + 1) * 1000,
  //     boardId: this.board._id
  //   };
  //   this.columnService.post(newColumn)
  //     .subscribe(column => {
  //       // this.board.columns.push(column)
  //       console.log('column added');
  //       this.updateBoardWidth();
  //       this.addColumnText = '';
  //       // this.ws.addColumn(this.board._id, column);
  //     });
  // }

  // addColumnOnEnter(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     if (this.addColumnText && this.addColumnText.trim() !== '') {
  //       this.addColumn();
  //     } else {
  //       this.clearAddColumn();
  //     }
  //   }
  //   else if (event.keyCode === 27) {
  //     this.clearAddColumn();
  //   }
  // }

  // addColumnOnBlur() {
  //   if (this.addColumnText && this.addColumnText.trim() !== '') {
  //     this.addColumn();
  //   }
  //   this.clearAddColumn();
  // }

  // clearAddColumn() {
  //   this.addingColumn = false;
  //   this.addColumnText = '';
  // }


  addCard(card: Card) {
    this.board.cards.push(card);
  }

  foreceUpdateCards() {
    var cards = JSON.stringify(this.board.cards);
    this.board.cards = JSON.parse(cards);
  }


  onCardUpdate(card: Card) {
    this.foreceUpdateCards();
  }
}
