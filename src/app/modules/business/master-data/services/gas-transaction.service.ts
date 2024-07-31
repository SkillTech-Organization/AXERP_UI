import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GasTransaction, IGasTransaction } from '../models/GasTransaction';
import { HelperFunctions } from '../../../../util/HelperFunctions';
import { catchError, lastValueFrom, map } from 'rxjs';
import { PagedQueryRequest } from '../../../../util/models/PagedQueryRequest';
import { ApiResponse } from '../../../../util/models/ApiResponse';
import { ImportGasTransactionResponse } from '../models/ImportGasTransactionResponse';
import { BasePagedQueryResponse } from '../../../../util/models/BasePagedQueryResponse';
import { BaseService } from '../../../../config/base.service';
import { ToastService } from '../../../services/toast.service';
import { ProcessBlobFilesResponse } from '../models/ProcessBlobFilesResponse';

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
    const request = this.http.get<ApiResponse<BasePagedQueryResponse<IGasTransaction>>>(this.BaseUrl + 'QueryGasTransactions?' + queryParams)
      .pipe(
        catchError(this.handleError),
        map(val => {
          var res: ApiResponse<BasePagedQueryResponse<GasTransaction>> = {
            ContentTypes: val.ContentTypes,
            DeclaredType: val.DeclaredType,
            Formatters: val.Formatters,
            StatusCode: val.StatusCode,
            Value: undefined
          }

          if (val.Value) {
            const v = val.Value
            res.Value = {
              Columns: v.Columns,
              DataCount: v.DataCount,
              IsSuccess: v.IsSuccess,
              PageSize: v.PageSize,
              RequestError: v.RequestError,
              PageIndex: v.PageIndex,
              TotalCount: v.TotalCount,
              HttpStatusCode: v.HttpStatusCode,
              Data: []
            }
            if (v.Data?.length ?? 0 > 0) {
              v.Data?.forEach(element => {
                res.Value?.Data?.push(new GasTransaction(
                  element.DeliveryID,
                  element.DateLoadedEnd,
                  element.DateDelivered,
                  element.SalesContractID,
                  element.SalesStatus,
                  element.Terminal,
                  element.QtyLoaded,
                  element.StockDays,
                  element.SlotBookedByAXGTT,
                  element.ToDeliveryID,
                  element.Status,
                  element.SpecificDeliveryPoint,
                  element.DeliveryPoint,
                  element.Transporter,
                  element.DeliveryUP,
                  element.TransportCharges,
                  element.UnitSlotCharge,
                  element.ServiceCharges,
                  element.UnitStorageCharge,
                  element.StorageCharge,
                  element.OtherCharges,
                  element.Sales,
                  element.CMR,
                  element.BioMWh,
                  element.BillOfLading,
                  element.BioAddendum,
                  element.Comment,
                  element.CustomerNote,
                  element.Customer,
                  element.Reference,
                  element.Reference2,
                  element.Reference3,
                  element.TruckLoadingCompanyComment,
                  element.TruckCompany
                ))
              })
            }
          }

          return res
        })
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

  public async ProcessBlobFiles(): Promise<ApiResponse<ProcessBlobFilesResponse>> {
    const request = this.http.get<ApiResponse<ProcessBlobFilesResponse>>(this.BaseUrl + 'ProcessBlobFiles')
      .pipe(
        catchError(this.handleError)
      )

    return await lastValueFrom(request)
  }
}
