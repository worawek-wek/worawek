import { Component, OnInit } from '@angular/core';
import { DataPageService } from 'src/app/services/data-page.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.less']
})
export class PageTitleComponent implements OnInit {

  constructor(public DataPageService: DataPageService) { }

  ngOnInit(): void {
  }

}
