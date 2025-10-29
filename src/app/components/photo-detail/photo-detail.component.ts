import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, share, download } from 'ionicons/icons';

interface Photo {
  id: string;
  image: string;
  date: Date;
  players: string[];
}

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon
  ]
})
export class PhotoDetailComponent {
  @Input() photo!: Photo;

  constructor(private modalController: ModalController) {
    addIcons({ close, share, download });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  sharePhoto() {
    // TODO: Implémenter le partage via Capacitor Share API
    console.log('Partage de la photo:', this.photo);
  }

  downloadPhoto() {
    // TODO: Implémenter le téléchargement via Capacitor Filesystem
    console.log('Téléchargement de la photo:', this.photo);
  }
}
