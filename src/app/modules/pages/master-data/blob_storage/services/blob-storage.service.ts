import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, lastValueFrom, Observable } from "rxjs";
import { environment } from "../../../../../../environments/environment.development";
import { BaseService } from "../../../../../config/base.service";
import { HelperFunctions } from "../../../../../util/HelperFunctions";
import { ApiResponse } from "../../../../../util/models/ApiResponse";
import { BasePagedQueryResponse } from "../../../../../util/models/BasePagedQueryResponse";
import { BaseResponse } from "../../../../../util/models/BaseResponse";
import { PagedQueryRequest } from "../../../../../util/models/PagedQueryRequest";
import { ToastService } from "../../../../services/toast.service";
import { BlobFile } from "../models/BlobFile";
import { DeleteBlobFilesRequest } from "../models/DeleteBlobFilesRequest";
import { UploadBlobFileRequest } from "../models/UploadBlobFileRequest";


@Injectable({
  providedIn: 'root'
})
export class BlobStorageService extends BaseService {
  private readonly BaseUrl = environment.apiUrl + 'api/';

  constructor(
    private http: HttpClient,
    snackService: ToastService
  ) {
    super(snackService)
  }

  public async QueryBlobFiles(params?: PagedQueryRequest): Promise<ApiResponse<BasePagedQueryResponse<BlobFile>>> {
    const queryParams = HelperFunctions.ParseObjectAsQueryString(params);
    const request = this.http.get<ApiResponse<BasePagedQueryResponse<BlobFile>>>(this.BaseUrl + 'ListBlobFiles?' + queryParams)
      .pipe(
        catchError(this.handleError),
        map(val => {
          var res: ApiResponse<BasePagedQueryResponse<BlobFile>> = {
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
                res.Value?.Data?.push(new BlobFile(
                  element.FileName,
                  element.Folder,
                ))
              })
            }
          }

          return res
        })
      )

    return await lastValueFrom(request)
  }

  public async DeleteBlobFiles(req: DeleteBlobFilesRequest): Promise<ApiResponse<BaseResponse>> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'charset': 'utf8',
        'accept': 'application/json'
      }),
      body: JSON.stringify(req)
    }

    const request = this.http.delete<ApiResponse<BaseResponse>>(this.BaseUrl + 'DeleteBlobFiles', options)
      .pipe(
        catchError(this.handleError)
      )

    return await lastValueFrom(request)
  }

  public UploadBlobFile(req: UploadBlobFileRequest): Observable<HttpEvent<any>> {
    var formData: FormData = new FormData()

    formData.append("file", req.Data.Content)
    if (req.Data.Folder) {
      formData.append("path", `${req.Data.Folder}/${req.Data.FileName}`)
    } else {
      formData.append("path", `${req.Data.FileName}`)
    }

    const request = new HttpRequest('POST', this.BaseUrl + 'UploadBlobFile', formData, {
      reportProgress: true,
      responseType: 'json'
     })

    return this.http.post(this.BaseUrl + 'UploadBlobFile', formData, { reportProgress: true, observe: 'events' })
  }
}
