import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card} from '../../../@core/model';
import { WebSocketService } from '../../../@core/data/ws.service';
import { TrelloColumnService } from './trello-column.service';
import { TrelloCardService } from '../trello-card/trello-card.service';

declare var jQuery: any;

@Component({
  selector: 'ngx-trello-column',
  templateUrl: './trello-column.component.html',
  styleUrls: ['./trello-column.component.scss'],
})
export class TrelloColumnComponent implements OnInit {
  @Input() column: string;
  @Input() cards: Card[];
  @Output() public onAddCard: EventEmitter<Card>;
  @Output() cardUpdate: EventEmitter<Card>;

  editingColumn = false;
  addingCard = false;
  addCardText: string;
  currentTitle: string;

  constructor(private el: ElementRef,
    private _ws: WebSocketService,
    private _columnService: TrelloColumnService,
    private _cardService: TrelloCardService) {
    this.onAddCard = new EventEmitter();
    this.cardUpdate = new EventEmitter();
  }

  ngOnInit() {
    this.setupView();
    // this._ws.onColumnUpdate.subscribe((column: Column) => {
    //   if (this.column._id === column._id) {
    //     this.column.title = column.title;
    //     this.column.order = column.order;
    //   }
    // });
  }

  setupView() {
    let component = this;
    var startColumn;
    jQuery('.card-list').sortable({
      connectWith: ".card-list",
      placeholder: "card-placeholder",
      dropOnEmpty: true,
      tolerance: 'pointer',
      start: function(event, ui) {
        ui.placeholder.height(ui.item.outerHeight());
        startColumn = ui.item.parent();
      },
      stop: function(event, ui) {
        var senderColumnId = startColumn.attr('column-id');
        var targetColumnId = ui.item.closest('.card-list').attr('column-id');
        var cardId = ui.item.find('.card').attr('card-id');

        component.updateCardsOrder({
          columnId: targetColumnId || senderColumnId,
          cardId: cardId
        });
      }
    });
    jQuery('.card-list').disableSelection();
  }

  updateCardsOrder(event) {
    let cardArr = jQuery('[column-id=' + event.columnId + '] .card'),
      i: number = 0,
      elBefore: number = -1,
      elAfter: number = -1,
      newOrder: number = 0;

    for (i = 0; i < cardArr.length - 1; i++) {
      if (cardArr[i].getAttribute('card-id') == event.cardId) {
        break;
      }
    }

    if (cardArr.length > 1) {
      if (i > 0 && i < cardArr.length - 1) {
        elBefore = +cardArr[i - 1].getAttribute('card-order');
        elAfter = +cardArr[i + 1].getAttribute('card-order');

        newOrder = elBefore + ((elAfter - elBefore) / 2);
      }
      else if (i == cardArr.length - 1) {
        elBefore = +cardArr[i - 1].getAttribute('card-order');
        newOrder = elBefore + 1000;
      } else if (i == 0) {
        elAfter = +cardArr[i + 1].getAttribute('card-order');

        newOrder = elAfter / 2;
      }
    } else {
      newOrder = 1000;
    }


    let card = this.cards.filter(x => x._id === event.cardId)[0];
    let oldColumnId = card.columnId;
    card.order = newOrder;
    card.columnId = event.columnId;
    this._cardService.put(card).then(res => {
      // this._ws.updateCard(this.column.boardId, card); //to check how t reproduce
    });
  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  // addColumnOnEnter(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     this.updateColumn();
  //   } else if (event.keyCode === 27) {
  //     this.cleadAddColumn();
  //   }
  // }

  addCard() {
    this.cards = this.cards || [];
    let newCard = <Card>{
      title: this.addCardText,
      order: (this.cards.length + 1) * 1000,
      // columnId: this.column._id,
      // boardId: this.column.boardId
    };
    this._cardService.post(newCard)
      .subscribe(card => {
        // this.onAddCard.emit(card);
        // this._ws.addCard(card.boardId, card);
      });
  }

  addCardOnEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.addCardText && this.addCardText.trim() !== '') {
        this.addCard();
        this.addCardText = '';
      } else {
        this.clearAddCard();
      }
    } else if (event.keyCode === 27) {
      this.clearAddCard();
    }
  }

  // updateColumn() {
  //   if (this.column.title && this.column.title.trim() !== '') {
  //     this._columnService.put(this.column).then(res => {
  //       this._ws.updateColumn(this.column.boardId, this.column);
  //     });
  //     this.editingColumn = false;
  //   } else {
  //     this.cleadAddColumn();
  //   }
  // }

  // cleadAddColumn() {
  //   this.column.title = this.currentTitle;
  //   this.editingColumn = false;
  // }

  // editColumn() {
  //   this.currentTitle = this.column.title;
  //   this.editingColumn = true;
  //   let input = this.el.nativeElement
  //     .getElementsByClassName('column-header')[0]
  //     .getElementsByTagName('input')[0];

  //   setTimeout(function() { input.focus(); }, 0);
  // }

  enableAddCard() {
    this.addingCard = true;
    let input = this.el.nativeElement
      .getElementsByClassName('add-card')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function() { input.focus(); }, 0);
  }


  // updateColumnOnBlur() {
  //   if (this.editingColumn) {
  //     this.updateColumn();
  //     this.clearAddCard();
  //   }
  // }


  addCardOnBlur() {
    if (this.addingCard) {
      if (this.addCardText && this.addCardText.trim() !== '') {
        this.addCard();
      }
    }
    this.clearAddCard();
  }

  clearAddCard() {
    this.addingCard = false;
    this.addCardText = '';
  }

  onCardUpdate(card: Card){
    this.cardUpdate.emit(card);
  }
}
