import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface Photo {
  id: string;
  image: string;
  date: Date;
  players: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly PHOTOS_KEY = 'photos';

  constructor() {}

  async takePhoto(players: string[]): Promise<Photo | null> {
    try {
      // Prendre la photo
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
        allowEditing: false,
        saveToGallery: true
      });

      if (!capturedPhoto.dataUrl) {
        throw new Error('Aucune photo capturée');
      }

      // Créer l'objet Photo
      const photo: Photo = {
        id: Date.now().toString(),
        image: capturedPhoto.dataUrl,
        date: new Date(),
        players: players
      };

      // Sauvegarder dans le localStorage
      await this.savePhoto(photo);

      return photo;
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      return null;
    }
  }

  async savePhoto(photo: Photo): Promise<void> {
    const photos = await this.getPhotos();
    photos.unshift(photo); // Ajouter au début
    localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(photos));
  }

  async getPhotos(): Promise<Photo[]> {
    const photosJson = localStorage.getItem(this.PHOTOS_KEY);
    if (!photosJson) {
      return [];
    }
    return JSON.parse(photosJson);
  }

  async deletePhoto(photoId: string): Promise<void> {
    const photos = await this.getPhotos();
    const filteredPhotos = photos.filter(p => p.id !== photoId);
    localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(filteredPhotos));
  }
}
