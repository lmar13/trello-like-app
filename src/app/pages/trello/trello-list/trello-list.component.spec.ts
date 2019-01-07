import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloListComponent } from './trello-list.component';

describe('TrelloListComponent', () => {
  let component: TrelloListComponent;
  let fixture: ComponentFixture<TrelloListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrelloListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
