import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { language, checkmark } from 'ionicons/icons';
import { LanguageService, Language } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonPopover,
    IonList,
    IonItem,
    IonLabel,
    TranslateModule
  ]
})
export class LanguageSelectorComponent {
  isOpen = false;

  constructor(public languageService: LanguageService) {
    addIcons({ language, checkmark });
  }

  selectLanguage(lang: Language) {
    this.languageService.setLanguage(lang.code);
    this.isOpen = false;
  }

  togglePopover() {
    this.isOpen = !this.isOpen;
  }
}
