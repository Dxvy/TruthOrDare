import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {
  arrowBack,
  sunny,
  moon,
  leaf,
  flame,
  skull,
  lockClosed,
  star,
  informationCircle,
  images
} from 'ionicons/icons';
import {ThemeService} from '../../services/theme';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.page.html',
  styleUrls: ['./mode.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})

export class ModePage implements OnInit {
  isPremiumUnlocked = false;
  isDarkMode = true;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private themeService: ThemeService
  ) {
    addIcons({
      arrowBack,
      sunny,
      moon,
      leaf,
      flame,
      skull,
      lockClosed,
      star,
      informationCircle,
      images
    });
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.checkPremiumStatus();
  }

  async checkPremiumStatus() {
    // Simulate an async check for premium status
    this.isPremiumUnlocked = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), 500); // Change to true to simulate premium unlocked
    });
  }

  async selectMode(mode: string) {
    if (mode === 'hardcore' && !this.isPremiumUnlocked) {
      await this.showPremiumAlert();
      return;
    }
    // Save the selected mode to local storage or session storage
    localStorage.setItem('selectedMode', mode);

    // Navigate to the game page with the selected mode as a query parameter
    this.router.navigate(['/partie'], {
      queryParams: {mode}
    });
  }

  async showPremiumAlert() {
    const alert = await this.alertController.create({
      header: 'Mode Hardcore 💀',
      message: 'Ce mode est réservé aux membres premium. Débloque-le pour seulement 0,50€ !',
      buttons: [
        {
          text: 'Plus tard',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Débloquer',
          handler: () => {
            this.proceedToPayment();
          }
        }
      ]
    });

    await alert.present();
  }

  proceedToPayment() {
    // TODO: Implémenter le paiement Stripe
    console.log('Redirection vers le paiement Stripe...');
    this.router.navigate(['/payment'], { queryParams: { mode: 'hardcore' } });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  goToGallery() {
    this.router.navigate(['/gallery']);
  }
}
