import { MesarioService } from './../../../../service/mesario.service';
import { Mesario } from './../../../../domain/mesario';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as Moment from 'moment'; /*  biblioteca de formatação de data/hora */

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  idTituloEleitoral: number;

  mesario: Mesario = new Mesario();

  constructor(
    private mesarioService: MesarioService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Cadastro Efetuado com Sucesso');
    this.idTituloEleitoral = this.route.snapshot.params['idTituloEleitoral'];
    this.getMesario();
  }

  private getMesario() {
    this.mesarioService.getMesario(this.idTituloEleitoral).subscribe(mesario => {
      this.mesarioService.mesario = mesario;
      this.mesario = this.mesarioService.mesario;
    });
  }

  public dateLayout(dt: any): String {
    return Moment(dt).format('DD-MM-YYYY');
}

}
