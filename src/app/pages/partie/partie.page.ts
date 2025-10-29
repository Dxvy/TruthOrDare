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
  IonProgressBar,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  close,
  sunny,
  moon,
  alertCircle,
  flash,
  chatbubbleEllipses,
  camera,
  checkmarkCircle,
  arrowForwardCircle,
  images
} from 'ionicons/icons';
import { ThemeService } from '../../services/theme';
import { PhotoService } from '../../services/photo';
import { CardsService, Cards } from '../../services/cards.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface Player {
  pseudo: string;
  gender: 'homme' | 'femme';
  score: number;
  avatar: string;
  playedCards?: string[];
}

interface Card {
  mode: string;
  type: 'action' | 'verite';
  description: string;
  genreJoueur1: string;
  genreJoueur2?: string;
  timer?: number;
  repeatable: boolean;
  photoObligatoire?: boolean;
}

@Component({
  selector: 'app-partie',
  templateUrl: './partie.page.html',
  styleUrls: ['./partie.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonProgressBar
  ]
})

export class PartiePage implements OnInit, OnDestroy {
  selectedMode: string = 'Soft';
  players: Player[] = [];
  currentPlayerIndex: number = 0;
  currentPlayer: Player | null = null;
  consecutiveTruths: number = 0;

  cardDrawn: boolean = false;
  currentCard: Card | null = null;

  timerActive: boolean = false;
  timeRemaining: number = 0;
  timerProgress: number = 1;
  timerInterval: any;

  photoTaken: boolean = false;
  isDarkMode = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private themeService: ThemeService,
    private photoService: PhotoService,
    private cardsService: CardsService
  ) {
    addIcons({
      close,
      sunny,
      moon,
      alertCircle,
      flash,
      chatbubbleEllipses,
      camera,
      checkmarkCircle,
      arrowForwardCircle,
      images
    });
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.loadGameData();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadGameData() {
    this.route.queryParams.subscribe(params => {
      if (params['mode']) {
        this.selectedMode = params['mode'].charAt(0).toUpperCase() + params['mode'].slice(1);
      }
    });

    // from service or local storage charge players
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers);
      this.players = this.players.map(player => ({
        ...player,
        playedCards: player.playedCards || []
      }));
    }

    this.currentPlayer = this.players[this.currentPlayerIndex];
  }

  drawCard(type: 'action' | 'verite') {
    if (type === 'verite' && this.consecutiveTruths >= 3) {
      this.showAlert('Règle des 3 vérités', 'Tu as fait 3 vérités d\'affilée ! Tu dois maintenant faire une action.');
      return;
    }

    // Récupérer les cartes déjà jouées par le joueur actuel
    const playedCards = this.currentPlayer?.playedCards || [];

    // Récupérer une carte aléatoire
    const card = this.cardsService.getRandomCard(this.selectedMode.toLowerCase(), type, playedCards);

    if (!card) {
      this.showAlert('Plus de cartes', 'Tu as joué toutes les cartes disponibles pour ce mode !');
      return;
    }

    this.currentCard = card;
    this.cardDrawn = true;
    this.photoTaken = false;

    // Simulate a delay to simulate a real card draw
    if (type === 'verite') {
      this.consecutiveTruths++;
    } else {
      this.consecutiveTruths = 0;
    }

    // Ajouter la carte aux cartes jouées si elle n'est pas répétable
    if (!card.repeatable && this.currentPlayer) {
      const cardId = `${card.mode}-${card.type}-${card.description.substring(0, 20)}`;
      this.currentPlayer.playedCards?.push(cardId);
    }

    // Start timer if necessary
    if (this.currentCard.timer) {
      this.startTimer(this.currentCard.timer);
    }

    // Vibration effect
    Haptics.impact({ style: ImpactStyle.Light });
  }

  startTimer(seconds: number) {
    this.timeRemaining = seconds;
    this.timerActive = true;
    this.timerProgress = 1;

    const totalTime = seconds;

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.timerProgress = this.timeRemaining / totalTime;

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        // Vibration forte à la fin du timer
        Haptics.impact({ style: ImpactStyle.Heavy });
        this.showAlert('Temps écoulé !', 'Le défi est terminé 🎉');
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerActive = false;
  }

  async takePhoto() {
    try {
      const playerNames = this.players.map(p => p.pseudo);
      const photo = await this.photoService.takePhoto(playerNames);

      if (photo) {
        this.photoTaken = true;
        await Haptics.impact({ style: ImpactStyle.Medium });

        const toast = await this.toastController.create({
          message: '📸 Photo enregistrée dans la galerie !',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      const toast = await this.toastController.create({
        message: '❌ Erreur lors de la prise de photo',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  nextTurn() {
    // Vérifier si photo obligatoire a été prise
    if (this.currentCard?.photoObligatoire && !this.photoTaken) {
      this.showAlert('Photo requise', 'Tu dois prendre une photo avant de continuer !');
      return;
    }

    // Arrêter le timer s'il est actif
    this.stopTimer();

    // Passer au joueur suivant
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.currentPlayer = this.players[this.currentPlayerIndex];

    // Sauvegarder les joueurs avec leurs cartes jouées
    localStorage.setItem('players', JSON.stringify(this.players));

    // Réinitialiser l'état
    this.cardDrawn = false;
    this.currentCard = null;
    this.photoTaken = false;

    // Vibration légère pour le changement de tour
    Haptics.impact({ style: ImpactStyle.Light });
  }

  skipChallenge() {
    // Réinitialiser le compteur de vérités si c'était une action
    if (this.currentCard?.type === 'action' && this.consecutiveTruths > 0) {
      this.consecutiveTruths--;
    }

    this.nextTurn();
  }

  async quitGame() {
    const alert = await this.alertController.create({
      header: 'Quitter la partie ?',
      message: 'Es-tu sûr de vouloir quitter la partie en cours ?',
      buttons: [
        {
          text: 'Continuer',
          role: 'cancel'
        },
        {
          text: 'Quitter',
          role: 'destructive',
          handler: () => {
            this.stopTimer();
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  goToGallery() {
    this.router.navigate(['/gallery']);
  }
}
