// services/cache.service.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  isStale?: boolean;
}

interface CacheOptions {
  ttl: number; // Time to live en millisecondes
  staleWhileRevalidate?: boolean;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    const isExpired = now - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    // Marquer comme périmé si on est dans la période SWR
    if (now - item.timestamp > item.ttl * 0.8) {
      item.isStale = true;
    }

    return item.data;
  }

  /**
   * Met une valeur en cache
   */
  set<T>(key: string, data: T, options: CacheOptions): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: options.ttl,
      isStale: false
    });
  }

  /**
   * Vérifie si une valeur est périmée mais encore utilisable (SWR)
   */
  isStale(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    return item.isStale || false;
  }

  /**
   * Supprime une valeur du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }

  /**
   * Vide complètement le cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Récupère une valeur avec stratégie SWR (Stale While Revalidate)
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    // Vérifier si on a une requête en cours pour éviter les doublons
    const pendingRequest = this.pendingRequests.get(key);
    if (pendingRequest) {
      return await pendingRequest;
    }

    const cachedValue = this.get<T>(key);
    
    // Si on a une valeur en cache et qu'elle n'est pas périmée
    if (cachedValue && !this.isStale(key)) {
      return cachedValue;
    }

    // Si on a une valeur périmée mais qu'on utilise SWR, on retourne la valeur périmée
    // et on lance la requête en arrière-plan
    if (cachedValue && options.staleWhileRevalidate) {
      // Lancer la requête en arrière-plan pour revalider
      const revalidatePromise = fetchFn().then(newData => {
        this.set(key, newData, options);
        this.pendingRequests.delete(key);
        return newData;
      }).catch(error => {
        this.pendingRequests.delete(key);
        throw error;
      });
      
      this.pendingRequests.set(key, revalidatePromise);
      
      // Retourner immédiatement la valeur périmée
      return cachedValue;
    }

    // Sinon, on fait la requête et on attend le résultat
    const fetchPromise = fetchFn().then(data => {
      this.set(key, data, options);
      this.pendingRequests.delete(key);
      return data;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, fetchPromise);
    return await fetchPromise;
  }

  /**
   * Précharge des données en cache
   */
  async prefetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions
  ): Promise<void> {
    try {
      const data = await fetchFn();
      this.set(key, data, options);
    } catch (error) {
      console.warn(`Failed to prefetch data for key: ${key}`, error);
    }
  }

  /**
   * Invalide le cache pour une clé donnée
   */
  invalidate(key: string): void {
    this.delete(key);
  }

  /**
   * Invalide le cache pour toutes les clés qui matchent un pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.delete(key));
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const cacheService = new CacheService();