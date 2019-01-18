import { Component, OnInit, TemplateRef, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { TrelloColumnService } from '../trello-column/trello-column.service';
import { Subscription } from 'rxjs';
import { Column, Card } from '../../../@core/model';

@Component({
  selector: 'ngx-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnDestroy {
  @Input() card: Card;

  @Output() onEditCard = new EventEmitter<Card>();

  title = "Edit card";
  columns = [] as Column[];
  // users = ['Planning', 'Development', 'Testing', 'Ready to archive'];
  // userSelected = ['Planning', 'Testing'];

  form: FormGroup;
  dialogRef: any;

  private subscriptions: Subscription[] = [];

  constructor(private dialogService: NbDialogService,
              private fb: FormBuilder,
              private columnService: TrelloColumnService) {
    this.columnService.getAll().subscribe(columns => this.columns = columns);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm() {
    this.form = this.fb.group({
      title: [this.card.title, Validators.required],
      content: [this.card.content],
      columnId: [this.card.columnId, Validators.required],
      assignedUsers: [this.card.assignedUsers, Validators.required],
      owner: [this.card.owner]
    });
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick : false, closeOnEsc: false });
    this.createForm();
  }

  submit() {
    let formData: Card = this.form.value;

    // console.log(formData);

    formData = {
      ...formData,
      owner: 'owner',
      boardId: this.card.boardId,
      order: 0,
    };

    this.onEditCard.emit(formData);
    this.dialogRef.close();
  }

}
