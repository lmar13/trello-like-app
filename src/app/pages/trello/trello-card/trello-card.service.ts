import { Observable } from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Card } from '../../../@core/model';
import { EnvironmentProviderService } from '../../../@core/data/environment-provider.service';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrelloCardService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService) {
      this.baseUrl = envProvider.current.apiBaseUri;
  }

  getAll(): Observable<Card[]> {
    return this.httpClient
        .get<Card[]>(`${this.baseUrl}/card`)
  }

  getById(id: string): Observable<Card> {
    return this.httpClient
        .get<Card>(`${this.baseUrl}/card/${id}`)
  }

  edit(card: Card): Observable<Card> {
    return this.httpClient.put<Card>(`${this.baseUrl}/card/${card._id}`, card)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card)
      );
  }

  add(card: Card): Observable<Card> {
    return this.httpClient.post<Card>(`${this.baseUrl}/card`, card)
      .pipe(
        catchError(err => {
          throw err;
        }),
        map(value => value as Card)
      );
  }

  delete(id: string): Observable<boolean> {
    return this.httpClient.delete(`${this.baseUrl}/card/${id}`, {
      observe: 'response'
    }).pipe(
      map
      ((response: HttpResponse<Object>) => response.ok)
    );
  }
}
