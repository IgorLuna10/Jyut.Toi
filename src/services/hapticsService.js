/**
 * Native Haptics & Vibration Engine
 * Integrates @capacitor/haptics for mobile devices with web browser fallback.
 */

class HapticsService {
  constructor() {
    this._haptics = null;
    this._ImpactStyle = null;
    this._NotificationType = null;
    this.init();
  }

  async init() {
    try {
      const module = await import('@capacitor/haptics');
      this._haptics = module.Haptics;
      this._ImpactStyle = module.ImpactStyle;
      this._NotificationType = module.NotificationType;
    } catch (e) {
      // Running in pure web browser without Capacitor native bridge
      this._haptics = null;
    }
  }

  /**
   * Light tactile tap on button press or tile selection
   */
  async tapLight() {
    if (this._haptics && this._ImpactStyle) {
      try {
        await this._haptics.impact({ style: this._ImpactStyle.Light });
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  /**
   * Medium impact when magnetic word tile snaps into sentence workbench
   */
  async tapMedium() {
    if (this._haptics && this._ImpactStyle) {
      try {
        await this._haptics.impact({ style: this._ImpactStyle.Medium });
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  }

  /**
   * Celebratory double-pulse on correct exercise answer and station cleared
   */
  async success() {
    if (this._haptics && this._NotificationType) {
      try {
        await this._haptics.notification({ type: this._NotificationType.Success });
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 60, 25]);
    }
  }

  /**
   * Warning vibration pattern on incorrect answer
   */
  async error() {
    if (this._haptics && this._NotificationType) {
      try {
        await this._haptics.notification({ type: this._NotificationType.Error });
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 40, 40]);
    }
  }

  /**
   * Selection change tick for bottom navigation or tab swipe
   */
  async selectionChanged() {
    if (this._haptics) {
      try {
        await this._haptics.selectionChanged();
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
  }
}

export const hapticsService = new HapticsService();
