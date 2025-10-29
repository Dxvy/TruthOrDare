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
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  sunny,
  moon,
  trash,
  rocket
} from 'ionicons/icons';
import { ThemeService } from '../../services/theme';
import { PhotoDetailComponent } from '../../components/photo-detail/photo-detail.component';
import { PhotoService } from '../../services/photo';

interface Photo {
  id: string;
  image: string;
  date: Date;
  players: string[];
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
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

export class GalleryPage implements OnInit {
  photos: Photo[] = [];
  isDarkMode = true;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private themeService: ThemeService,
    private photoService: PhotoService
  ) {
    addIcons({
      arrowBack,
      sunny,
      moon,
      trash,
      rocket
    });
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.loadPhotos();
  }

  async loadPhotos() {
    // load photos from local PhotoService / Storage API
    const storedPhotos = localStorage.getItem('photos');
    if (storedPhotos) {
      this.photos = await this.photoService.getPhotos();
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;

    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  async openPhotoDetail(photo: Photo) {
    // open modal to see photo details
    const modal = await this.modalController.create({
      component: PhotoDetailComponent,
      componentProps: { photo }
    });
    console.log('Ouverture des détails de la photo:', photo);
    return await modal.present();
  }

  async deletePhoto(photoId: string, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: 'Supprimer la photo ?',
      message: 'Cette action est irréversible. Es-tu sûr ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            await this.photoService.deletePhoto(photoId);
            this.photos = await this.photoService.getPhotos();
          }
        }
      ]
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/mode']);
  }

  startNewGame() {
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }
}
