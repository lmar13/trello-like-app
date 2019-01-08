import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone} from '@angular/core';
import { Card } from '../../../@core/model';
import { WebSocketService } from '../../../@core/data/ws.service';
import { TrelloCardService } from './trello-card.service';


@Component({
  selector: 'ngx-trello-card',
  templateUrl: './trello-card.component.html',
  styleUrls: ['./trello-card.component.scss'],
})
export class TrelloCardComponent implements OnInit {
  @Input()
  card: Card;
  @Output() cardUpdate: EventEmitter<Card>;
  editingCard = false;
  currentTitle: string;
  zone: NgZone;
  constructor(private el: ElementRef,
    private _ref: ChangeDetectorRef,
    private _ws: WebSocketService,
    private _cardService: TrelloCardService) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.cardUpdate = new EventEmitter();
  }

  ngOnInit() {
    this._ws.onCardUpdate.subscribe((card: Card) => {
      if (this.card._id === card._id) {
        this.card.title = card.title;
        this.card.order = card.order;
        this.card.columnId = card.columnId;
      }
    });
  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    } else if (event.keyCode === 27) {
      this.card.title = this.currentTitle;
      this.editingCard = false;
    }
  }

  editCard() {
    this.editingCard = true;
    this.currentTitle = this.card.title;

    let textArea = this.el.nativeElement.getElementsByTagName('textarea')[0];

    setTimeout(function() {
      textArea.focus();
    }, 0);
  }

  updateCard() {
    if (!this.card.title || this.card.title.trim() === '') {
      this.card.title = this.currentTitle;
    }

    this._cardService.put(this.card).then(res => {
      this._ws.updateCard(this.card.boardId, this.card);
    });
    this.editingCard = false;
  }

  //TODO: check lifecycle
  private ngOnDestroy() {
    //this._ws.onCardUpdate.unsubscribe();
  }

}
