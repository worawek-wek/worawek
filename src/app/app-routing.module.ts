import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import { SlideListComponent } from './pages/admin/slides/slide-list/slide-list.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminGuard } from './helpers/admin.guard';
import { HomeComponent } from './pages/website/home/home.component';
import { ProductComponent } from './pages/website/product/product.component';
import { ContactComponent } from './pages/website/contact/contact.component';
import { AboutComponent } from './pages/website/about/about.component';
import { AboutListComponent } from './pages/admin/abouts/about-list/about-list.component';
import { NewsListComponent } from './pages/admin/news/news-list/news-list.component';
import { NewsAddComponent } from './pages/admin/news/news-add/news-add.component';
import { ProductListComponent } from './pages/admin/products/product-list/product-list.component';
import { ProductAddComponent } from './pages/admin/products/product-add/product-add.component';
import { WithdrawListComponent } from './pages/admin/withdraws/withdraw-list/withdraw-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'product', component: ProductComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  {
    path: 'adminmanage', component: LoginComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'manage/slide', component: SlideListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/about', component: AboutListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/news', component: NewsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/news/add', component: NewsAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/news/:id/edit', component: NewsAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/product', component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/product/add', component: ProductAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/product/add/:clone', component: ProductAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/product/:id/edit', component: ProductAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/withdraw', component: WithdrawListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'app', component: AppComponent},
  { path: 'welcome', component: WelcomeComponent,
  canActivate: [AuthGuard]},

  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
