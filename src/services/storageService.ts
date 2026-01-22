export const STORAGE_KEYS = {
  COUNCILS: 'councilhost:councils',
  CONCLUSIONS: 'councilhost:conclusions',
  OPINIONS: 'councilhost:opinions',
  RESOLUTIONS: 'councilhost:resolutions',
  STATEMENTS: 'councilhost:statements',
  CURRENT_USER: 'councilhost:currentUser',
} as const;

export class StorageService {
  static get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  static getArray<T>(key: string): T[] {
    const data = this.get<T[]>(key);
    return data || [];
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
