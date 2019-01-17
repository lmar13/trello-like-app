import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from './../shared/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {
  authForm: FormGroup;

  hasError = false;
  signedUp = false;
  canChangePassword = null;
  token: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.canChangePass();
    this.createForm();
  }

  createForm() {
    this.authForm = this.fb.group({
      pass: ['', Validators.compose([
        Validators.required,
        (control: AbstractControl) => this.invalidPass(control)])],
      confirmPass: ['', Validators.required]
    }, {validator: this.checkPasswords});
  }

  canChangePass() {
    this.authService.canChangePass(this.token)
      .subscribe(result => {
        this.canChangePassword = !result;
      });
  }

  changePass() {
    this.authService.changePass(this.authForm.value)
      .subscribe(result => {
        this.hasError = !result;
        this.signedUp = true;
      });
  }

  invalidPass(control: AbstractControl): ValidationErrors | null {
    const inputValue: string = control.value;

    // console.log(this.authForm.errors);

    if (inputValue) {
      if (inputValue === '' || inputValue.length >= 4 ) {
        return null;
      }
      return { invalidPass: true };
    }
  }

  checkPasswords(group: FormGroup): ValidationErrors | null {
    const pass = group.get('pass').value;
    const confirmPass = group.get('confirmPass').value;

    if (confirmPass === '' || confirmPass === pass) {
      return null;
    }

    return { notEquivalent: true };
  }

}
