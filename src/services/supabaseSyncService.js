import { supabase, isSupabaseConfigured } from './supabaseClient';

const QUEUE_STORAGE_KEY = 'jyut-toi-sync-queue';

class SupabaseSyncService {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.isSyncing = false;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushSyncQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  getQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to read sync queue', e);
      return [];
    }
  }

  saveQueue(queue) {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to save sync queue', e);
    }
  }

  queueCompletion(payload) {
    const queue = this.getQueue();
    queue.push({
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...payload,
    });
    this.saveQueue(queue);

    if (this.isOnline && isSupabaseConfigured) {
      this.flushSyncQueue();
    }
  }

  async flushSyncQueue() {
    if (!this.isOnline || !isSupabaseConfigured || this.isSyncing || !supabase) {
      return;
    }

    const queue = this.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    const remaining = [];

    for (const item of queue) {
      try {
        const { error } = await supabase.rpc('record_station_completion', {
          p_station_id: item.stationId,
          p_line_id: item.lineId || 1,
          p_accuracy: item.accuracy || 100,
          p_xp_earned: item.xpEarned || 100,
          p_user_local_date: item.localDate || new Date().toISOString().split('T')[0],
        });

        if (error) {
          console.warn('Sync failed for item, keeping in queue', error);
          remaining.push(item);
        }
      } catch (err) {
        console.warn('Network error while flushing sync item', err);
        remaining.push(item);
      }
    }

    this.saveQueue(remaining);
    this.isSyncing = false;
  }

  getPendingCount() {
    return this.getQueue().length;
  }
}

export const supabaseSyncService = new SupabaseSyncService();
