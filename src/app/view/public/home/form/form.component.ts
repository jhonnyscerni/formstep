import { Eleitor } from './../../../../domain/eleitor';
import { EleitorService } from './../../../../service/eleitor.service';
import { MesarioService } from './../../../../service/mesario.service';
import { Mesario } from './../../../../domain/mesario';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { StepState, TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { FormControl, NgModel, NgForm } from '../../../../../../node_modules/@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  mesario: Mesario = new Mesario();

  eleitor: Eleitor = new Eleitor();

  @ViewChild('vform')
  public form: NgForm;

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

  stepDadosPessoaisState: StepState = StepState.None;
  stepDadosPessoaisEnabled: Boolean = true;
  stepDadosPessoaisActive: Boolean = true;
  stepDadosResidenciaisState: StepState = StepState.None;
  stepDadosResidenciaisEnabled: Boolean = false;
  stepDadosResidenciaisActive: Boolean = false;
  stepDadosProfissionaisState: StepState = StepState.None;
  stepDadosProfissionaisEnabled: Boolean = false;
  stepDadosProfissionaisActive: Boolean = false;
  stepMode: String = 'horizontal';


  smartphoneMode: Subscription;
  tabletMode: Subscription;
  desktopMode: Subscription;

  digitoVerificador: String = '';

  constructor(
    private media: TdMediaService,
    public currentRoute: ActivatedRoute,
    public router: Router,
    private title: Title,
    public snackBar: MatSnackBar,
    private mesarioService: MesarioService,
    private eleitorService: EleitorService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.title.setTitle('Mesário Voluntário');
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

          this.dialog.open(ConfirmaExclusao, { width: '500px' });

        } else {

          this.eleitorService.getEleitor(this.mesario.tituloEleitoral).subscribe(eleitor => {

            if (eleitor != null) {
              this.mesario.zonaEleitoral = eleitor.numZona;
              this.mesario.secaoEleitoral = eleitor.numSecao;
              this.mesario.numlocalVotacao = eleitor.numLocalVocacao;
              this.mesario.localVotacao = eleitor.localVotacao;
              this.mesario.emailZe = eleitor.emailZona;
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

  pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}
  onBlurMethodTitulo() {
    if (this.mesario.tituloEleitoral == null) {
      this.digitoVerificador = '';
      return;
    }
    if (this.mesario.tituloEleitoral.trim() === '') {
      this.digitoVerificador = '';
      return;
    }

    /* EDU: completa o título com zeros a esquerda para completar 12 digitos */
    this.mesario.tituloEleitoral = this.pad_with_zeroes(this.mesario.tituloEleitoral, 12);

    if (this.validarTitulo(this.mesario.tituloEleitoral)) {
      /*
      if (this.mesario.tituloEleitoral.substr(8, 2) !== '13') {
        this.digitoVerificador = 'not-parah';
        this.form.controls['tituloEleitoral'].setErrors({ invalid: true });
        return;
      } else {
        this.digitoVerificador = 'ok';
      }
      */
      this.digitoVerificador = 'ok';
    } else {
      this.digitoVerificador = 'erro';
      this.form.controls['tituloEleitoral'].setErrors({ invalid: true });
      return;
    }

    this.mesario.zonaEleitoral = "";
    this.mesario.secaoEleitoral = "";
    this.mesario.numlocalVotacao = "";
    this.mesario.localVotacao = "";
    this.mesario.emailZe = "";

    this.eleitorService.getEleitor(this.mesario.tituloEleitoral).subscribe(eleitor => {

      if (eleitor != null) {
        this.mesario.zonaEleitoral = eleitor.numZona;
        this.mesario.secaoEleitoral = eleitor.numSecao;
        this.mesario.numlocalVotacao = eleitor.numLocalVocacao;
        this.mesario.localVotacao = eleitor.localVotacao;
        this.mesario.emailZe = eleitor.emailZona;
      }
    },
      error => {
        this.form.controls['tituloEleitoral'].setErrors({ invalid: true });
      });
  }

  checkValidDate(pDate: any) {
    const aDate: any = moment(pDate, 'DD/MM/YYYY', true);
    if (aDate._isValid === false) {
      this.form.controls['dataNascimento'].setErrors({ invalid: true });
    }
  }

  getTituloErrorMsg() {
    if (this.mesario.tituloEleitoral == null) {
      return 'O Titulo Eleitoral é um campo obrigatório!';
    }
    if (this.mesario.tituloEleitoral === '') {
      return 'O Titulo Eleitoral é um campo obrigatório!';
    }
    if (this.mesario.tituloEleitoral !== '') {
      if (this.digitoVerificador === 'erro') {
        return 'O Título Eleitoral informado é inválido!';
      } else {
        if (this.digitoVerificador === 'not-parah') {
          return 'O Título Eleitoral informado não pertence ao Estado do Pará!';
        } else {
          return 'O Título Eleitoral informado encontra-se em situação irregular!';
        }
      }
    }
  }

  validarTitulo(inscricao) {
  const paddedInsc = inscricao;
  let dig1 = 0;
  let dig2 = 0;

  const tam = paddedInsc.length;
  const digitos = paddedInsc.substr(tam - 2, 2);
  const estado = paddedInsc.substr(tam - 4, 2);
  const titulo = paddedInsc.substr(0, tam - 2);
  const exce = (estado === '01') || (estado === '02');
  dig1 = (titulo.charCodeAt(0) - 48) * 9 + (titulo.charCodeAt(1) - 48) * 8 +
    (titulo.charCodeAt(2) - 48) * 7 + (titulo.charCodeAt(3) - 48) * 6 +
    (titulo.charCodeAt(4) - 48) * 5 + (titulo.charCodeAt(5) - 48) * 4 +
    (titulo.charCodeAt(6) - 48) * 3 + (titulo.charCodeAt(7) - 48) * 2;
    let resto = (dig1 % 11);
  if (resto === 0) {
    if (exce) {
      dig1 = 1;
    } else {
      dig1 = 0;
    }
  } else {
    if (resto === 1) {
      dig1 = 0;
    } else {
      dig1 = 11 - resto;
    }
  }

  dig2 = (titulo.charCodeAt(8) - 48) * 4 + (titulo.charCodeAt(9) - 48) * 3 + dig1 * 2;
  resto = (dig2 % 11);
  if (resto === 0) {
    if (exce) {
      dig2 = 1;
    } else {
      dig2 = 0;
    }
  } else {
    if (resto === 1) {
      dig2 = 0;
    } else {
      dig2 = 11 - resto;
    }
  }

  if ((digitos.charCodeAt(0) - 48 === dig1) && (digitos.charCodeAt(1) - 48 === dig2)) {
    return true; // Titulo Válido
    // erro = '<font color=green>Título ok</font>';
  } else {
    return false; // Titulo Inválido
    // erro = '<font color=red>Título inválido</font>';
  }
 }

}

@Component({
  selector: 'dialog-confirm',
  templateUrl: 'dialog-confirm.html',
})
export class ConfirmaExclusao {

  constructor(
    public dialogRef: MatDialogRef<ConfirmaExclusao>,
    @Inject(MAT_DIALOG_DATA) public categoria: any) { }

  /* caso o usuário clique em Cancelar */
  clickCancelar(): void {
    this.dialogRef.close();
  }

  /* verifica se o usuário tem permissão para excluir categorias cheias */
  isPermitted(): boolean {
    return (!this.categoria);
  }

}