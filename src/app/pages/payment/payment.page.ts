import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  IonSpinner,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  sunny,
  moon,
  star,
  checkmarkCircle,
  mail,
  lockClosed,
  rocket,
  shieldCheckmark
} from 'ionicons/icons';
import { ThemeService } from '../../services/theme';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
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
    IonSpinner,
    CommonModule,
    FormsModule
  ]
})
export class PaymentPage implements OnInit, OnDestroy {
  isDarkMode = true;
  email = '';
  processing = false;
  paymentSuccess = false;
  cardError = '';
  mode = '';

  // Mode démo : si true, simule le paiement sans appeler Stripe
  private readonly DEMO_MODE = false;

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  // Récupération de la clé publique depuis l'environnement
  private readonly stripePublicKey = environment.stripe.publicKey;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private themeService: ThemeService
  ) {
    addIcons({
      arrowBack,
      sunny,
      moon,
      star,
      checkmarkCircle,
      mail,
      lockClosed,
      rocket,
      shieldCheckmark
    });
  }

  async ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();

    // Récupérer le mode depuis les query params
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'hardcore';
    });

    // Initialiser Stripe
    await this.initializeStripe();
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  async initializeStripe() {
    try {
      // Load Stripe
      this.stripe = await loadStripe(this.stripePublicKey);

      if (!this.stripe) {
        throw new Error('Stripe n\'a pas pu être chargé');
      }

      // Create Stripe elements
      this.elements = this.stripe.elements();

      // Personalised style
      const style = {
        base: {
          fontSize: '16px',
          color: this.isDarkMode ? '#ffffff' : '#000000',
          '::placeholder': {
            color: this.isDarkMode ? '#aab7c4' : '#999999',
          },
        },
        invalid: {
          color: '#ef4444',
        },
      };

      // Create card element
      this.cardElement = this.elements.create('card', { style });

      // Attendre que le DOM soit prêt
      setTimeout(() => {
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer && this.cardElement) {
          this.cardElement.mount('#card-element');

          // Écouter les changements
          this.cardElement.on('change', (event) => {
            this.cardError = event.error ? event.error.message : '';
          });
        }
      }, 100);

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error);
      await this.showToast('Erreur lors du chargement du système de paiement', 'danger');
    }
  }

  async processPayment() {
    if (!this.email) {
      await this.showToast('Veuillez entrer votre email', 'warning');
      return;
    }

    this.processing = true;

    try {
      if (this.DEMO_MODE) {
        // MODE DÉMO : Simulation du paiement
        await this.processDemoPayment();
      } else {
        // MODE PRODUCTION : Vrai paiement Stripe
        await this.processRealPayment();
      }
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      await this.showToast(error.message || 'Erreur lors du paiement', 'danger');
    } finally {
      this.processing = false;
    }
  }

  /**
   * MODE DÉMO : Simule un paiement sans appeler Stripe
   */
  async processDemoPayment() {
    // Vérifier que la carte est remplie (visuellement)
    if (!this.stripe || !this.cardElement) {
      await this.showToast('Veuillez remplir les informations de carte', 'warning');
      return;
    }

    // Créer un Payment Method pour valider la carte (sans paiement réel)
    const { error: cardError, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        email: this.email,
      },
    });

    if (cardError) {
      throw new Error(cardError.message);
    }

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Vérifier le numéro de carte pour simuler succès/échec
    // Carte de test Stripe : 4242 4242 4242 4242 = succès
    // Carte de test Stripe : 4000 0000 0000 0002 = échec
    console.log('Payment Method créé (mode démo):', paymentMethod?.id);

    // En mode démo, on considère toujours que ça réussit
    await this.handlePaymentSuccess();
  }

  /**
   * MODE PRODUCTION : Vrai paiement avec votre backend
   */
  async processRealPayment() {
    if (!this.stripe || !this.cardElement) {
      await this.showToast('Veuillez remplir tous les champs', 'warning');
      return;
    }

    // 1. Créer le Payment Intent côté serveur
    const paymentIntent = await this.createPaymentIntent();

    // 2. Confirmer le paiement avec Stripe
    const { error, paymentIntent: confirmedPayment } = await this.stripe.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            email: this.email,
          },
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (confirmedPayment?.status === 'succeeded') {
      // Paiement réussi !
      await this.handlePaymentSuccess();
    }
  }

  /**
   * Appelle du backend pour créer un Payment Intent
   */
  async createPaymentIntent(): Promise<{ clientSecret: string }> {
    // Change according to your backend API
    const API_URL = 'http://localhost:3000/create-payment-intent';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50, // 0.50€ = 50 centimes
        currency: 'eur',
        email: this.email,
        mode: this.mode
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du paiement');
    }

    return await response.json();
  }

  async handlePaymentSuccess() {
    // Sauvegarder le statut premium localement
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('premiumMode', this.mode);
    localStorage.setItem('premiumDate', new Date().toISOString());

    this.paymentSuccess = true;

    await this.showToast('Paiement réussi ! Le mode est débloqué 🎉', 'success');
  }

  async continueToGame() {
    this.router.navigate(['/partie'], {
      queryParams: { mode: this.mode }
    });
  }

  async openTerms() {
    const alert = await this.alertController.create({
      header: 'Conditions d\'utilisation',
      message: 'Les conditions d\'utilisation seront affichées ici.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async openPrivacy() {
    const alert = await this.alertController.create({
      header: 'Politique de confidentialité',
      message: 'La politique de confidentialité sera affichée ici.',
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/mode']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
