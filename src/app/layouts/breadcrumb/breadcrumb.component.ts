import { Component, OnInit } from '@angular/core';
import { DataPageService } from 'src/app/services/data-page.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {

  constructor(public DataPageService: DataPageService) { }

  ngOnInit(): void {

  }

}
