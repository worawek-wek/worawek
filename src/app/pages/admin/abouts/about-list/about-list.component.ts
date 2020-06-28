import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer, empty } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UploadService } from 'src/app/services/upload.service';
import { AboutService } from 'src/app/services/about.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DataPageService } from 'src/app/services/data-page.service';
import { IAbout } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-about-list',
  templateUrl: './about-list.component.html',
  styleUrls: ['./about-list.component.less']
})
export class AboutListComponent implements OnInit {

  public Editor = ClassicEditor;
  pageName = 'About Us';
  vTitleActive: boolean;
  aboutDetail = {};
  uploadForm = true;
  loading = false;
  updateForm: FormGroup;
  borderred: string;
  imgUpdateUrl: string;
  validatePicture = true;
  aboutImgUpdate: File;
  isUploadImage = false;
  isUpdating = true;
  loadingUpdate = false;
  idUpdate = 1;
  vDetail : string;
  disabledTitle: boolean = false;
  vTitle: string;
  aboutList: IAbout;
  marks: object;
  constructor(
    private DataPageService: DataPageService,
    private msg: NzMessageService,
    private AboutService: AboutService,
    private fb: FormBuilder,
    private UploadService:UploadService
    ) { }

  ngOnInit(): void {
    this.DataPageService.breadcrumb = this.DataPageService.getBreadcrumb(this.pageName)
    this.getAbout()
    this.updateForm = this.fb.group({
      about_detail: [null, [Validators.required]],
      about_title_active: [null, [Validators.required]],
      about_title: [null],
      about_title_float: [null],
      file_name: [null],
      about_img_width: [null],
    });
  }
  getAbout() {
    this.AboutService.getAbout().subscribe(data =>{
      this.loading = false;
      this.aboutList = data.data;
      let imgWidth = this.aboutList.about_img_width;
      this.marks = { [imgWidth] : imgWidth};
      this.imgUpdateUrl = this.aboutList.about_img_name?data['image_url']+this.aboutList.about_img_name:null;
      this.isUpdating = false;
      // this.vDetail = data['data']['about_detail'];
      // this.vTitleActive = data['data']['about_title_active'];
      // this.vTitle = data['data']['about_title'];
    });
  }
  reset(e: MouseEvent){
    e.preventDefault();
    this.isUpdating = true;
    this.loading = true;
    this.getAbout();
  }
  UpdateAbout(){
    this.isUpdating = true;

    for (const i in this.updateForm.controls) {
      this.updateForm.controls[i].markAsDirty();
      this.updateForm.controls[i].updateValueAndValidity();
    }
    if(!this.imgUpdateUrl){
      this.borderred = 'borderred';
      this.validatePicture = false;
      return
    }
    if(!this.updateForm.valid){
      return
    }
    this.loading = true;
    const formDataImage = new FormData();
    formDataImage.append('file', this.aboutImgUpdate);
    formDataImage.append('path', "about");

    let value = this.updateForm.value;
    if(this.isUploadImage === true){

      this.UploadService.uploadImage(formDataImage).subscribe(data => {
        value.file_name = data.file_name;
        this.AboutService.updateAbout(value,this.idUpdate).subscribe(data => {
          this.getAbout()
          this.isUpdating = false;
          this.isUploadImage = false;
          this.messageSuccess(data.message);
        }, err => {
            this.loading = false;
            this.isUpdating = false;
            this.isUploadImage = false;
            console.log(err);
        });
      },err => {
        console.log(err);
      });

    }else{
      this.AboutService.updateAbout(value,this.idUpdate).subscribe(data => {
        this.getAbout()
        this.loading = false;
        this.isUpdating = false;
        this.isUploadImage = false;
        this.messageSuccess(data.message);
        // this.loadDataFromServer();
      }, err => {
          this.loading = false;
          this.isUpdating = false;
          this.isUploadImage = false;
          console.log(err);
      });

    }
  }
  beforeUploadUpdate = (file: File) => {
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
      this.aboutImgUpdate = file;
      this.imgUpdateUrl = null;
      this.isUploadImage = true;
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

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
  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
  messageSuccess(success){
    this.msg.success(success, {nzDuration:7000});
  }
  messageError(error){
    this.msg.error(error, {nzDuration:7000});
  }

}
