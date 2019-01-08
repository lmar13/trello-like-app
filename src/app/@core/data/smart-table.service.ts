import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartTableService {

  private selectedBoardSource = new BehaviorSubject("0");
  selectedBoard = this.selectedBoardSource.asObservable();

  constructor(
    private httpClient: HttpClient
  ) {}

  getData(): Observable<string[]> {
    return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
  }

  getDataForUser(id: number): Observable<string[]> {
    return this.httpClient.get<string[]>(`./../../../assets/data/data.json`);
  }

  changeSelectedBoard(id: string) {
    this.selectedBoardSource.next(id);
  }
}
