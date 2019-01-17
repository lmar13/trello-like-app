import { AuthService } from '../../auth/shared/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acc-confirm',
  templateUrl: './acc-confirm.component.html',
  styleUrls: ['./acc-confirm.component.scss']
})
export class AccConfirmComponent implements OnInit {

  accountConfirmation = false;
  token: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.activateAcc();
  }

  activateAcc() {
    this.authService.activateAcc(this.token)
      .subscribe(result => {
        this.accountConfirmation = result;
      });
  }

}
