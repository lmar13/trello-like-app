import { AuthService } from '../shared/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acc-recovery',
  templateUrl: './acc-recovery.component.html',
  styleUrls: ['./acc-recovery.component.scss']
})
export class AccRecoveryComponent implements OnInit {

  hasLoginError = false;
  signedUp = false;
  email: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  recoverAcc() {
    this.authService.recoverAcc(this.email)
      .subscribe(result => {
        this.hasLoginError = !result;
        this.signedUp = true;
      });
  }

}
