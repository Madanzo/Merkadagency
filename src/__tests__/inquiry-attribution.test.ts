import { afterEach, expect, it } from 'vitest';
import { captureInquiryAttribution } from '@/lib/inquiryAttribution';
import { journeyEvent, setJourneyTestSink, type JourneySignal } from '@/lib/journeyEvents';
afterEach(() => setJourneyTestSink());
it('captures campaign codes while excluding query, fragment and referrer path data', () => {
  expect(captureInquiryAttribution('https://merkadagency.com/services/crm-automation?utm_source=canvas&utm_campaign=fall_2026&email=person@example.test#secret', 'https://example.test/private/person?token=secret'))
    .toEqual({landingPage:'https://merkadagency.com/services/crm-automation',utmSource:'canvas',utmCampaign:'fall_2026',referrer:'https://example.test'});
});
it('drops private paths, email-like campaigns and unbounded codes', () => {
  expect(captureInquiryAttribution('https://merkadagency.com/sign/private-id?utm_source=person@example.test&utm_medium='+'x'.repeat(101), 'javascript:alert(1)'))
    .toEqual({landingPage:'https://merkadagency.com'});
});
it('emits only fixed non-sensitive signals to an explicit isolated sink', () => {
  const signals: JourneySignal[]=[]; setJourneyTestSink(signal=>signals.push(signal));
  journeyEvent('form_error','contact','unconfirmed');
  expect(signals).toEqual([{event:'form_error',surface:'contact',outcome:'unconfirmed'}]);
  setJourneyTestSink(()=>{throw new Error('sink failure');});
  expect(()=>journeyEvent('intake_persisted','contact','persisted')).not.toThrow();
});
