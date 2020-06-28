import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataPageService {
  breadcrumb;
  adminUrl = 'manage';
  pageTitleActive;
  pageTitle:string="dashbord";
  admin: boolean = false;
  // current:
  menus = [
    {
      name: 'dashboard',
      icon: 'dashboard',
      subMenu: [
                  {name: 'dashboard', icon: 'dashboard', url: 'manage/welcome'}
               ]
    },
    {
      name: 'web',
      icon: 'form',
      subMenu: [
                  {name: 'slide', icon: 'picture', url: 'manage/slide'},
                  {name: 'about', icon: 'profile', url: 'manage/about'},
                  {name: 'news', icon: 'read', url: 'manage/news'},
               ]
    },
    {
      name: 'stock',
      icon: 'inbox',
      subMenu: [
                  {name: 'product', icon: 'code-sandbox', url: 'manage/product'},
                  {name: 'withdraw', icon: 'dropbox', url: 'manage/withdraw'}
               ]
    }
  ];
  getBreadcrumb(pageName, child=null){
    let breadcrumb = [{name:pageName, url:pageName}];
    if(child){
      breadcrumb.push({name:child, url:pageName+'/'+child});
      this.pageTitle = pageName;
      return breadcrumb;
    }
    this.pageTitle = pageName;
    return breadcrumb;

  }
  constructor() { }
}
