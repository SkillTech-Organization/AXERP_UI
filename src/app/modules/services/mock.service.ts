import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { GasTransaction } from '../pages/master-data/transactions/models/GasTransaction';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  public mockData: GasTransaction[] = [
  
  ]

  constructor() { }

  public GetMockData(request?: any): Promise<GasTransaction[] | undefined> {
    return of(this.mockData).toPromise()
  }

  public AddData(data: GasTransaction): Promise<any> {
    this.mockData.push(data)
    return of({}).toPromise()
  }

  public UpdateData(data: GasTransaction): Promise<GasTransaction | undefined> {
    var idx = this.mockData.findIndex(x => x.DeliveryID === data.DeliveryID)
    this.mockData[idx] = data
    return of(this.mockData[idx]).toPromise()
  }

  public DeleteData(id: number, idSffx: string): Promise<boolean | undefined> {
    var idx = this.mockData.findIndex(x => x.DeliveryID === id && x.DeliveryIDSffx === idSffx)
    this.mockData.splice(idx, 1)
    return of(true).toPromise()
  }
}

