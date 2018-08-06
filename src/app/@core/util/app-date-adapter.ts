import { NativeDateAdapter } from "@angular/material";

import * as Moment from 'moment'; /*  biblioteca de formatação de data/hora */

export class AppDateAdapter extends NativeDateAdapter {
    parse(value: any): Date | null {
        //console.log("value:" + value);
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    format(date: Date, displayFormat: Object): string {
        console.log("date:" + Moment(date).format('DD-MM-YYYY'));

        return Moment(date).format('DD/MM/YYYY');
    }


    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}
