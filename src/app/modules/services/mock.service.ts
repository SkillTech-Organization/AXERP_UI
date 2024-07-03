import { Injectable } from '@angular/core';
import { GasTransaction } from '../business/master-data/models/GasTransaction';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  public mockData: GasTransaction[] = [
    new GasTransaction("Purchase", "1", new Date(2023, 10, 11), new Date(2023, 10, 4), "ZTP Hub", "VERBIO", "Biomethane", "Kwh", 2319984.1, "", "BARVL529", "", "", "12"),
    new GasTransaction("Purchase", "2", new Date(2022, 10, 18), new Date(2022, 11, 28), "Zeebrugge LNG Terminal", "VERBIO", "Biomethane", "Kwh", 2319984, "", "BARVL529", "", "", "12"),
    new GasTransaction("Consignment", "3", new Date(2023, 10, 5), new Date(2023, 10, 10), "ZTP Hub", "VERBIO", "Biomethane", "Kwh", 2319984.05, "", "WGM1157J", "", "", "523"),
    new GasTransaction("Retrieval", "4", new Date(2021, 10, 6), new Date(2021, 12, 28), "ZTP Hub", "Proprietary", "Bio-LNG", "Kwh", 5326431.241, "", "VECKK963", "", "", "12"),
    new GasTransaction("Consignment", "5", new Date(2023, 10, 12), new Date(2023, 10, 28), "ZTP Hub", "VERBIO", "Biomethane", "Kwh", 2319984, "", "BARVL5429", "", "", "53"),
    new GasTransaction("Retrieval", "6", new Date(2023, 10, 10), new Date(2023, 11, 3), "Zeebrugge LNG Terminal", "VERBIO", "Biomethane", "Kwh", 2319984, "", "BARVL529", "", "", "64"),
    new GasTransaction("Purchase", "7", new Date(2024, 10, 5), new Date(2024, 10, 28), "Zeebrugge LNG Terminal", "VERBIO", "Biomethane", "Kwh", 2319984, "", "BARVL529", "", "", "23"),
    new GasTransaction("Sale", "8", new Date(2024, 10, 6), new Date(2024, 11, 28), "ZTP Hub", "VERBIO", "Biomethane", "Kwh", 5325321, "", "BARVL5529", "", "", "643"),
    new GasTransaction("Consignment", "9", new Date(2023, 10, 2), new Date(2023, 10, 5), "ZTP Hub", "VERBIO", "Bio-LNG", "Kwh", 1212111, "", "BARVL45529", "", "", "12"),
    new GasTransaction("Purchase", "10", new Date(2022, 10, 6), new Date(2022, 10, 28), "ZTP Hub", "VERBIO", "Biomethane", "Kwh", 124112.12, "", "WGM1157J", "", "", "53"),
    new GasTransaction("Sale", "11", new Date(2023, 10, 8), new Date(2023, 12, 10), "ZTP Hub", "Proprietary", "Biomethane", "Kwh", 2319984, "", "VECKK963", "", "", "12"),
    new GasTransaction("Retrieval", "12", new Date(2022, 10, 20), new Date(2022, 10, 28), "ZTP Hub", "Proprietary", "Biomethane", "Kwh", 1242124.532, "", "BARVL529", "", "", "5"),
    new GasTransaction("Purchase", "13", new Date(2024, 10, 15), new Date(2024, 10, 28), "Zeebrugge LNG Terminal", "VERBIO", "Biomethane", "Kwh", 2319984, "", "BARVL529", "", "", "6"),
    new GasTransaction("Sale", "14", new Date(2023, 10, 18), new Date(2023, 11, 15), "ZTP Hub", "Proprietary", "Bio-LNG", "Kwh", 2319984, "", "BARVL5429", "", "", "235"),
    new GasTransaction("Consignment", "15", new Date(2024, 10, 16), new Date(2024, 10, 28), "ZTP Hub", "VERBIO", "Bio-LNG", "Kwh", 2319984, "", "BARVL5279", "", "", "523"),
    new GasTransaction("Sale", "16", new Date(2023, 10, 12), new Date(2023, 10, 28), "ZTP Hub", "VERBIO", "Biomethane", "Kwh", 2319984, "", "BARVL5729", "", "", "23"),
    new GasTransaction("Retrieval", "17", new Date(2023, 10, 10), new Date(2023, 10, 28), "ZTP Hub", "VERBIO", "Bio-LNG", "Kwh", 2319984, "", "VECKK963", "", "", "53"),
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
    var idx = this.mockData.findIndex(x => x.ID === data.ID)
    this.mockData[idx] = data
    return of(this.mockData[idx]).toPromise()
  }

  public DeleteData(id: string): Promise<boolean | undefined> {
    var idx = this.mockData.findIndex(x => x.ID === id)
    this.mockData.splice(idx, 1)
    return of(true).toPromise()
  }
}

