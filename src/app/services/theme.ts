import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = true; // Par défaut, thème sombre

  constructor() {
    this.loadTheme();
  }

  async loadTheme() {
    const { value } = await Preferences.get({ key: 'darkMode' });
    this.darkMode = value === null ? true : value === 'true';
    this.applyTheme();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    Preferences.set({ key: 'darkMode', value: String(this.darkMode) });
  }

  private applyTheme() {
    if (this.darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}
