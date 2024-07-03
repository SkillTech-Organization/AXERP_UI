import { Injectable } from '@angular/core';
import { PocData } from '../business/master-data/models/PocData';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  public mockData: PocData[] = [
    new PocData(0, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(1, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(2, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(3, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(4, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(5, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(6, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(7, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(8, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(9, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(10, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb"),
    new PocData(11, "Dénes", "A", "Lorem", "Ipsum", "Dolor", "Valami", new Date(), "ASDFA-GDS/122/A-B", "ASD", new Date(), "B", true, 12412.42, "abfdb")
  ]

  constructor() { }

  public GetMockData(request?: any): Promise<PocData[] | undefined> {
    return of(this.mockData).toPromise()
  }

  public AddData(data: PocData): Promise<any> {
    this.mockData.push(data)
    return of({}).toPromise()
  }

  public UpdateData(data: PocData): Promise<PocData | undefined> {
    var idx = this.mockData.findIndex(x => x.ID === data.ID)
    this.mockData[idx] = data
    return of(this.mockData[idx]).toPromise()
  }

  public DeleteData(id: number): Promise<boolean | undefined> {
    var idx = this.mockData.findIndex(x => x.ID === id)
    this.mockData.splice(idx, 1)
    return of(true).toPromise()
  }
}

