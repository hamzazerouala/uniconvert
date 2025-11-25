Cahier des Charges : Plateforme SaaS de Conversion de Fichiers Universelle
Nom de code du projet : UniConvert AI
Version : 1.0
Date : 22/11/2025
1. Présentation du Projet
Le but est de développer une application web "Full Stack" permettant la conversion de fichiers en ligne (Documents, Images, Audio, Vidéo, E-book, Archives). L'application doit être performante, sécurisée et proposer un modèle économique "Freemium" (1er essai gratuit, puis abonnement).
2. Objectifs UX/UI (Design et Expérience)
Identité Visuelle :
Style : Minimaliste, "Corporate Tech", rassurant.
Palette : Blanc, Gris clair, Bleu accent (action), Typographie sans-serif moderne (Inter ou Roboto).
Pas de publicités intrusives, interface épurée.
Parcours Utilisateur (User Flow) :
Landing Page : Zone de "Drag & Drop" centrale immédiate. Pas d'inscription requise pour le premier test.
Upload : Barre de progression fluide.
Détection : L'IA/Backend détecte le type MIME (ex: .docx) et affiche les icônes correspondantes.
Sélection : Une liste déroulante intelligente propose uniquement les formats compatibles (ex: pour un .docx -> .pdf, .odt, .txt).
Conversion : Animation de chargement ("Processing...").
Résultat :
Utilisateur Gratuit (1ère fois) : Bouton de téléchargement direct.
Utilisateur Gratuit (2ème fois) : Pop-up ou redirection vers la page Pricing ("Abonnez-vous pour continuer").
Abonné : Téléchargement direct + option "Convertir un autre fichier".
3. Spécifications Fonctionnelles
3.1. Gestion des Fichiers (Core Feature)
Entrées supportées :
Documents : docx, pdf, txt, rtf, odt, xlsx, pptx.
Images : jpg, png, webp, tiff, svg, heic.
Audio : mp3, wav, flac, aac, ogg.
Vidéo : mp4, mov, avi, mkv, webm.
Logique de Conversion :
Utilisation de bibliothèques robustes (FFmpeg, Pandoc, ImageMagick, LibreOffice headless).
Auto-détection : Analyse des "Magic Numbers" du fichier, pas seulement l'extension.
3.2. Gestion des Utilisateurs et Abonnements
Tracking "Guest" : Utilisation du LocalStorage et/ou Fingerprinting léger pour compter la conversion gratuite sans compte.
Authentification : Email/Password et Google Auth (Firebase Auth recommandé).
Paiement : Intégration Stripe.
Plan Free : 1 conversion/jour (ou unique à vie, selon stratégie).
Plan Pro (Mensuel/Annuel) : Conversions illimitées, vitesse prioritaire, Batch.
3.3. Fonctionnalité "Batch" (Premium)
Permettre l'upload multiple (ex: 50 photos).
Sélecteur global ("Tout convertir en JPG") ou individuel.
Téléchargement final sous forme d'archive .zip.
4. Architecture Technique Recommandée
4.1. Stack Technologique
Frontend : React.js (Vite) + Tailwind CSS (pour le design rapide et pro).
Backend : Node.js (Express) ou Python (FastAPI/Flask). Note : Python est souvent préféré pour la manipulation de fichiers.
Base de données : Firestore (NoSQL) pour les utilisateurs et l'historique, ou PostgreSQL.
Stockage : AWS S3 ou Google Cloud Storage (avec règles de cycle de vie pour supprimer les fichiers après 1h).
4.2. Sécurité
Sanitization : Nettoyage des noms de fichiers.
Virus Scan : (Optionnel V2) Scan des fichiers uploadés.
Isolation : Les conversions doivent tourner dans des environnements isolés ou via des appels CLI sécurisés pour éviter les injections de commandes.
Confidentialité : Suppression automatique des fichiers originaux et convertis après X temps.
5. Étapes de Développement pour l'Agent IA
Phase 1 : MVP (Minimum Viable Product)
Mise en place du Frontend (Zone drop + UI).
Backend simple capable de recevoir un fichier.
Intégration d'un seul moteur de conversion (ex: Images via Sharp ou Pillow).
Lien Frontend <-> Backend pour télécharger le résultat.
Phase 2 : Logique Métier
Ajout du compteur de gratuité (Logique Frontend + validation Backend).
Intégration de l'authentification.
Page de Pricing (UI seulement pour commencer).
Phase 3 : Infrastructure et Robustesse
Intégration de FFmpeg (Vidéo/Audio) et Pandoc (Docs).
Gestion des erreurs (fichier corrompu, timeout).
Intégration Stripe réelle.
Phase 4 : Feature Premium
Développement de l'interface Batch.
Création dynamique de ZIP pour les téléchargements multiples.


