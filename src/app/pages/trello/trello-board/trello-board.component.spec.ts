import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloBoardComponent } from './trello-board.component';

describe('TrelloBoardComponent', () => {
  let component: TrelloBoardComponent;
  let fixture: ComponentFixture<TrelloBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrelloBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
