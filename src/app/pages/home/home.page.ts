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
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sunny,
  moon,
  personCircle,
  addCircle,
  trash,
  rocket,
  arrowForward,
  people,
  male,
  female
} from 'ionicons/icons';
import { ThemeService } from '../../services/theme';
import index from "eslint-plugin-jsdoc";

interface Player {
  pseudo: string;
  gender: 'homme' | 'femme';
  score: number;
  avatar : string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
export class HomePage implements OnInit {

  newPlayer : Player = {
    pseudo: '',
    gender: 'homme',
    score: 0,
    avatar : '🧑'
  };

  players: Player[] = [];

  avatars: string[] = [
    '🧑', '👦', '👧', '🧔', '👨',
    '👩', '🧒', '👴', '👵', '🧑‍🦰',
    '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲', '🧑‍🦳',
    '👨‍🦳', '👩‍🦳', '🤵', '👰', '🥷'
  ];

  isDarkMode = true;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
    addIcons({
      sunny,
      moon,
      personCircle,
      addCircle,
      trash,
      rocket,
      arrowForward,
      people,
      male,
      female
    });
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.loadPlayers();
  }

  async loadPlayers() {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
      this.players = JSON.parse(storedPlayers);
    }
    console.log(this.players);
    console.log(this.newPlayer);
    console.log(this.avatars);
  }

  selectGender(gender: 'homme' | 'femme') {
    this.newPlayer.gender = gender;
  }

  selectAvatar(avatar: string) {
    this.newPlayer.avatar = avatar;
  }

  canAddPlayer(): boolean {
    return this.newPlayer.pseudo.trim().length > 0;
  }

  addPlayer() {
    if (this.canAddPlayer()) {
      this.players.push({ ...this.newPlayer });
      localStorage.setItem('players', JSON.stringify(this.players));
      this.newPlayer = {
        pseudo: '',
        gender: 'homme',
        score: 0,
        avatar: '🧑'
      };
    }
  }

  removePlayer(player: number) {
    this.players = this.players.filter((_, i) => i !== player);
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  startGame() {
    if (this.players.length >= 2) {
      // save players to local storage
      localStorage.setItem('players', JSON.stringify(this.players));
      this.router.navigate(['/mode']);
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
