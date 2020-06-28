import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProduct } from 'src/app/interfaces/interfaces';
import { DatePipe } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, ActivatedRoute } from '@angular/router';
import { DataPageService } from 'src/app/services/data-page.service';
import { UploadService } from 'src/app/services/upload.service';
import { Observable, Observer } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd/upload';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.less']
})
export class ProductAddComponent implements OnInit {

  idEdit = this.route.snapshot.paramMap.get("id");
  idClone = this.route.snapshot.paramMap.get("clone");
  pageName = "Product"
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
  productImgUplaod: File;
  productImgUpdate: File;
  isUploadImage = false;
  borderred: string;
  display = true;
  validatePicture = true;
  dataEdit: IProduct;
  product_active;
  constructor(
    public datepipe: DatePipe,
    private ProductService: ProductService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private DataPageService: DataPageService,
    private UploadService: UploadService,
    private MessageService: MessageService
  ) { }

  ngOnInit(): void {
    this.DataPageService.breadcrumb = this.DataPageService.getBreadcrumb(this.pageName, 'Add')
    this.insertForm = this.fb.group({
      product_code: [null, [Validators.required]],
      product_name: [null, [Validators.required]],
      product_price: [null],
      product_weight: [null],
      product_detail: [null],
      product_active: [null],
    });
    this.idClone?this.getEditProduct(this.idClone):'';
    this.idEdit? this.getEditProduct(this.idEdit):'';
  }
  saveProduct(): void {
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

      this.insertForm.patchValue({product_active:this.product_active});

      let value = this.insertForm.value;
      this.insertLoading = true;

      if(this.idEdit){
        if(this.productImgUplaod){
          const formDataImage = new FormData();
          formDataImage.append('file', this.productImgUplaod);
          formDataImage.append('path', 'product');

          this.UploadService.uploadImage(formDataImage).subscribe(data => {
            value.file_name = data.file_name;
            this.updateDataFromServer(value, this.idEdit);
          });
          return
        }

        return this.updateDataFromServer(value, this.idEdit);
      }

      const formData = new FormData();
      formData.append('file', this.productImgUplaod);
      formData.append('product_code', value.product_code);
      formData.append('product_name', value.product_name);
      formData.append('product_price', value.product_price);
      formData.append('product_weight', value.product_weight);
      formData.append('product_detail', value.product_detail);

      this.insertDataFromServer(formData);
    }
  }

  getEditProduct(id): void {
      this.ProductService.getEditProduct(id).subscribe( data => {
          if(this.idEdit){
            this.imgInsertUrl = data.product_img_name?data.image_url+data.product_img_name:null;
          }
          this.insertForm.patchValue(data);
          this.product_active = data.product_active;
        });
  }

  insertDataFromServer(formData): void {

    this.ProductService.insertProduct(formData).subscribe( data => {
        this.MessageService.success(data.message);
        this.router.navigateByUrl(this.DataPageService.adminUrl+'/product');
      },
      err => {
        this.insertLoading = false;
      });
  }

  updateDataFromServer(value, idEdit): void {

    this.ProductService.updateProduct(value, idEdit).subscribe( data => {
        this.MessageService.success(data.message);
        this.router.navigateByUrl(this.DataPageService.adminUrl+'/product');
      },
      err => {
        this.insertLoading = false;
      });
  }
  ////// upload เริ่ม
  beforeUploadInsert = (file: File) => {
    // console.log(file);
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.MessageService.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.MessageService.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      this.borderred = '';
      this.validatePicture = true;
      this.productImgUplaod = file;

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
        this.MessageService.error('Network error');
        this.loadingInsert = false;
        break;
    }
  }

}
