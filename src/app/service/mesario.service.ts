import { Mesario } from './../domain/mesario';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class MesarioService {

    mesario: Mesario;

    private url: string = `${environment.urlbase}/mesarios`;

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private http: Http
    ) { }


    getMesarioExistente(idTituloEleitoral: string): Observable<Mesario> {
        return this.http.get(`${this.url}/buscarMesarioExistente/${idTituloEleitoral}`)
        .map(res => res.json())
        .catch((error: any) => {
            if (error.status == 404) {
            return Observable.of(null);
          }  return Observable.throw(error);
        } );
    }


    getMesario(idTituloEleitoral: number): Observable<Mesario> {
        return this.http.get(`${this.url}/${idTituloEleitoral}`).map((res: any)  => {

            const mesarioAlterado: Mesario = res.json() as Mesario;
            this.converterStringParaDatas([mesarioAlterado]);
            return mesarioAlterado });
    }

    public salvar(mesario: Mesario): Observable<Mesario> {
        this.converterStringParaDatas([mesario]);
        return this.http.post(`${environment.urlbase}/mesarios`, mesario)
            .map(res => res.json());
    }


    private converterStringParaDatas(mesarios: Mesario[]) {
        for (const mesario of mesarios) {
            mesario.nascimento = moment(mesario.nascimento, 'YYYY-MM-DD').toDate();

            if (mesario.dataInscricao) {
                mesario.dataInscricao = moment(mesario.dataInscricao, 'YYYY-MM-DD').toDate();
            }

        }
    }

}
