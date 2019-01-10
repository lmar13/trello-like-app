import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Board } from '../model';
import { EnvironmentProviderService } from './environment-provider.service';

@Injectable({
  providedIn: 'root'
})
export class SmartTableService {

  private selectedBoardSource = new BehaviorSubject("0");
  selectedBoard = this.selectedBoardSource.asObservable();
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    envProvider: EnvironmentProviderService,
  ) {
    this.baseUrl = envProvider.current.apiBaseUri;
  }

  getData(): Observable<Board[]> {
    // return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
    return this.httpClient.get<Board[]>(`${this.baseUrl}/board`)
  }

  getDataForUser(id: number): Observable<string[]> {
    return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
  }

  changeSelectedBoard(id: string) {
    this.selectedBoardSource.next(id);
  }
}
