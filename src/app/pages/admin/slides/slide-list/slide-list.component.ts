import { Component, Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, empty } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Router, ActivatedRoute } from '@angular/router';
import { SlideService } from 'src/app/services/slide.service';
import { DataPageService } from 'src/app/services/data-page.service';
import { DatePipe } from '@angular/common';
import { UploadService } from 'src/app/services/upload.service';
import { ISlide, Delete } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-slides-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.less']
})
export class SlideListComponent implements OnInit {
  pageName = 'Slide';
  params = this.route.snapshot.queryParams;
  insertForm: FormGroup;
  searchForm: FormGroup;
  total = 1;
  listOfSlide: ISlide[] = [];
  listOfSearchTitle: ISlide[] = [];
  imgInsertUrl: string;
  imgUpdateUrl: string;
  loadingTable = true;
  loadingInsert = false;
  loadingUpdate = false;
  pageSize = this.params.pageSize ? this.params.pageSize : 10;
  pageIndex = this.params.page ? this.params.page : 1;
  nowTotal = this.pageSize*this.pageIndex;
  isVisible = false;
  uploadUpdateDisabled = false;
  insertLoading = false;
  results:any;
  message = "Saved Data Successfully.";
  idDelete: number;
  idUpdate: number;
  vTitleUpdate: any;
  vActiveUpdate: boolean;
  slideImgInsert: File;
  slideImgUpdate: File;
  imageUrl;
  isUploadImage = false;
  // switchValue = true;
  activeLoading = false;
  isUpdating = false;
  isVisiblePic = false;
  picture: string;
  borderred: string;
  displayAdd = false;
  validatePicture = true;
  sortField;
  sortOrder;
  filter = [];
  searchStatus = true;
  autoOption:any;

  // @Output() page = new EventEmitter<string>()
    constructor(
      public datepipe: DatePipe,
      private msg: NzMessageService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private SlideService: SlideService,
      private DataPageService: DataPageService,
      private UploadService: UploadService
      )
    {

    }

  ngOnInit(): void {
    // this.page.emit(this.pageName);
    this.DataPageService.breadcrumb = this.DataPageService.getBreadcrumb(this.pageName)
    // this.DataPageService.pageTitle = this.pageName;
    this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
    this.SlideService.getAutocomplete().subscribe(data => {
      this.listOfSearchTitle = data['data'];
    });
    this.insertForm = this.fb.group({
      slideTitle: [null, [Validators.required]],
    });
    this.searchForm = this.fb.group({
      slide_title: [],
      slide_active: [],
      created_at: [],
    });
  }
  addObtion(event){
    this.autoOption = event;
  }
  search(){
    const value = this.searchForm.value;
    console.log(value.created_at);
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
  add(){
    this.displayAdd = !this.displayAdd;
  }

  insertSlide(): void {
    for (const i in this.insertForm.controls) {
      this.insertForm.controls[i].markAsDirty();
      this.insertForm.controls[i].updateValueAndValidity();
    }
    if(!this.imgInsertUrl){
      this.borderred = 'borderred';
      this.validatePicture = false;
      return
    }
    if(this.insertForm.valid){
      let value = this.insertForm.value;
      this.insertDataFromServer(value.slideTitle);
    }

    this.SlideService.getAutocomplete().subscribe(data => {
      this.listOfSearchTitle = data['data'];
    });
  }
  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: any }>
  ): void {
    this.loadingTable = true;
    this.SlideService.getSlides(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.filter = filter;
      this.loadingTable = false;
      this.searchStatus = true;
      this.isVisible = false;
      this.uploadUpdateDisabled = false;
      this.results = data;
      this.imageUrl = this.results.image_url;
      this.total = this.results.total; // mock the total data here
      this.nowTotal = this.results.to;
      this.listOfSlide = data.data;

    },err => {

      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.filter = filter;
      this.searchStatus = true;
      this.loadingTable = false;
      this.isVisible = false;
      this.uploadUpdateDisabled = false;
    }
    );
  }

  insertDataFromServer(slideTitle): void {
    this.insertLoading = true;

			const formData = new FormData();
      formData.append('file', this.slideImgInsert);
      formData.append('title', slideTitle);
    this.SlideService.insertSlide(formData)
    .subscribe(
      data => {
      // this.searchStatus = false;
      // this.searchForm.reset();
      this.insertForm.reset();
      this.insertLoading = false;
      this.imgInsertUrl = null;
      this.slideImgInsert = null;
      this.messageSuccess(data.message);
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);

      },
      err => {
      this.insertLoading = false;
      this.messageError(err.error.message);
      });
  }

  updateDataFromServer(){

    const formDataImage = new FormData();
    formDataImage.append('file', this.slideImgUpdate);
    formDataImage.append('path', 'slide');

    if(this.isUploadImage === true){

      this.UploadService.uploadImage(formDataImage).subscribe(data => {

        const formDataUpdate = {title:this.vTitleUpdate,active:this.vActiveUpdate,file_name:data.file_name};

        this.SlideService.updateSlide(formDataUpdate,this.idUpdate).subscribe(data => {
          this.isUpdating = false;
          this.isVisible = false;
          this.uploadUpdateDisabled = false;
          this.isUploadImage = false;
          this.messageSuccess(data.message);
          this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
        }, err => {
            this.isUpdating = false;
            this.uploadUpdateDisabled = false;
            this.isUploadImage = false;
            this.messageError(err.error.message);
            console.log(err);
        });
      },err => {

      });

    }else{

      const formDataUpdate = {title:this.vTitleUpdate,active:this.vActiveUpdate};

      this.SlideService.updateSlide(formDataUpdate,this.idUpdate).subscribe(data => {
        this.isUpdating = false;
        this.uploadUpdateDisabled = false;
        this.isVisible = false;
        this.messageSuccess(data.message);
        this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
      }, err => {
          this.isUpdating = false;
          this.uploadUpdateDisabled = false;
          this.messageError(err.error.message);
          console.log(err);
      });

    }
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


  clickSwitch(event, id): void {

    this.activeLoading = true;
    this.SlideService.activeSlide(event, id)
    .subscribe(
      data => {
        this.activeLoading = false;
      },
      err => {
        this.activeLoading = false;
      });
  }

  ////// upload เริ่ม
  beforeUploadInsert = (file: File) => {
    // console.log(file);
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.messageError('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.messageError('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      this.borderred = '';
      this.validatePicture = true;
      this.slideImgInsert = file;

      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };
  beforeUploadUpdate = (file: File) => {
    this.slideImgUpdate = file;
    this.imgUpdateUrl = null;
    this.isUploadImage = true;
    // console.log(file);
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.messageError('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.messageError('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
  handleChangeInsert(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingInsert = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingInsert = false;
          this.imgInsertUrl = img;
          // console.log(this.beforeUpload);
        });
        break;
      case 'error':
        this.messageError('Network error');
        this.loadingInsert = false;
        break;
    }
  }
  handleChangeUpdate(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loadingUpdate = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loadingUpdate = false;
          this.imgUpdateUrl = img;
        });
        break;
      case 'error':
        this.messageError('Network error');
        this.loadingUpdate = false;
        break;
    }
  }
/////// upload จบ

  ////// model เริ่ม
  showModal(slide): void {
    this.isVisible = true;
    this.idUpdate = slide.id;
    this.vTitleUpdate = slide.slide_title;
    this.vActiveUpdate = slide.slide_active;
    this.imgUpdateUrl = this.imageUrl+slide.slide_img_name;
  }
  viewPicture(img): void {
    this.picture = this.imageUrl+img;
    this.isVisiblePic = true;
  }

  handleOk(): void {
    this.uploadUpdateDisabled = true;
    this.isUpdating = true;
    this.updateDataFromServer();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isUploadImage = false;
  }

  mPicCancel(): void {
    this.isVisiblePic = false;
    setTimeout(() => {
      this.picture = '';
    }, 600);
  }
  ////// model จบ

  ////// popconfirm เริ่ม

  confirm(slide): void {
    this.idDelete = slide.id;
    this.loadingTable = true;
    this.SlideService.deleteSlide(this.idDelete).subscribe(data => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
      this.messageSuccess(data.message);
    },err => {
      this.messageError(err.error.message);

    });
  }
  ////// popconfirm จบ

  ///// message
  messageSuccess(success){
    this.msg.success(success, {nzDuration:7000});
  }
  messageError(error){
    this.msg.error(error, {nzDuration:7000});
  }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

checked = false;
  loadingDeleteAll = false;
  indeterminate = false;
  // listOfData: ISlide[] = [];
  listOfCurrentPageData: Delete[] = [];
  setOfCheckedId = new Set<number>();

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
    // const requestData = this.listOfSlide.filter(data => this.setOfCheckedId.has(data.id));

    // this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', [{key:'deleteId',value:Array.from(this.setOfCheckedId)}]);

    this.SlideService.deleteSlide(Array.from(this.setOfCheckedId)).subscribe(data => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', this.filter);
      this.messageSuccess(data.message);
    },err => {
      this.messageError(err.error.message);

    });
    console.log(this.setOfCheckedId);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loadingDeleteAll = false;
    }, 1000);
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}

