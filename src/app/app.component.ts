import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataPageService } from './services/data-page.service';
import { SlideService } from './services/slide.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  isCollapsed = false;
  menus = this.DataPageService.menus;
  loginStatus = false;
  user_id = localStorage.getItem("user_id");
  user_name = this.AuthService.user_name;
  pageTitle: string;
  visible = false;
  logo = environment.apiUrl+'../upload/logo.png';

  imageUrl: string;
  listOfSlide: [];

  constructor(public location:Location,private msg: NzMessageService, private router: Router, public AuthService: AuthService, public DataPageService: DataPageService,private SlidesService: SlideService) {}

  ngOnInit(): void {
    // localStorage.removeItem('redirect');
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  pageName(v){
    this.pageTitle = v;
  }
  logout(){
    this.AuthService.logedout().subscribe(data => {
      this.msg.success(data['message']);
      this.router.navigateByUrl('adminmanage');
    });

    // setTimeout(() => {
    //   location.reload();
    // }, 1000);
    // this.msg.success("Logged out");
  }


}
