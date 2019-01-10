import { jQuery } from 'jquery';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card, Column, Board} from '../../../@core/model';
import { WebSocketService } from '../../../@core/data/ws.service';
import { TrelloColumnService } from './trello-column.service';
import { TrelloCardService } from '../trello-card/trello-card.service';
import { SortablejsOptions } from 'angular-sortablejs';

// declare var jQuery: any;

@Component({
  selector: 'ngx-trello-column',
  templateUrl: './trello-column.component.html',
  styleUrls: ['./trello-column.component.scss'],
})
export class TrelloColumnComponent implements OnInit {
  @Input() column: Column;
  @Input() board: Board;
  @Input() cards: Card[];

  @Output() public onAddCard: EventEmitter<Card>;
  @Output() cardUpdate: EventEmitter<Card>;

  editingColumn = false;
  addingCard = false;
  addCardText: string;
  currentTitle: string;

  options: SortablejsOptions = {
    group: 'board',
    onUpdate: (event: any) => {
      this.postChangesToServer(event);
    },
    onAdd: (event: any) => {
      this.postChangesToServer(event);
    }
  };

  constructor(private el: ElementRef,
    private ws: WebSocketService,
    private cardService: TrelloCardService) {
    this.onAddCard = new EventEmitter();
    this.cardUpdate = new EventEmitter();
  }

  ngOnInit() {
    this.cardsForColumn(this.column._id);
  }

  cardsForColumn(columnId: string) {
    this.cards = this.cards
        .filter(val => columnId === val.columnId)
        // .sort((a: Card, b: Card) => a.order - b.order);
  }

  postChangesToServer(event: any) {
    const columnId = event.target.dataset.columnId;
    const cardId = event.item.dataset.cardId;
    const newIndex = event.newIndex;

    this.cards = this.cards.map(val => {
      if(val._id === cardId) {
        const item = {...val, order: newIndex, columnId: columnId}
        this.sendCardToServer(item)

        return item;
      }
      return val;
    }).map((val, index) => {
      if(val._id !== cardId) {
        const item = {...val, order: index};
        this.sendCardToServer(item);

        return item;
      }
      return val
    });

    this.cardsForColumn(columnId);
  }

  sendCardToServer(item) {
    this.cardService.edit(item).subscribe(res => {
      this.ws.updateCard(this.board._id, item);
    });
  }


  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  addCard() {
    let newCard = {
      title: this.addCardText,
      order: (this.cards.length),
      content: '',
      columnId: this.column._id,
      boardId: this.board._id
    } as Card;

    this.cards = [...this.cards, newCard]
    this.cardService.add(newCard)
      .subscribe(card => {
        this.onAddCard.emit(card);
        this.ws.addCard(card.boardId, card);
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

  enableAddCard() {
    this.addingCard = true;
    let input = this.el.nativeElement
      .getElementsByClassName('add-card')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function() { input.focus(); }, 0);
  }

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
}
