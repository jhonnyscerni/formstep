import { Eleitor } from './../../../../domain/eleitor';
import { EleitorService } from './../../../../service/eleitor.service';
import { MesarioService } from './../../../../service/mesario.service';
import { Mesario } from './../../../../domain/mesario';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StepState, TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  mesario: Mesario = new Mesario();

  eleitor: Eleitor = new Eleitor();

  listGraudeInstituicao = [
    { value: 'Analfabeto', viewValue: 'Analfabeto' },
    { value: 'Fundamental Incompleto', viewValue: 'Fundamental Incompleto' },
    { value: 'Fundamental Completo', viewValue: 'Fundamental Completo' },
    { value: 'Médio Incompleto', viewValue: 'Médio Incompleto' },
    { value: 'Médio Completo', viewValue: 'Médio Completo' },
    { value: 'Superior Incompleto', viewValue: 'Superior Incompleto' },
    { value: 'Superior Completo', viewValue: 'Superior Completo' },
    { value: 'Pós-Graduado', viewValue: 'Pós-Graduado' },
  ];

  stepDadosPessoaisState: StepState = StepState.None; stepDadosPessoaisEnabled: Boolean = true; stepDadosPessoaisActive: Boolean = true;
  stepDadosResidenciaisState: StepState = StepState.None; stepDadosResidenciaisEnabled: Boolean = false; stepDadosResidenciaisActive: Boolean = false;
  stepDadosProfissionaisState: StepState = StepState.None; stepDadosProfissionaisEnabled: Boolean = false; stepDadosProfissionaisActive: Boolean = false;
  stepMode: String = 'horizontal';


  smartphoneMode: Subscription;
  tabletMode: Subscription;
  desktopMode: Subscription;


  constructor(
    private media: TdMediaService,
    public currentRoute: ActivatedRoute,
    public router: Router,
    private title: Title,
    public snackBar: MatSnackBar,
    private mesarioService: MesarioService,
    private eleitorService: EleitorService
  ) { }

  ngOnInit() {
    this.title.setTitle('Formulário de Cadastro do Mesário Voluntário');
    this.initScreenSupport();
  }

  onSubmit() {
    this.mesarioService.salvar(this.mesario).subscribe(mesario => {
      this.snackBar.open(`${mesario.nomeCompleto} salvo com sucesso!`, '', { duration: 10000 });
      this.router.navigate(['success', mesario.tituloEleitoral, 'confirmation']);
    });
  }

  vertificaTituloEleitoral(): void {
    if (this.mesario.tituloEleitoral) {
      this.mesarioService.getMesarioExistente(this.mesario.tituloEleitoral).subscribe(mesario => {
        if (mesario != null) {
          this.snackBar.open(`Mesário ja Cadastrado!`, '', { duration: 10000 });
        }
      });
    }
  }


  initScreenSupport(): void {
    this.verifySmartphoneMode(this.media.query('xs'));
    this.verifyTabletMode(this.media.query('gt-xs'));
    this.verifyDesktopMode(this.media.query('gt-sm'));
    /* EDU: configura 3 ações para eventos de mudança de tamanho de tela: desktop, tablet, smartphone */
    this.smartphoneMode = this.media.registerQuery('xs').subscribe((isSmartphone: Boolean) => this.verifySmartphoneMode(isSmartphone));
    this.tabletMode = this.media.registerQuery('gt-xs').subscribe((isTablet: Boolean) => this.verifyTabletMode(isTablet));
    this.desktopMode = this.media.registerQuery('gt-sm').subscribe((isDesktop: Boolean) => this.verifyDesktopMode(isDesktop));
  }


  showDadosResidenciaisStep(): void {

    if (this.mesario.tituloEleitoral) {
      this.mesarioService.getMesarioExistente(this.mesario.tituloEleitoral).subscribe(mesario => {

        if (mesario != null) {
          this.snackBar.open(`Mesário ja Cadastrado!`, '', { duration: 10000 });
        } else {

          this.eleitorService.getEleitor(this.mesario.tituloEleitoral).subscribe(eleitor => {

            if (eleitor != null) {
              this.mesario.zonaEleitoral = eleitor.numZona;
              this.mesario.secaoEleitoral = eleitor.numSecao;
              this.mesario.numlocalVotacao = eleitor.numLocalVocacao;
              this.mesario.localVotacao = eleitor.localVotacao;
              this.stepDadosPessoaisState = StepState.Complete;
              this.stepDadosPessoaisEnabled = false;
              this.stepDadosResidenciaisEnabled = true;
              this.stepDadosResidenciaisActive = true;
            }

          });
        }
      });
    }

  }

  showDadosProfissionaisStep(): void {
    this.stepDadosResidenciaisState = StepState.Complete;
    this.stepDadosResidenciaisEnabled = false;
    this.stepDadosProfissionaisEnabled = true;
    this.stepDadosProfissionaisActive = true;
  }

  verifyDesktopMode(isDesktop: Boolean): void {
    if (isDesktop) {
      this.stepMode = 'horizontal';
    }
  }

  verifySmartphoneMode(isSmartphone: Boolean): void {
    if (isSmartphone) {
      this.stepMode = 'vertical';
    }
  }

  verifyTabletMode(isTablet: Boolean): void {
    if (isTablet && !this.media.query('gt-sm')) {
      this.stepMode = 'horizontal';
    }
  }

  toUpperNomeCompleto(val: string) {
    this.mesario.nomeCompleto = val.toUpperCase();
  }

  toUpperNomeMae(val: string) {
    this.mesario.nomeMae = val.toUpperCase();
  }

  toUpperMunicipio(val: string) {
    this.mesario.municipio = val.toUpperCase();
  }

  toUpperBairro(val: string) {
    this.mesario.bairro = val.toUpperCase();
  }

  toUpperEndereco(val: string) {
    this.mesario.endereco = val.toUpperCase();
  }

  toUpperComplemento(val: string) {
    this.mesario.complementoEndereco = val.toUpperCase();
  }

  toUpperReferencia(val: string) {
    this.mesario.informacoesReferenciaEndereco = val.toUpperCase();
  }

  toUpperLocalTrabalho(val: string) {
    this.mesario.localTrabalho = val.toUpperCase();
  }

  toUpperEnderecoTrabalho(val: string) {
    this.mesario.enderecoTrabalho = val.toUpperCase();
  }


  onBlurMethod() {
    this.mesario.zonaEleitoral = "";
    this.mesario.secaoEleitoral = "";
    this.mesario.numlocalVotacao = "";
    this.mesario.localVotacao = "";

    this.eleitorService.getEleitor(this.mesario.tituloEleitoral).subscribe(eleitor => {

      if (eleitor != null) {
        this.mesario.zonaEleitoral = eleitor.numZona;
        this.mesario.secaoEleitoral = eleitor.numSecao;
        this.mesario.numlocalVotacao = eleitor.numLocalVocacao;
        this.mesario.localVotacao = eleitor.localVotacao;
      }

    });

  }

}
