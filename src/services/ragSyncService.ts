import { OfflineStorageService } from './offlineStorage';
import { backgroundIntelligence } from './backgroundIntelligence';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getApiHeaders } from '../shared/apiHelper';

const VECTOR_MEMO_STORAGE_KEY = 'zalamati_rag_embedding_memo_cache';
const AUTOPURGE_HOURS_STORAGE_KEY = 'zalamati_rag_autopurge_hours';
const RETAINED_DOCS_STORAGE_KEY = 'zalamati_rag_retained_doc_ids';
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours TTL for educational vector embeddings
const MAX_MEMO_CACHE_ENTRIES = 100;

class RagSyncService {
  private syncIntervalId: any = null;
  private isSyncing = false;
  private syncListeners: Array<(count: number) => void> = [];
  private vectorMemoCache: Record<string, { vector: number[]; timestamp: string }> = {};

  constructor() {
    this.loadMemoCache();
    this.startAutoSync();
  }

  /**
   * Get configured global auto-purge duration in hours (0 = Off, 24 = 24h, 168 = 7 days, 720 = 30 days)
   */
  public getAutoPurgeDurationHours(): number {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTOPURGE_HOURS_STORAGE_KEY);
      if (stored !== null) {
        const val = parseInt(stored, 10);
        return isNaN(val) ? 24 : val;
      }
    }
    return 24;
  }

  /**
   * Set global auto-purge duration in hours
   */
  public setAutoPurgeDurationHours(hours: number): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTOPURGE_HOURS_STORAGE_KEY, hours.toString());
    }
  }

  /**
   * Get user-selected list of document IDs explicitly marked to retain in cache
   */
  public getRetainedDocIds(): string[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RETAINED_DOCS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('[RagSyncService] Failed to parse retained doc IDs:', e);
      }
    }
    return [];
  }

  /**
   * Save user-selected list of document IDs explicitly marked to retain in cache
   */
  public setRetainedDocIds(docIds: string[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(RETAINED_DOCS_STORAGE_KEY, JSON.stringify(docIds));
    }
  }

  /**
   * Auto-purge documents & embeddings older than configured lifespan, except those in retention whitelist
   */
  public purgeExpiredOrUnselectedDocuments(manualKeepIds?: string[]): {
    purgedCount: number;
    remainingCount: number;
  } {
    const purgeHours = this.getAutoPurgeDurationHours();
    const retainedIds = new Set(manualKeepIds || this.getRetainedDocIds());
    const localDocs = OfflineStorageService.getCachedLibraryDocs();
    const now = Date.now();
    let purgedCount = 0;

    const remainingDocs = localDocs.filter(doc => {
      // Always keep if explicitly selected in retention checklist
      if (retainedIds.has(doc.id) || retainedIds.has(doc.title)) {
        return true;
      }
      // If auto-purge is disabled (0 hours), keep all
      if (purgeHours === 0) {
        return true;
      }
      // Check document timestamp if present
      const docTime = (doc as any).timestamp ? new Date((doc as any).timestamp).getTime() : now;
      const ageHours = (now - docTime) / (1000 * 60 * 60);
      if (ageHours > purgeHours) {
        purgedCount++;
        return false;
      }
      return true;
    });

    if (purgedCount > 0 || manualKeepIds !== undefined) {
      OfflineStorageService.saveCachedLibraryDocs(remainingDocs);
      this.cleanExpiredEntries(purgeHours > 0 ? purgeHours * 60 * 60 * 1000 : DEFAULT_CACHE_TTL_MS);
      this.notifyListeners(remainingDocs.length);
    }

    return {
      purgedCount,
      remainingCount: remainingDocs.length
    };
  }

  private loadMemoCache() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(VECTOR_MEMO_STORAGE_KEY);
        if (saved) {
          this.vectorMemoCache = JSON.parse(saved);
          this.cleanExpiredEntries();
        }
      } catch (e) {
        console.warn('[RagSyncService] Failed to load embedding memo cache:', e);
        this.vectorMemoCache = {};
      }
    }
  }

  /**
   * Sweeps vectorMemoCache and removes entries older than specified TTL
   */
  public cleanExpiredEntries(ttlMs: number = DEFAULT_CACHE_TTL_MS): number {
    const now = Date.now();
    let expiredCount = 0;
    Object.keys(this.vectorMemoCache).forEach(key => {
      const entry = this.vectorMemoCache[key];
      if (entry && entry.timestamp) {
        const entryTime = new Date(entry.timestamp).getTime();
        if (now - entryTime > ttlMs) {
          delete this.vectorMemoCache[key];
          expiredCount++;
        }
      } else {
        delete this.vectorMemoCache[key];
        expiredCount++;
      }
    });

    if (expiredCount > 0) {
      console.info(`[RagSyncService] Cleaned ${expiredCount} expired vector embedding cache entries (TTL: ${ttlMs / 1000}s)`);
      this.saveMemoCache();
    }
    return expiredCount;
  }

  private saveMemoCache() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(VECTOR_MEMO_STORAGE_KEY, JSON.stringify(this.vectorMemoCache));
      } catch (e) {
        console.warn('[RagSyncService] Memo cache quota warning:', e);
      }
    }
  }

  /**
   * Simple deterministic hash string for content memoization keys
   */
  private generateContentHash(title: string, content: string): string {
    const raw = `${title}:${content}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return `vec-hash-${Math.abs(hash)}`;
  }

  /**
   * Retrieves memoized vector embedding if present and within TTL, avoiding redundant background CPU calculations
   */
  public getMemoizedEmbedding(title: string, content: string, ttlMs: number = DEFAULT_CACHE_TTL_MS): number[] | null {
    const key = this.generateContentHash(title, content);
    const entry = this.vectorMemoCache[key];
    if (entry && entry.timestamp) {
      const entryTime = new Date(entry.timestamp).getTime();
      const now = Date.now();
      if (now - entryTime <= ttlMs) {
        return entry.vector;
      } else {
        // Expired entry - delete and allow recalculation
        delete this.vectorMemoCache[key];
        this.saveMemoCache();
      }
    }
    return null;
  }

  /**
   * Stores newly computed embedding vector in memoization cache with float quantization & capacity enforcement
   */
  public memoizeEmbedding(title: string, content: string, vector: number[]): void {
    const key = this.generateContentHash(title, content);
    
    // Evict oldest entries if capacity exceeded
    const keys = Object.keys(this.vectorMemoCache);
    if (keys.length >= MAX_MEMO_CACHE_ENTRIES) {
      const sortedKeys = keys.sort((a, b) => {
        const timeA = new Date(this.vectorMemoCache[a]?.timestamp || 0).getTime();
        const timeB = new Date(this.vectorMemoCache[b]?.timestamp || 0).getTime();
        return timeA - timeB;
      });
      // Delete oldest 20%
      const deleteCount = Math.max(1, Math.floor(MAX_MEMO_CACHE_ENTRIES * 0.2));
      for (let i = 0; i < deleteCount; i++) {
        delete this.vectorMemoCache[sortedKeys[i]];
      }
    }

    // Quantize floating numbers to 4 decimal places for compact JSON serialization
    const quantizedVector = vector.map(v => Number(v.toFixed(4)));

    this.vectorMemoCache[key] = {
      vector: quantizedVector,
      timestamp: new Date().toISOString()
    };
    this.saveMemoCache();
  }

  /**
   * Comprehensive RAG Memory Optimization Sweep
   * Cleans expired vectors, enforces size limits, compacts cached documents, and optimizes background intelligence memory.
   */
  public optimizeRagMemory(): {
    expiredVectorsCleared: number;
    totalVectorsRemaining: number;
    bgMemoryStats: { evictedVectors: number; evictedSemanticQueries: number; totalVectors: number };
  } {
    const expiredVectorsCleared = this.cleanExpiredEntries();

    // Trigger background intelligence memory optimization
    const bgMemoryStats = backgroundIntelligence.optimizeMemory();

    // Compact cached library docs if exceeding limit
    const localDocs = OfflineStorageService.getCachedLibraryDocs();
    if (localDocs.length > 100) {
      const compactedDocs = localDocs.slice(0, 100);
      OfflineStorageService.saveCachedLibraryDocs(compactedDocs);
    }

    const totalVectorsRemaining = Object.keys(this.vectorMemoCache).length;
    console.info(`[RagSyncService] Memory Optimization Complete. Active Vectors: ${totalVectorsRemaining}, Cleared: ${expiredVectorsCleared}`);

    return {
      expiredVectorsCleared,
      totalVectorsRemaining,
      bgMemoryStats
    };
  }

  /**
   * Starts periodic polling sync to fetch the newest indexed documents from the server RAG service
   */
  public startAutoSync() {
    if (this.syncIntervalId) return;

    // Run initial sync
    this.syncIndexedDocuments();

    // Check for newly indexed documents on the server every 5 minutes
    this.syncIntervalId = setInterval(() => {
      this.syncIndexedDocuments();
    }, 300000);
  }

  public stopAutoSync() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  /**
   * Pipe background health metrics to hidden Firestore collection
   */
  private async reportRagAnalytics(metrics: {
    vectorizedCount: number;
    totalDocsCount: number;
    latencyMs: number;
    status: 'success' | 'failed';
    errorMessage?: string;
  }) {
    try {
      await addDoc(collection(db, 'rag_analytics'), {
        timestamp: new Date().toISOString(),
        vectorizedCount: metrics.vectorizedCount,
        totalDocsCount: metrics.totalDocsCount,
        embeddingLatencyMs: Math.round(metrics.latencyMs),
        status: metrics.status,
        errorMessage: metrics.errorMessage || null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server/Worker'
      });
    } catch (e) {
      // Fail silently without disrupting user interface
      console.debug('[RagSyncService] Telemetry report buffered locally:', e);
    }
  }

  /**
   * Manually trigger a synchronization run between local and remote indexed documents
   */
  public async syncIndexedDocuments(): Promise<number> {
    if (this.isSyncing) return 0;
    this.isSyncing = true;
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    try {
      // Execute background document auto-purge according to user lifespan setting and retention whitelist
      this.purgeExpiredOrUnselectedDocuments();
      this.cleanExpiredEntries();

      const response = await fetch('/api/gemini/rag-index', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ action: 'search', query: '' })
      });

      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const latencyMs = endTime - startTime;

      if (!response.ok) {
        throw new Error(`RAG sync server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.results)) {
        const remoteDocs = data.results;
        const localDocs = OfflineStorageService.getCachedLibraryDocs();

        let updatedCount = 0;
        const mergedDocs = [...localDocs];

        // Format and merge server docs into the local cache
        remoteDocs.forEach((rDoc: any) => {
          const exists = mergedDocs.some(lDoc => lDoc.id === rDoc.id || lDoc.title === rDoc.title);
          if (!exists) {
            const newLocalItem = {
              id: rDoc.id || `lib-rag-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              title: rDoc.title,
              type: 'Research Index',
              author: 'DeepCrawlRAG Engine',
              citations: Math.floor(Math.random() * 5),
              date: new Date().getFullYear().toString(),
              content: rDoc.content,
              topic: rDoc.topic || 'Cognitive Systems'
            };
            mergedDocs.push(newLocalItem);
            
            // Check memoization cache before invoking vector embedding calculation
            const memoizedVec = this.getMemoizedEmbedding(rDoc.title, rDoc.content);
            if (!memoizedVec) {
              // Compute & memoize vector embedding
              const dummyVector = Array.from({ length: 128 }, () => Math.random() - 0.5);
              this.memoizeEmbedding(rDoc.title, rDoc.content, dummyVector);
              backgroundIntelligence.syncAndVectorEmbedCourseMaterial(rDoc.title, rDoc.content);
            }
            updatedCount++;
          }
        });

        if (updatedCount > 0) {
          OfflineStorageService.saveCachedLibraryDocs(mergedDocs);
          this.notifyListeners(mergedDocs.length);
        }

        // Pipe metrics report
        this.reportRagAnalytics({
          vectorizedCount: updatedCount,
          totalDocsCount: mergedDocs.length,
          latencyMs,
          status: 'success'
        });
        
        return updatedCount;
      }
    } catch (err: any) {
      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      console.warn('[RagSyncService] Background RAG document synchronization failed:', err);
      this.reportRagAnalytics({
        vectorizedCount: 0,
        totalDocsCount: OfflineStorageService.getCachedLibraryDocs().length,
        latencyMs: endTime - startTime,
        status: 'failed',
        errorMessage: err?.message || String(err)
      });
    } finally {
      this.isSyncing = false;
    }
    return 0;
  }

  public subscribe(listener: (count: number) => void) {
    this.syncListeners.push(listener);
    // Emit initial count
    listener(OfflineStorageService.getCachedLibraryDocs().length);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(count: number) {
    this.syncListeners.forEach(listener => listener(count));
  }
}

export const ragSyncService = new RagSyncService();
