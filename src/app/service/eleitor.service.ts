import { Eleitor } from './../domain/eleitor';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class EleitorService {

    private url: string = `${environment.urlbase}/eleitores`;

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private http: Http
    ) { }


    getEleitor(idTituloEleitoral: string): Observable<Eleitor> {
        return this.http.get(`${this.url}/${idTituloEleitoral}`)
        .map(res => res.json())
        .catch((error: any) => {
            if (error.status == 400) {
              // this.alertService.showError(error.statusText);
              this.errorHandlerService.handle(error._body);
          }  return Observable.throw(error);
        } );
    }

}
