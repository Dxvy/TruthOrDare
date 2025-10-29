import { Injectable } from '@angular/core';

export interface Cards {
  mode: string;
  type: 'action' | 'verite';
  description: string;
  genreJoueur1: string;
  genreJoueur2?: string;
  timer?: number;
  repeatable: boolean;
  photoObligatoire?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cards: Cards[] = [
    // ==================== MODE SOFT - ACTIONS ====================
    {
      mode: 'soft',
      type: 'action',
      description: 'Fais 10 pompes',
      genreJoueur1: 'tous',
      timer: 30,
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Imite une célébrité au choix du groupe',
      genreJoueur1: 'tous',
      timer: 45,
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Raconte une blague, tu dois faire rire au moins une personne',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Danse pendant 30 secondes sur une chanson choisie par le groupe',
      genreJoueur1: 'tous',
      timer: 30,
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Fais un compliment sincère à chaque joueur',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Parle avec un accent étranger pendant les 3 prochains tours',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Chante le refrain de ta chanson préférée',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'action',
      description: 'Fais une grimace et prends une photo',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },

    // ==================== MODE SOFT - VÉRITÉS ====================
    {
      mode: 'soft',
      type: 'verite',
      description: 'Quel est ton plus grand rêve dans la vie ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Quelle est la chose la plus embarrassante qui te soit arrivée en public ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Si tu pouvais avoir un super-pouvoir, lequel choisirais-tu ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Qui est ton crush secret parmi les personnes présentes ?',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Quel est le dernier mensonge que tu as dit ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Quelle est la chose la plus folle que tu aies faite pour impressionner quelqu\'un ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Si tu devais revivre une journée de ta vie, laquelle choisirais-tu ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'soft',
      type: 'verite',
      description: 'Quel est le surnom le plus ridicule qu\'on t\'ait donné ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },

    // ==================== MODE HOT - ACTIONS ====================
    {
      mode: 'hot',
      type: 'action',
      description: 'Embrasse le joueur de ton choix sur la joue',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Enlève un vêtement de ton choix (chaussette acceptée)',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Fais un massage d\'épaules de 30 secondes au joueur de ton choix',
      genreJoueur1: 'tous',
      timer: 30,
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Déclare ta flamme à un joueur comme dans un film romantique',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Fais un lap dance de 20 secondes sur une chaise',
      genreJoueur1: 'tous',
      timer: 20,
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Laisse le groupe lire tes 5 derniers messages envoyés',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Bois un shot les yeux dans les yeux avec le joueur de ton choix',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hot',
      type: 'action',
      description: 'Fais un body shot sur le joueur de ton choix',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },

    // ==================== MODE HOT - VÉRITÉS ====================
    {
      mode: 'hot',
      type: 'verite',
      description: 'Quel est ton fantasme secret ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'As-tu déjà trompé quelqu\'un ? Si oui, raconte',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'Avec qui as-tu eu ton premier baiser ? Raconte les détails',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'Parmi les joueurs présents, avec qui aurais-tu une aventure d\'un soir ?',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'Quelle est la dernière fois où tu as pensé à quelqu\'un de manière... coquine ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'As-tu déjà fait l\'amour dans un lieu public ? Où ?',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'Montre la photo la plus sexy de toi sur ton téléphone',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hot',
      type: 'verite',
      description: 'Quelle est la position que tu préfères ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },

    // ==================== MODE HARDCORE - ACTIONS ====================
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Embrasse passionnément le joueur de ton choix pendant 5 secondes',
      genreJoueur1: 'tous',
      timer: 5,
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Fais un strip-tease jusqu\'en sous-vêtements',
      genreJoueur1: 'tous',
      timer: 60,
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Lèche la joue du joueur à ta droite',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Fais un câlin câlin pendant 30 secondes avec le joueur de ton choix',
      genreJoueur1: 'tous',
      timer: 30,
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Simule un orgasme de manière convaincante',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Mets-toi en sous-vêtements pour les 3 prochains tours',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Fais une danse sensuelle collé(e) contre le joueur de ton choix',
      genreJoueur1: 'tous',
      timer: 45,
      repeatable: true,
      photoObligatoire: true
    },
    {
      mode: 'hardcore',
      type: 'action',
      description: 'Laisse le groupe fouiller dans ta galerie photos pendant 30 secondes',
      genreJoueur1: 'tous',
      timer: 30,
      repeatable: false,
      photoObligatoire: false
    },

    // ==================== MODE HARDCORE - VÉRITÉS ====================
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'Décris en détail ta meilleure expérience sexuelle',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'Combien de personnes as-tu embrassé ? Cite des noms si possible',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'As-tu déjà regardé du contenu pour adultes avec quelqu\'un ? Qui et quand ?',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'Quelle est la chose la plus perverse que tu aies faite ?',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'As-tu déjà eu des relations avec plusieurs personnes en même temps ?',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'Montre le message le plus hot que tu as envoyé récemment',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'Si tu devais faire un plan à trois, qui choisirais-tu parmi les joueurs ?',
      genreJoueur1: 'tous',
      repeatable: false,
      photoObligatoire: false
    },
    {
      mode: 'hardcore',
      type: 'verite',
      description: 'Décris ton fetish le plus secret',
      genreJoueur1: 'tous',
      repeatable: true,
      photoObligatoire: false
    }
  ];

  constructor() {}

  /**
   * Récupère une carte aléatoire selon le mode et le type
   */
  getRandomCard(mode: string, type: 'action' | 'verite', playedCards: string[] = []): Cards | null {
    // Filtrer les cartes par mode et type
    let availableCards = this.cards.filter(
      card => card.mode === mode.toLowerCase() && card.type === type
    );

    // Exclure les cartes déjà jouées qui ne sont pas répétables
    availableCards = availableCards.filter(card => {
      if (card.repeatable) return true;
      const cardId = this.getCardId(card);
      return !playedCards.includes(cardId);
    });

    if (availableCards.length === 0) {
      return null; // Plus de cartes disponibles
    }

    // Sélectionner une carte aléatoire
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  }

  /**
   * Génère un ID unique pour une carte
   */
  private getCardId(card: Cards): string {
    return `${card.mode}-${card.type}-${card.description.substring(0, 20)}`;
  }

  /**
   * Récupère toutes les cartes d'un mode
   */
  getCardsByMode(mode: string): Cards[] {
    return this.cards.filter(card => card.mode === mode.toLowerCase());
  }

  /**
   * Récupère le nombre total de cartes
   */
  getTotalCards(): number {
    return this.cards.length;
  }

  /**
   * Récupère les statistiques des cartes
   */
  getCardsStats() {
    return {
      soft: {
        actions: this.cards.filter(c => c.mode === 'soft' && c.type === 'action').length,
        verites: this.cards.filter(c => c.mode === 'soft' && c.type === 'verite').length
      },
      hot: {
        actions: this.cards.filter(c => c.mode === 'hot' && c.type === 'action').length,
        verites: this.cards.filter(c => c.mode === 'hot' && c.type === 'verite').length
      },
      hardcore: {
        actions: this.cards.filter(c => c.mode === 'hardcore' && c.type === 'action').length,
        verites: this.cards.filter(c => c.mode === 'hardcore' && c.type === 'verite').length
      }
    };
  }
}
