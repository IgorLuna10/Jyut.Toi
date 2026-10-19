/**
 * Subscription & Entitlement Service (RevenueCat & In-App Purchases)
 * Manages frictionless Free-to-Premium entitlements.
 */

const SUB_STORAGE_KEY = 'jyut-toi-subscription-state';

class SubscriptionService {
  constructor() {
    this._state = null;
    this._listeners = new Set();
    this.init();
  }

  init() {
    try {
      const saved = localStorage.getItem(SUB_STORAGE_KEY);
      if (saved) {
        this._state = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse subscription state', e);
    }

    if (!this._state) {
      this._state = {
        isPro: false,
        plan: null, // 'monthly' | 'annual'
        expiryDate: null,
        dailyAiGenerationsLeft: 1, // Free tier gets 1 daily AI generation
        lastAiResetDate: new Date().toISOString().split('T')[0],
      };
      this.save();
    }
  }

  save() {
    try {
      localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify(this._state));
      this._notify();
    } catch (e) {
      console.warn('Failed to save subscription state', e);
    }
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    this._listeners.forEach((fn) => fn(this.getState()));
  }

  getState() {
    if (!this._state) this.init();
    return this._state;
  }

  isPro() {
    return Boolean(this.getState().isPro);
  }

  upgradeToPro(plan = 'annual') {
    const expiry = new Date();
    if (plan === 'annual') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 1);
    }

    this._state = {
      ...this._state,
      isPro: true,
      plan,
      expiryDate: expiry.toISOString(),
      dailyAiGenerationsLeft: 9999,
    };
    this.save();
    return { success: true, plan, expiryDate: this._state.expiryDate };
  }

  restorePurchases() {
    // Simulates StoreKit / Google Play receipt verification
    const existing = this.getState();
    if (existing.isPro) {
      return { success: true, restored: true, message: 'Existing Hong Kong Pro Pass active' };
    }
    return { success: false, restored: false, message: 'No prior active purchases found on this Apple / Google ID' };
  }

  downgradeToFree() {
    this._state = {
      ...this._state,
      isPro: false,
      plan: null,
      expiryDate: null,
      dailyAiGenerationsLeft: 1,
    };
    this.save();
  }

  consumeDailyAiTurn() {
    const today = new Date().toISOString().split('T')[0];
    if (this._state.lastAiResetDate !== today) {
      this._state.lastAiResetDate = today;
      this._state.dailyAiGenerationsLeft = this._state.isPro ? 9999 : 1;
    }

    if (this._state.dailyAiGenerationsLeft > 0) {
      this._state.dailyAiGenerationsLeft -= 1;
      this.save();
      return true;
    }

    return false;
  }
}

export const subscriptionService = new SubscriptionService();
