import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonInput,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  sunny,
  moon,
  mail,
  lockClosed,
  eye,
  eyeOff,
  logIn,
  logoGoogle,
  person,
  personAdd,
  arrowForward
} from 'ionicons/icons';
import { ThemeService } from '../../services/theme';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonInput,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  showRegister = false;
  showPassword = false;
  isDarkMode = true;

  // Connexion
  loginEmail = '';
  loginPassword = '';

  // Inscription
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';


  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private themeService: ThemeService,
    private authService: AuthService
  ) {
    addIcons({
      arrowBack,
      sunny,
      moon,
      mail,
      lockClosed,
      eye,
      eyeOff,
      logIn,
      logoGoogle,
      person,
      personAdd,
      arrowForward
    });
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  canLogin(): boolean {
    return this.loginEmail.trim().length > 0 &&
      this.loginPassword.length >= 6;
  }

  canRegister(): boolean {
    return this.registerName.trim().length > 0 &&
      this.registerEmail.trim().length > 0 &&
      this.registerPassword.length >= 6 &&
      this.registerPassword === this.registerPasswordConfirm;
  }

  async login() {
    if (!this.canLogin()) return;

    const loading = await this.loadingController.create({
      message: 'Connexion en cours...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.authService.login(this.loginEmail, this.loginPassword);
      await loading.dismiss();
      await this.showToast('Connexion réussie ! 🎉', 'success');
      this.router.navigate(['/home']);
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error, 'danger');
    }
  }

  async register() {
    if (!this.canRegister()) {
      if (this.registerPassword !== this.registerPasswordConfirm) {
        await this.showToast('Les mots de passe ne correspondent pas', 'danger');
      }
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Création du compte...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.authService.register(
        this.registerName,
        this.registerEmail,
        this.registerPassword
      );
      await loading.dismiss();
      await this.showToast('Compte créé avec succès ! 🎉', 'success');
      this.router.navigate(['/home']);
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error, 'danger');
    }
  }

  async loginWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Connexion avec Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.authService.loginWithGoogle();
      await loading.dismiss();
      await this.showToast('Connexion réussie ! 🎉', 'success');
      this.router.navigate(['/home']);
    } catch (error: any) {
      await loading.dismiss();
      if (error !== 'Connexion annulée') {
        await this.showToast(error, 'danger');
      }
    }
  }

  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Réinitialiser le mot de passe',
      message: 'Entre ton adresse email pour recevoir un lien de réinitialisation.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: this.loginEmail
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Envoyer',
          handler: async (data) => {
            if (data.email) {
              const loading = await this.loadingController.create({
                message: 'Envoi en cours...',
                spinner: 'crescent'
              });
              await loading.present();

              try {
                await this.authService.resetPassword(data.email);
                await loading.dismiss();
                await this.showToast('Email de réinitialisation envoyé !', 'success');
              } catch (error: any) {
                await loading.dismiss();
                await this.showToast(error, 'danger');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  continueAsGuest() {
    this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });

    await toast.present();
  }

}
