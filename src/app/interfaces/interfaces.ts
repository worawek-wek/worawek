export interface Interfaces {
}

export interface ISlide {
  id: number;
  message: any;
  status: any;
  slide_img_name: string;
  slide_title: string;
  slide_active: boolean;
  created: string;
  updated: string;
}
export interface IUpload {
  file_name: string;
}
export interface IResponse {
  status: number;
  message: string;
}
export interface IAbout {
  id: number;
  about_img_width: number;
  about_title: string;
  about_title_float: string;
  about_title_active: boolean;
  about_detail: string;
  about_img_name: string;
  created: string;
  updated: string;
}
export interface IAboutWeb {
  id: number;
  title: string;
  active: boolean;
  detail: string;
  title_float: string;
  name: string;
  img_width: number;
  created: string;
  updated: string;
}

export interface INews {
  id: number;
  // news_img_width: number;
  news_title: string;
  image_url: string;
  // news_title_float: string;
  news_active: boolean;
  news_detail_short: string;
  news_detail: string;
  news_img_name: string;
  created: string;
  updated: string;
}
export interface INewsWeb {
  id: number;
  title: string;
  active: boolean;
  detail: string;
  detail_short: string;
  name: string;
  created: string;
  updated: string;
}

export interface IProduct {
  id: number;
  product_code: string;
  product_name: string;
  product_active: boolean;
  product_detail: string;
  product_qty: number;
  product_price: number;
  product_weight: number;
  product_img_name: string;
  image_url: string;
  created: string;
  updated: string;
}

export interface IProductWeb {
  id: number;
  code: string;
  name: string;
  active: boolean;
  detail: string;
  qty: number;
  price: number;
  weight: number;
  img_name: string;
  created: string;
  updated: string;
}

export interface Delete {
  id: number;
}
