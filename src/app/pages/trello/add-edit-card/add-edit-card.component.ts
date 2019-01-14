import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-add-edit-card',
  template: `
    <ng-template #dialog let-data let-ref="dialogRef">
      <nb-card>
        <nb-card-header>Template Dialog</nb-card-header>
        <nb-card-body>{{ data.name }}</nb-card-body>
        <nb-card-footer>
          <button nbButton (click)="ref.close()">Close Dialog</button>
        </nb-card-footer>
      </nb-card>
    </ng-template>
    <span (click)="open(dialog)">{{ title }}</span>
  `,
  styleUrls: ['./add-edit-card.component.scss']
})
export class AddEditCardComponent {

  @Input() title: string;

  constructor(private dialogService: NbDialogService) { }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: { name: this.title} });
  }

}
