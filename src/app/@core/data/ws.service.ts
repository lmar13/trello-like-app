import {Injectable, EventEmitter} from '@angular/core';
import { Card, Board } from '../model';
import io from 'socket.io-client';
import { EnvironmentProviderService } from './environment-provider.service';

// declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  private baseUrl: string;

  public onCardAdd: EventEmitter<Card>;
  public onCardUpdate: EventEmitter<Card>;

  constructor(
    envProvider: EnvironmentProviderService
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;

    this.onCardAdd = new EventEmitter();
    this.onCardUpdate = new EventEmitter();
  }

  connect(){
    this.socket = io(this.baseUrl);

    this.socket.on('addCard', data => {
      this.onCardAdd.emit(<Card>data.card);
    });

    this.socket.on('updateCard', data => {
      this.onCardUpdate.emit(<Card>data.card);
    });
  }

  join(boardId: string) {
    this.socket.emit('joinBoard', boardId);
  }

  leave(boardId: string) {
    this.socket.emit('leaveBoard', boardId);
  }

  addCard(boardId: string, card: Card) {
    this.socket.emit('addCard', { boardId: boardId, card: card });
  }

  updateCard(boardId: string, card: Card) {
    this.socket.emit('updateCard', { boardId: boardId, card: card });
  }
}
