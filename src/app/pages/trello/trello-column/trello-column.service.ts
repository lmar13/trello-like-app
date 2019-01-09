import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Column } from '../../../@core/model';
import { EnvironmentProviderService } from '../../../@core/data/environment-provider.service';



@Injectable({
  providedIn: 'root'
})
export class TrelloColumnService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService) {
      this.baseUrl = envProvider.current.apiBaseUri;
  }

  // getAll() {
  //   return this._http.get(this.apiUrl)
  //     // .map(res => <Column[]>res.json().data);
  // }

  // get(id: string) {
  //   return this._http.get(this.apiUrl + '/' + id)
  //     // .map(res => <Column>res.json().data);
  // }

  // getCards(id: string) {
  //   return this._http.get(this.apiUrl + '/' + id + '/cards')
  //     // .map(res => <Card[]>res.json().data);
  // }

  getAll(): Observable<Column[]> {
    return this.httpClient.get<Column[]>(`${this.baseUrl}/column`)
    // return this.httpClient.get<Column[]>(`./../../../../assets/data/columns.json`)
  }

  getById(id: string): Observable<Column> {
    return this.httpClient.get<Column>(`${this.baseUrl}/column/${id}`)
  }

}
