import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  success(success){
    this.msg.success(success, {nzDuration:7000});
  }
  error(error){
    this.msg.error(error, {nzDuration:7000});
  }
  constructor(
    private msg: NzMessageService,
  ) { }
}
