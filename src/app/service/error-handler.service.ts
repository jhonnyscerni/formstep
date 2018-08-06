import { Injectable, ErrorHandler } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorHandlerService {

    constructor(   
        public snackBar: MatSnackBar
    ) { }

    handle(errorResponse: any) {
        let msg: string;

        if(typeof errorResponse === 'string') {
            msg = errorResponse;
        } else {
            msg = 'Erro ao processar serviço remoto. Tente novamente.';
            console.log('Ocorreu um erro', errorResponse);
        }

        this.snackBar.open(msg, '', { duration: 10000 });
    }

}
