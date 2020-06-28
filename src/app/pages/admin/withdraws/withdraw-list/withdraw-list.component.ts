
import { Component, OnInit } from '@angular/core';
import { DataPageService } from 'src/app/services/data-page.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IProduct, Delete } from 'src/app/interfaces/interfaces';
import { DatePipe } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, ActivatedRoute } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-withdraw-list',
  templateUrl: './withdraw-list.component.html',
  styleUrls: ['./withdraw-list.component.less']
})
export class WithdrawListComponent implements OnInit {

  pageName = 'Product';
  params = this.route.snapshot.queryParams;
  searchForm: FormGroup;
  total = 1;
  listOfProduct: IProduct[] = [];
  listOfSearchCode: IProduct[] = [];
  listOfSearchName: IProduct[];
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
  // listOfData: IProduct[] = [];
  listOfCurrentPageData: Delete[] = [];
  autoOptionCode:any;
  autoOptionName:any;
  qty: number = 1;
  constructor(
    public datepipe: DatePipe,
    private ProductService: ProductService,
    private MessageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private DataPageService: DataPageService,
    ) { }

  ngOnInit(): void {
    this.DataPageService.breadcrumb = this.DataPageService.getBreadcrumb(this.pageName)
    this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
    this.ProductService.getAutocomplete('product_name').subscribe(data => {
      this.listOfSearchName = data.data;
    });
    this.ProductService.getAutocomplete('product_code').subscribe(data => {
      this.listOfSearchCode = data.data;
    });
    this.searchForm = this.fb.group({
      product_code: [],
      product_name: [],
      product_active: [],
      created_at: [],
    });
  }
  addObtionCode(event){
    this.autoOptionCode = event;
  }
  addObtionName(event){
    this.autoOptionName = event;
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
  addStock(id,i,pqty){
    console.log(this.qty)
    if(!this.qty){
      return
    }
    this.listOfProduct[i].product_qty = null;
    this.ProductService.addStock(id, {stock_qty: this.qty}).subscribe( data =>{
      this.MessageService.success(data.message);
      this.listOfProduct[i].product_qty = data['stock_qty'];
    },err => {
      this.listOfProduct[i].product_qty = pqty;
    }
    );
    this.qty = 1;

  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || '';
    let sortOrder = (currentSort && currentSort.value) || '';
    switch (sortOrder) {
      case ('ascend'):
        sortOrder ='asc';
      break;
      case ('descend'):
        sortOrder ='desc';
      break;
      default:
        sortOrder = '';
        sortField = '';
      break;
    }
    // return console.log(sortField);

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
    this.ProductService.getProduct(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
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
      this.listOfProduct = data.data;

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
    // this.loadingTable = true;
    this.ProductService.deleteProduct(id).subscribe(data => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', []);
      this.MessageService.success(data.message);
    },
    err => {
      this.activeLoading = false;
    });
  }

  clickSwitch(event, id): void {

    this.activeLoading = true;
    let form = {product_active:event}
    this.ProductService.updateProduct(form, id)
    .subscribe(
      data => {
        this.activeLoading = false;
      },
      err => {
        this.activeLoading = false;
      });
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
    this.ProductService.deleteProduct(Array.from(this.setOfCheckedId)).subscribe(data => {
      this.loadDataFromServer(this.pageIndex, this.pageSize, '', '', this.filter);
      this.MessageService.success(data.message);
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loadingDeleteAll = false;
    },err => {
      this.MessageService.error(err.error.message);
      this.loadingDeleteAll = false;
    });
  }

}

