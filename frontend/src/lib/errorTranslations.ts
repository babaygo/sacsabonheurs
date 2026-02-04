/**
 * Dictionnaire centralisé de traduction des messages d'erreur
 * Mappe les codes d'erreur better-auth à des messages en français
 */

export const errorTranslations: Record<string, string> = {
    // Erreurs d'inscription
    "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": "Cet email est déjà utilisé. Veuillez en utiliser un autre.",
    
    // Erreurs de connexion
    "INVALID_EMAIL_OR_PASSWORD": "Email ou mot de passe invalide.",
    "USER_NOT_FOUND": "Cet utilisateur n'existe pas.",
    "INVALID_PASSWORD": "Le mot de passe est incorrect.",
    "EMAIL_NOT_VERIFIED": "Veuillez vérifier votre email avant de vous connecter.",
    
    // Erreurs de validation
    "INVALID_EMAIL": "Email invalide.",
    "WEAK_PASSWORD": "Le mot de passe doit contenir au moins une majuscule et un chiffre.",
    
    // Erreurs générales
    "INTERNAL_ERROR": "Une erreur interne s'est produite.",
};

/**
 * Récupère le message d'erreur traduit en français
 * @param code - Le code d'erreur retourné par l'API
 * @param fallbackMessage - Message par défaut si pas de traduction trouvée
 * @returns Le message d'erreur traduit en français
 */
export const getLocalizedError = (code: string, fallbackMessage: string): string => {
    return errorTranslations[code] || fallbackMessage;
};
