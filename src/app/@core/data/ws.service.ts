import {Injectable, EventEmitter} from '@angular/core';
import { Card, Board } from '../model';
import io from 'socket.io-client';
import { EnvironmentProviderService } from './environment-provider.service';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

// declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // private socket: any;
  // private baseUrl: string;

  // public onCardAdd: EventEmitter<Card>;
  // public onCardUpdate: EventEmitter<Card>;

  constructor(
    envProvider: EnvironmentProviderService,
    private socket: Socket
  ) {
    // this.baseUrl = envProvider.current.apiBaseUri;
  }

  // initSocket(): void {
  //   this.socket = io(this.baseUrl);
  // }

  join(boardId: string) {
    this.socket.emit('joinBoard', boardId);
  }

  leave(boardId: string) {
    this.socket.emit('leaveBoard', boardId);
  }

  addCard(boardId: string, card: Card) {
    this.socket.emit('addCard', { boardId, card });
  }

  onAddCard(): Observable<Card> {
    // return new Observable<Card>(observer => {
    //   this.socket.on('addCard', (card: Card) => observer.next(card));
    // });

    return this.socket.fromEvent('addCard');
  }

  updateCard(boardId: string, cards: Card[]) {
    this.socket.emit('updateCard', { boardId, cards });
  }

  onUpdateCard(): Observable<Card[]> {
    // return new Observable<Card>(observer => {
    //   this.socket.on('updateCard', (card: Card) => observer.next(card));
    // });
    return this.socket.fromEvent('updateCard');
  }
}
