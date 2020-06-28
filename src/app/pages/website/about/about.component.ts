import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AboutService } from 'src/app/services/about.service';
import { IAboutWeb } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit {
  aboutList : IAboutWeb;
  imgUpdateUrl : string;
  image = environment.apiUrl+'../upload/Capture.png';
  constructor(
    private AboutService: AboutService
  ) { }

  ngOnInit(): void {
   this.getToWeb()
  }

  getToWeb() {
    this.AboutService.getToWeb().subscribe(data =>{
      this.aboutList = data['data'];
      this.imgUpdateUrl = this.aboutList.name?data['image_url']+this.aboutList.name:null;
      // this.vDetail = data['data']['about_detail'];
      // this.vTitleActive = data['data']['about_title_active'];
      // this.vTitle = data['data']['about_title'];
    });
  }

}
