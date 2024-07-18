import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GasTransaction } from '../models/GasTransaction';
import { BasePagedQueryResponse } from '../../../../util/models/BasePagedQueryResponse';
import { HelperFunctions } from '../../../../util/HelperFunctions';
import { lastValueFrom } from 'rxjs';
import { PagedQueryRequest } from '../../../../util/models/PagedQueryRequest';
import { ApiResponse } from '../../../../util/models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class GasTransactionService {
  private readonly BaseUrl = environment.apiUrl + 'api/';

  constructor(private readonly http: HttpClient) { }

  public async QueryGasTransactions(params?: PagedQueryRequest): Promise<ApiResponse<GasTransaction>> {
    const queryParams = HelperFunctions.ParseObjectAsQueryString(params);
    const request = this.http.get<ApiResponse<GasTransaction>>(this.BaseUrl + 'QueryGasTransactions?' + queryParams)

    return await lastValueFrom(request)
  }

  public async CountGasTransactions(): Promise<number> {
    const request = this.http.get<number>(this.BaseUrl + 'CountGasTransactions')

    return await lastValueFrom(request)
  }
}
