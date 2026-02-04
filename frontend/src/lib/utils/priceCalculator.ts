export interface PriceInfo {
    originalPrice: number;
    displayPrice: number;
    isOnSale: boolean;
}

export interface PriceValidationResult {
    valid: boolean;
    error?: string;
    displayPrice?: number;
}

/**
 * Valide que le nouveau prix est strictement inférieur au prix original
 * @param originalPrice - Prix original du produit
 * @param salePrice - Nouveau prix fixe (optionnel)
 * @param salePercentage - Pourcentage de réduction (optionnel)
 * @returns Résultat de validation avec message d'erreur si applicable
 */
export function validateSalePrice(
    originalPrice: number,
    salePrice?: number | null,
    salePercentage?: number | null,
    
): PriceValidationResult {
    if (!salePrice && !salePercentage) {
        return { valid: true };
    }

    let calculatedPrice = originalPrice;

    if (salePrice && salePrice > 0) {
        calculatedPrice = salePrice;
        
        if (calculatedPrice >= originalPrice) {
            return {
                valid: false,
                error: `Le prix de solde (${calculatedPrice.toFixed(2)}€) doit être strictement inférieur au prix original (${originalPrice.toFixed(2)}€)`
            };
        }
    } 
    else if (salePercentage && salePercentage > 0) {
        if (salePercentage >= 100) {
            return {
                valid: false,
                error: "Le pourcentage de réduction doit être inférieur à 100%"
            };
        }
        
        calculatedPrice = originalPrice * (1 - salePercentage / 100);
        
        if (calculatedPrice >= originalPrice) {
            return {
                valid: false,
                error: `Le prix calculé après réduction (${calculatedPrice.toFixed(2)}€) doit être strictement inférieur au prix original (${originalPrice.toFixed(2)}€)`
            };
        }
    }

    return { valid: true, displayPrice: calculatedPrice };
}

/**
 * Calcule le prix à afficher pour un produit en promotion
 * @param price - Prix original du produit
 * @param isOnSale - Si le produit est en solde
 * @param salePrice - Nouveau prix si spécifié
 * @param salePercentage - Pourcentage de réduction si spécifié
 * @returns Informations sur le prix (prix original et prix à afficher)
 */
export function calculateSalePrice(
    price: number,
    isOnSale: boolean,
    salePrice?: number | null,
    salePercentage?: number | null
): PriceInfo {
    if (!isOnSale || (!salePrice && !salePercentage)) {
        return {
            originalPrice: price,
            displayPrice: price,
            isOnSale: false,
        };
    }

    let displayPrice = price;

    if (salePrice && salePrice > 0) {
        displayPrice = salePrice;
    } else if (salePercentage && salePercentage > 0) {
        displayPrice = price * (1 - salePercentage / 100);
    }

    return {
        originalPrice: price,
        displayPrice: displayPrice,
        isOnSale: displayPrice < price,
    };
}

export function formatPrice(price: number): string {
    return price.toFixed(2);
}

/**
 * Calcule le prix ou le pourcentage complémentaire basé sur l'autre valeur
 * @param originalPrice - Prix original du produit
 * @param inputType - Type d'entrée ("price" ou "percentage")
 * @param inputValue - Valeur entrée par l'utilisateur
 * @returns Le prix ou pourcentage calculé
 */
export function calculateComplementaryValue(
    originalPrice: number,
    inputType: "price" | "percentage",
    inputValue?: number | null
): number | null {
    if (!inputValue || inputValue <= 0) return null;

    if (inputType === "percentage") {
        if (inputValue >= 100) return null;
        return Math.round((originalPrice * (100 - inputValue)) / 100 * 100) / 100;
    } else {
        if (inputValue >= originalPrice) return null;
        const percentage = Math.round(((originalPrice - inputValue) / originalPrice) * 100 * 100) / 100;
        return percentage;
    }
}
