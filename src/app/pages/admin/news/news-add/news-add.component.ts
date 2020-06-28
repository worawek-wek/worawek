import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NewsService } from 'src/app/services/news.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, ActivatedRoute } from '@angular/router';
import { DataPageService } from 'src/app/services/data-page.service';
import { Observable, Observer } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd/upload';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { INews } from 'src/app/interfaces/interfaces';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-news-add',
  templateUrl: './news-add.component.html',
  styleUrls: ['./news-add.component.less']
})
export class NewsAddComponent implements OnInit {
  idEdit = this.route.snapshot.paramMap.get("id");
  pageName = "News"
  public Editor = ClassicEditor;
  insertForm: FormGroup;
  imgInsertUrl: string;
  imgUpdateUrl: string;
  loadingInsert = false;
  loadingUpdate = false;
  insertLoading = false;
  uploadUpdateDisabled = false;
  vTitleUpdate: any;
  vActiveUpdate: boolean;
  newsImgUplaod: File;
  newsImgUpdate: File;
  isUploadImage = false;
  borderred: string;
  display = true;
  validatePicture = true;
  dataEdit: INews;
  news_active;
  constructor(
    public datepipe: DatePipe,
    private NewsService: NewsService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private DataPageService: DataPageService,
    private UploadService: UploadService
  ) { }

  ngOnInit(): void {

    this.DataPageService.breadcrumb = this.DataPageService.getBreadcrumb(this.pageName, 'Add')
    this.insertForm = this.fb.group({
      news_title: [null, [Validators.required]],
      news_detail_short: [null],
      news_detail: [null],
      news_active: [null],
    });
    this.idEdit? this.editNews(this.idEdit):'';
  }
  saveNews(): void {
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

      this.insertForm.patchValue({news_active:this.news_active});

      let value = this.insertForm.value;
      this.insertLoading = true;

      if(this.idEdit){
        if(this.newsImgUplaod){
          const formDataImage = new FormData();
          formDataImage.append('file', this.newsImgUplaod);
          formDataImage.append('path', 'news');

          this.UploadService.uploadImage(formDataImage).subscribe(data => {
            value.file_name = data.file_name;
            this.updateDataFromServer(value, this.idEdit);
          });
          return
        }

        return this.updateDataFromServer(value, this.idEdit);
      }

      const formData = new FormData();
      formData.append('file', this.newsImgUplaod);
      formData.append('news_title', value.news_title);
      formData.append('news_detail_short', value.news_detail_short);
      formData.append('news_detail', value.news_detail);

      this.insertDataFromServer(formData);
    }
  }

  editNews(id): void {
      this.NewsService.editNews(id).subscribe( data => {
          this.imgInsertUrl = data.news_img_name?data.image_url+data.news_img_name:null;
          this.insertForm.patchValue(data);
          this.news_active = data.news_active;
          this.dataEdit = data;
        },
        err => {
        });
  }

  insertDataFromServer(formData): void {

    this.NewsService.insertNews(formData).subscribe( data => {
        this.messageSuccess(data.message);
        this.router.navigateByUrl(this.DataPageService.adminUrl+'/news');
      },
      err => {
        this.insertLoading = false;
        this.messageError(err.error.message);
      });
  }

  updateDataFromServer(value, idEdit): void {


    this.NewsService.updateNews(value, idEdit).subscribe( data => {
        this.messageSuccess(data.message);
        this.router.navigateByUrl(this.DataPageService.adminUrl+'/news');
      },
      err => {
        this.insertLoading = false;
        this.messageError(err.error.message);
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
      this.newsImgUplaod = file;

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
  messageSuccess(success){
    this.msg.success(success, {nzDuration:7000});
  }
  messageError(error){
    this.msg.error(error, {nzDuration:7000});
  }
}
