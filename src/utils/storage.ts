import { Recipe } from '../types';

const DB_NAME = 'family_recipe_book_db';
const DB_VERSION = 1;
const STORE_RECIPES = 'recipes';
const STORE_IMAGES = 'custom_images';
const STORE_META = 'metadata';

const LS_BACKUP_KEY = 'family_cookbook_recipes_backup';
const LS_IMAGES_BACKUP_KEY = 'family_cookbook_images_backup';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_RECIPES)) {
        db.createObjectStore(STORE_RECIPES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: 'recipeId' });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save user custom image directly to durable IndexedDB & backup map
 */
export async function saveCustomImage(recipeId: string, imageDataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_IMAGES, 'readwrite');
    tx.objectStore(STORE_IMAGES).put({ recipeId, imageDataUrl, updatedAt: Date.now() });
  } catch (e) {
    console.warn('Could not save image to IndexedDB, fallback to localStorage', e);
  }

  // Backup to localStorage map as fallback
  try {
    const raw = localStorage.getItem(LS_IMAGES_BACKUP_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[recipeId] = imageDataUrl;
    localStorage.setItem(LS_IMAGES_BACKUP_KEY, JSON.stringify(map));
  } catch (e) {
    // If quota exceeded in localStorage, IndexedDB is already holding it safely
  }
}

/**
 * Load all custom images saved by recipeId
 */
export async function loadCustomImagesMap(): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  // Load from localStorage first (synchronous fast)
  try {
    const raw = localStorage.getItem(LS_IMAGES_BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(result, parsed);
    }
  } catch (e) {}

  // Merge from IndexedDB (higher fidelity)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_IMAGES, 'readonly');
    const req = tx.objectStore(STORE_IMAGES).getAll();
    await new Promise<void>((resolve) => {
      req.onsuccess = () => {
        const items = req.result as Array<{ recipeId: string; imageDataUrl: string }>;
        if (items) {
          items.forEach(item => {
            if (item.recipeId && item.imageDataUrl) {
              result[item.recipeId] = item.imageDataUrl;
            }
          });
        }
        resolve();
      };
      req.onerror = () => resolve();
    });
  } catch (e) {}

  return result;
}

/**
 * Persist entire recipes collection to IndexedDB and localStorage
 */
export async function persistRecipes(recipes: Recipe[]): Promise<void> {
  // Save to IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_RECIPES, 'readwrite');
    const store = tx.objectStore(STORE_RECIPES);
    recipes.forEach(r => store.put(r));
  } catch (e) {
    console.warn('Failed to save to IndexedDB', e);
  }

  // Save to localStorage
  try {
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(recipes));
  } catch (e) {
    console.warn('localStorage quota reached, persisted via IndexedDB', e);
  }
}

/**
 * Load recipes from durable storage
 */
export async function loadStoredRecipes(): Promise<Recipe[] | null> {
  // Try IndexedDB first
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_RECIPES, 'readonly');
    const req = tx.objectStore(STORE_RECIPES).getAll();
    const records = await new Promise<Recipe[]>((resolve) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
    if (records && records.length > 0) {
      return records;
    }
  } catch (e) {}

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(LS_BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return null;
}
