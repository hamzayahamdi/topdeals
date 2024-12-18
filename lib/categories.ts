export const PREDEFINED_CATEGORIES = {
  Salons: ["Salon en L", "Salon en U"] as const,
  Canapés: ["Canapé 2 Places", "Canapé 3 Places", "Fauteuils"] as const,
  Chambre: ["Lits", "Matelas", "Table de Chevet"] as const,
  Cuisine: ["Tables", "Chaises", "Tabourets"] as const,
  Bureau: ["Bureaux", "Chaises de Bureau"] as const,
  Rangement: ["Armoires", "Commodes", "Bibliothèques"] as const,
  Tables: ["Tables Basses", "Tables à Manger"] as const,
  Deco: ["Tapis", "Rideaux", "Coussins", "Miroirs"] as const,
} as const;

export type MainCategory = keyof typeof PREDEFINED_CATEGORIES;
export type SubCategory<T extends MainCategory> = typeof PREDEFINED_CATEGORIES[T][number];
