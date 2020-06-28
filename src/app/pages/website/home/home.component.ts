import { Component, OnInit } from '@angular/core';
import { SlideService } from 'src/app/services/slide.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  array = [1, 2, 3, 4];
  imageUrl: string;
  listOfSlide = [];
  constructor(private SlidesService: SlideService) { }

  ngOnInit(): void {
    this.slideList()
  }
  slideList(){
    this.SlidesService.getToWeb().subscribe(data => {
      // let results = data;
      this.imageUrl = data['image_url'];

      this.listOfSlide = data['data'];

    });
  }

}

interface ISlide {
  id: number;
  message: any;
  status: any;
  slide_img_name: string;
  slide_title: string;
  slide_active: boolean;
  created: string;
  updated: string;
}
