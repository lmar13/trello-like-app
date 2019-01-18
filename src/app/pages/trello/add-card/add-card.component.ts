import { Component, Input, OnDestroy, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { Column, Card } from '../../../@core/model';
import { TrelloColumnService } from '../trello-column/trello-column.service';

@Component({
  selector: 'ngx-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnDestroy {

  @Input() boardId: string;

  @Output() onAddCard = new EventEmitter<Card>();

  title = "Add new card"
  columns = [] as Column[];
  users = ['Planning', 'Development', 'Testing', 'Ready to archive'];
  userSelected = ['Planning', 'Testing'];

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
      title: ['', Validators.required],
      content: [''],
      columnId: ['', Validators.required],
      assignedUsers: [this.userSelected, Validators.required],
      owner: ['']
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
      boardId: this.boardId,
      order: 0,
    };

    this.onAddCard.emit(formData);
    this.dialogRef.close();
  }

}
