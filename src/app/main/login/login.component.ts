import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeOutAnimation } from '../../core/common/route.animation';
import { LoginService } from './login.service';

@Component({
  selector: 'fury-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    '[@fadeOutAnimation]': 'true'
  },
  animations: [fadeOutAnimation]
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  inputType = 'password';
  visible = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private loginService: LoginService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  send() {
    console.log('login');
    this.loginService.login(this.form.value).subscribe((res: any) => {
      if (res.status) {
        localStorage.setItem('auth_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);
        this.loginService.userInfo().subscribe((response: any) => {
          if (response.status) {
            localStorage.setItem('username', response.data.username);
          }
        });
        this.router.navigateByUrl('/email');
      }
    });
  }

  show() {
    this.inputType = 'text';
    this.visible = true;
    this.cd.markForCheck();
  }

  hide() {
    this.inputType = 'password';
    this.visible = false;
    this.cd.markForCheck();
  }
}
