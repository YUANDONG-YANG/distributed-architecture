/** All request counts in the simulator are in one evaluation window (not concurrent unless noted). */
export const TRAFFIC = {
  /**
   * Drives the whole Traffic tab: window volume = QPS × windowSeconds (req in that window).
   * Change this to rescale every tier proportionally.
   */
  ingressQpsDisplay: 20000,
  /** Window for token-bucket / admission counters — shown as “req / window”. */
  windowSeconds: 10,
  windowLabel: '10s evaluation window',
  /** Engine ratios were tuned at this window total; used only to scale surge & DB ceiling from the QPS model. */
  legacyModelWindowTotal: 220,
  get normalTotal() {
    return Math.round(this.ingressQpsDisplay * this.windowSeconds);
  },
  /** Preserves former normal:surge proportion (220 → 1000). */
  get surgeTotal() {
    return Math.round((this.normalTotal * 1000) / this.legacyModelWindowTotal);
  },
  /** Scales legacy 90 writes / window at T=220 to the current window volume. */
  get dbSafeCeilingWrites() {
    return Math.round((90 * this.normalTotal) / this.legacyModelWindowTotal);
  },
  /**
   * Blast radius tier vs ceiling (when actual writes ≤ ceiling):
   * - Controlled: core pressure ratio ≤ this value
   * - Elevated: ratio above this value
   * - Critical: actual writes > dbSafeCeilingWrites
   */
  blastElevatedAboveRatio: 0.85,
};
