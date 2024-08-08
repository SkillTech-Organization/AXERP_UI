import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, lastValueFrom } from "rxjs";
import { environment } from "../../../../../environments/environment.development";
import { BaseService } from "../../../../config/base.service";
import { HelperFunctions } from "../../../../util/HelperFunctions";
import { ApiResponse } from "../../../../util/models/ApiResponse";
import { BasePagedQueryResponse } from "../../../../util/models/BasePagedQueryResponse";
import { PagedQueryRequest } from "../../../../util/models/PagedQueryRequest";
import { ToastService } from "../../../services/toast.service";
import { IAppInsightsEntry, AppInsightsEntry } from "../models/AppInsightsEntry";



@Injectable({
  providedIn: 'root'
})
export class AppInsightsService extends BaseService {
  private readonly BaseUrl = environment.apiUrl + 'api/';

  constructor(
    private http: HttpClient,
    snackService: ToastService
  ) {
    super(snackService)
  }

  public async QueryAppInsights(params?: PagedQueryRequest): Promise<ApiResponse<BasePagedQueryResponse<IAppInsightsEntry>>> {
    const queryParams = HelperFunctions.ParseObjectAsQueryString(params);
    const request = this.http.get<ApiResponse<BasePagedQueryResponse<IAppInsightsEntry>>>(this.BaseUrl + 'QueryAppInsights?' + queryParams)
      .pipe(
        catchError(this.handleError),
        map(val => {
          var res: ApiResponse<BasePagedQueryResponse<AppInsightsEntry>> = {
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
                res.Value?.Data?.push(new AppInsightsEntry(
                  element.RowNum,
                  element.Message,
                  element.TimeStamp
                ))
              })
            }
          }

          return res
        })
      )

    return await lastValueFrom(request)
  }
}
