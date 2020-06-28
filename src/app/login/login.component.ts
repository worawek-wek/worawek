import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  loginStatus = false;
  isLogingIn = false;
  loading = true;
  constructor(private msg: NzMessageService, private fb: FormBuilder, private router: Router, private AuthService: AuthService) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.valid){
      let value = this.validateForm.value;
      this.isLogingIn = true;
      this.AuthService.login(value.userName, value.password).subscribe(data => {
        this.msg.success(data['message']);
        setTimeout(() => {
        // this.router.navigateByUrl('slide');
          location.reload();
        }, 1000);
      }, err => {
        this.isLogingIn = false;
      });
    }
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      }, 500);
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

}
