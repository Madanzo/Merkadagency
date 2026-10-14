/** Proposed CAM-271 vocabulary. No provider, network, queue or storage in this module.
 * Wire a reviewed sink only after shared-standard and consent approval. */
export type JourneyEvent = 'offer_view' | 'proof_view' | 'cta_click' | 'form_start' | 'form_step' | 'form_error' | 'form_submit' | 'intake_persisted';
export type JourneySurface = 'home' | 'offer' | 'proof' | 'contact' | 'audit' | 'other';
export type JourneySignal = { event: JourneyEvent; surface: JourneySurface; outcome?: 'unconfirmed' | 'invalid' | 'persisted' };
let sink: ((signal: JourneySignal) => void) | undefined;
// Explicit local test seam; not connected to SDKs or exposed on window.
export function setJourneyTestSink(next?: (signal: JourneySignal) => void) { sink = next; }
export function journeyEvent(event: JourneyEvent, surface: JourneySurface, outcome?: JourneySignal['outcome']) {
  // Construct an allowlisted payload; no field values, URLs, IDs or DOM text.
  try { sink?.({ event, surface, ...(outcome ? { outcome } : {}) }); } catch { /* Telemetry cannot break intake. */ }
}
