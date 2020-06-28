import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {MediaObserver} from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData, DatePipe } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
// import { NewsListComponent } from './pages/news/news-list/news-list.component';
import { SlideListComponent } from './pages/admin/slides/slide-list/slide-list.component';
// import { TableComponent } from './layouts/table/table.component';
// import { PaginationComponent } from './layouts/pagination/pagination.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SlideService } from './services/slide.service';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { LoginComponent } from './login/login.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { BreadcrumbComponent } from './layouts/breadcrumb/breadcrumb.component';
import { DataPageService } from './services/data-page.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PageTitleComponent } from './layouts/page-title/page-title.component';
import { HomeComponent } from './pages/website/home/home.component';
import { UploadComponent } from './layouts/upload/upload.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ProductComponent } from './pages/website/product/product.component';
import { ContactComponent } from './pages/website/contact/contact.component';
import { AboutComponent } from './pages/website/about/about.component';
import { AboutListComponent } from './pages/admin/abouts/about-list/about-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AboutService } from './services/about.service';
import { UploadService } from './services/upload.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NewsListComponent } from './pages/admin/news/news-list/news-list.component';
import { NewsService } from './services/news.service';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NewsAddComponent } from './pages/admin/news/news-add/news-add.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ProductListComponent } from './pages/admin/products/product-list/product-list.component';
import { ProductAddComponent } from './pages/admin/products/product-add/product-add.component';
import { ProductService } from './services/product.service';
import { MessageService } from './services/message.service';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { WithdrawListComponent } from './pages/admin/withdraws/withdraw-list/withdraw-list.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    // NewsListComponent,
    SlideListComponent,
    HomeComponent,
    // TableComponent,
    // PaginationComponent,
    LoginComponent,
    BreadcrumbComponent,
    PageTitleComponent,
    UploadComponent,
    ProductComponent,
    ContactComponent,
    AboutComponent,
    AboutListComponent,
    NewsListComponent,
    NewsAddComponent,
    ProductListComponent,
    ProductAddComponent,
    WithdrawListComponent,
  ],
  imports: [
    BrowserModule,
    // MediaObserver,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    HttpClientModule,
    BrowserAnimationsModule,
    NzTableModule,
    NzButtonModule,
    NzDividerModule,
    NzPaginationModule,
    NzGridModule,
    NzSpaceModule,
    NzUploadModule,
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzSwitchModule,
    NzAvatarModule,
    NzPageHeaderModule,
    NzCheckboxModule,
    NzCardModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCarouselModule,
    NzDrawerModule,
    AngularEditorModule,
    CKEditorModule,
    NzSliderModule,
    NzTabsModule,
    NzRadioModule,
    NzAutocompleteModule,
    NzSkeletonModule,
    NzInputNumberModule
  ],
  providers: [
                {
                  provide: NZ_I18N,
                  useValue: en_US
                },
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: AuthInterceptor,
                  multi: true
                },
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: ErrorInterceptor,
                  multi: true
                },
                DataPageService,
                SlideService,
                AuthService,
                DatePipe,
                AboutService,
                UploadService,
                NewsService,
                ProductService,
                MessageService,
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
