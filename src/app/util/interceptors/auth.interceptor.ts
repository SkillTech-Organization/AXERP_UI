import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenStorageService } from "../../modules/services/token-storage.service";

const USER_NAME_HEADER_KEY = "x-user-name";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const userName = this.tokenService.user?.name;
        if (userName != null) {
            authReq = req.clone({
                headers: req.headers.set(USER_NAME_HEADER_KEY, userName)
            });
        }
        return next.handle(authReq);
    }
}

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];