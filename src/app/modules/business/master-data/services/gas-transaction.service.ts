import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GasTransaction } from '../models/GasTransaction';
import { HelperFunctions } from '../../../../util/HelperFunctions';
import { catchError, lastValueFrom } from 'rxjs';
import { PagedQueryRequest } from '../../../../util/models/PagedQueryRequest';
import { ApiResponse } from '../../../../util/models/ApiResponse';
import { ImportGasTransactionResponse } from '../models/ImportGasTransactionResponse';
import { BasePagedQueryResponse } from '../../../../util/models/BasePagedQueryResponse';
import { BaseService } from '../../../../config/base.service';
import { ToastService } from '../../../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class GasTransactionService extends BaseService {
  private readonly BaseUrl = environment.apiUrl + 'api/';

  constructor(
    private http: HttpClient,
    snackService: ToastService
  ) {
    super(snackService)
  }

  public async QueryGasTransactions(params?: PagedQueryRequest): Promise<ApiResponse<BasePagedQueryResponse<GasTransaction>>> {
    const queryParams = HelperFunctions.ParseObjectAsQueryString(params);
    const request = this.http.get<ApiResponse<BasePagedQueryResponse<GasTransaction>>>(this.BaseUrl + 'QueryGasTransactions?' + queryParams)
      .pipe(
        catchError(this.handleError)
      )

    return await lastValueFrom(request)
  }

  public async ImportGasTransactions(): Promise<ApiResponse<ImportGasTransactionResponse>> {
    const request = this.http.post<ApiResponse<ImportGasTransactionResponse>>(this.BaseUrl + 'ImportGasTransactions', null)
      .pipe(
        catchError(this.handleError)
      )

    return await lastValueFrom(request)
  }

  public async CountGasTransactions(): Promise<number> {
    const request = this.http.get<number>(this.BaseUrl + 'CountGasTransactions')
      .pipe(
        catchError(this.handleError)
      )

    return await lastValueFrom(request)
  }
}
