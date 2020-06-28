import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataPageService } from 'src/app/services/data-page.service';
import { NewsService } from 'src/app/services/news.service';
import { INews, Delete } from 'src/app/interfaces/interfaces';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.less']
})
export class NewsListComponent implements OnInit {
  pageName = 'News';
  params = this.route.snapshot.queryParams;
  searchForm: FormGroup;
  total = 1;
  listOfNews: INews[] = [];
  listOfSearchTitle: INews[] = [];

  loadingTable = true;

  pageSize = this.params.pageSize ? this.params.pageSize : 10;
  pageIndex = this.params.page ? this.params.page : 1;
  nowTotal = this.pageSize*this.pageIndex;
  isVisible = false;
  results:any;
  message = "Saved Data Successfully.";
  imageUrl;
  // switchValue = true;
  activeLoading = false;
  isUpdating = false;
  isVisiblePic = false;
  picture: string;
  sortField;
  sortOrder;
  filter = [];
  searchStatus = true;
  setOfCheckedId = new Set<number>();
  loadingDeleteAll = false;
  indeterminate = false;
  // listOfData: INews[] = [];
  listOfCurrentPageData: Delete[] = [];
  autoOption:any;

  constructor(
    public datepipe: DatePipe,
    private NewsService: NewsService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private DataPageService: DataPageService,
    ) { }

  ngOnInit(): void {
    this.DataPageService.breadcrumb = this.DataPageService.getBreadcrumb(this.pageName)
    this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
    this.NewsService.getAutocomplete().subscribe(data => {
      this.listOfSearchTitle = data['data'];
    });
    this.searchForm = this.fb.group({
      news_title: [],
      news_active: [],
      created_at: [],
    });
  }
  addObtion(event){
    this.autoOption = event;
  }
  search(){
    const value = this.searchForm.value;
    if(!this.searchStatus){
      return
    }
    if(value.created_at == '' || value.created_at == null){
    }else{
      value.created_at[0] = this.datepipe.transform(value.created_at[0], 'yyyy-MM-dd');
      value.created_at[1] = this.datepipe.transform(value.created_at[1], 'yyyy-MM-dd');
    }

    let filter = [];
    for (const i in value) {
      value[i] = value[i] || '' ;
      filter.push({key:i, value:value[i]});
    }
    this.loadDataFromServer(1, this.pageSize, this.sortField, this.sortOrder, filter);
  }

  clearSearch(){
    const value = this.searchForm.value;
    let check = false;
    for (const i in value) {
      if(value[i]){
        check = true;
      }
    }
    if(!check){
      return
    }
    this.searchStatus = false;
    this.searchForm.reset();
    this.loadDataFromServer(1, this.pageSize, this.sortField, this.sortOrder,[]);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    switch (params.sort[0].value) {
      case ('ascend'):
        params.sort[0].value='asc';
      break;
      case ('descend'):
        params.sort[0].value='desc';
      break;
      default:
        params.sort[0].value='';
        params.sort[0].key='';
      break;
    }
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || '';
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, this.filter);
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: any }>
  ): void {
    this.loadingTable = true;
    this.NewsService.getNews(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.filter = filter;
      this.loadingTable = false;
      this.searchStatus = true;
      this.isVisible = false;
      this.results = data;
      this.imageUrl = this.results.image_url;
      this.total = this.results.total; // mock the total data here
      this.nowTotal = this.results.to;
      this.listOfNews = data.data;

    },err => {

      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.filter = filter;
      this.searchStatus = true;
      this.loadingTable = false;
      this.isVisible = false;
    }
    );
  }

  deleate(id): void {
    console.log(id)
    this.loadingTable = true;
    this.NewsService.deleteNews(id).subscribe(data => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
      this.messageSuccess(data.message);
    },err => {
      this.messageError(err.error.message);

    });
  }

  clickSwitch(event, id): void {

    this.activeLoading = true;
    let form = {news_active:event}
    this.NewsService.activeNews(form, id)
    .subscribe(
      data => {
        this.activeLoading = false;
      },
      err => {
        this.activeLoading = false;
      });
  }

  showModal(news): void {
    // this.isVisible = true;
    // this.idUpdate = news.id;
    // this.vTitleUpdate = news.news_title;
    // this.vActiveUpdate = news.news_active;
    // this.imgUpdateUrl = this.imageUrl+news.news_img_name;
  }

  viewPicture(img): void {
    this.picture = this.imageUrl+img;
    this.isVisiblePic = true;
  }

  mPicCancel(): void {
    this.isVisiblePic = false;
    setTimeout(() => {
      this.picture = '';
    }, 600);
  }

  checked = false;

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Delete[]): void {
    // console.log(listOfCurrentPageData);
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    console.log(id);
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loadingDeleteAll = true;
    this.NewsService.deleteNews(Array.from(this.setOfCheckedId)).subscribe(data => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', this.filter);
      this.messageSuccess(data.message);
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loadingDeleteAll = false;
    },err => {
      this.messageError(err.error.message);
      this.loadingDeleteAll = false;
    });
  }
  messageSuccess(success){
    this.msg.success(success, {nzDuration:7000});
  }
  messageError(error){
    this.msg.error(error, {nzDuration:7000});
  }

}
