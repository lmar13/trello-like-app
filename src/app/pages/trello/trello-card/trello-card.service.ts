import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Card } from '../../../@core/model';


@Injectable({
  providedIn: 'root'
})
export class TrelloCardService {
  apiUrl = '/card';

  constructor(private _http: HttpClient) {
  }

  getAll() {
    return this._http.get(this.apiUrl)
      // .map(res => res.json());
  }

  get(id: string) {
    return this._http.get(this.apiUrl + '/' + id)
      // .map(res => res.json());
  }

  put(card: Card) {
    return this._http.put(this.apiUrl + '/' + card._id, JSON.stringify(card))
      .toPromise();
  }

  post(card: Card) {
    return this._http.post(this.apiUrl, JSON.stringify(card))
      // .map(res => <Card>res.json().data);
  }

  delete(card: Card) {
    return this._http.delete(this.apiUrl + '/' + card._id)
      .toPromise();
  }

}
