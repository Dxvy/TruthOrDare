import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'selectedLanguage';

  availableLanguages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  currentLanguage: Language = this.availableLanguages[0];

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  async initLanguage() {
    // Langues disponibles
    const languageCodes = this.availableLanguages.map(lang => lang.code);
    this.translate.addLangs(languageCodes);

    // Récupérer la langue sauvegardée
    const { value } = await Preferences.get({ key: this.LANGUAGE_KEY });

    let selectedLang = value || this.getBrowserLanguage();

    // Vérifier si la langue est disponible
    if (!languageCodes.includes(selectedLang)) {
      selectedLang = 'fr'; // Langue par défaut
    }

    this.setLanguage(selectedLang);
  }

  setLanguage(languageCode: string) {
    this.translate.use(languageCode);
    const lang = this.availableLanguages.find(l => l.code === languageCode);
    if (lang) {
      this.currentLanguage = lang;
      Preferences.set({ key: this.LANGUAGE_KEY, value: languageCode });
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  private getBrowserLanguage(): string {
    const browserLang = this.translate.getBrowserLang();
    return browserLang && ['fr', 'en', 'es'].includes(browserLang)
      ? browserLang
      : 'fr';
  }

  // Traduction instantanée
  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  // Traduction avec observable
  get(key: string, params?: any) {
    return this.translate.get(key, params);
  }
}
