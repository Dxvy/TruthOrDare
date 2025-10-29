import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile
} from '@angular/fire/auth';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  currentUser: User | null = null;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);

    // Observer l'état de connexion
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        // Sauvegarder localement
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  // Inscription avec email/password
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Mettre à jour le profil avec le nom
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }

      return userCredential.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Connexion avec email/password
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Connexion avec Google
  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(this.auth, provider);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Réinitialisation du mot de passe
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('user');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Gestion des erreurs
  private handleError(error: any): string {
    let message = 'Une erreur est survenue';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Cet email est déjà utilisé';
        break;
      case 'auth/invalid-email':
        message = 'Email invalide';
        break;
      case 'auth/operation-not-allowed':
        message = 'Opération non autorisée';
        break;
      case 'auth/weak-password':
        message = 'Mot de passe trop faible (min. 6 caractères)';
        break;
      case 'auth/user-disabled':
        message = 'Ce compte a été désactivé';
        break;
      case 'auth/user-not-found':
        message = 'Aucun compte trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/too-many-requests':
        message = 'Trop de tentatives. Réessaye plus tard';
        break;
      case 'auth/network-request-failed':
        message = 'Erreur de connexion. Vérifie ta connexion internet';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Connexion annulée';
        break;
      default:
        message = error.message || 'Une erreur est survenue';
    }

    return message;
  }
}
