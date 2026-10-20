# Camilo's short phone review — informational patch only

Connect the phone to the Mac's Wi-Fi network, keep the Mac awake, then open **http://192.168.0.84:8096/** in Safari or Chrome. On the Mac use **http://localhost:8096/**. This is a local, noindex Hosting emulator, not a public preview deployment; it stops working if the server stops or the Mac's address changes. If it cannot be reached, do not mark phone testing complete. Restart instructions: clean candidate checkout, npm ci, npm run build:seo:preview; then `npx -y firebase-tools@latest emulators:start --only hosting --config firebase.seo.preview.json --project merkadagency-dd2aa` and use the Mac's current LAN address.

1. Read the homepage in portrait, then landscape. Confirm headings, navigation and email address fit and remain readable.
2. Tap Website development, then Website brief. Scroll both pages; open/close the service questions. Confirm navigation and back behavior.
3. Increase the phone's text size/page zoom. Check that the address and headings wrap without horizontal scrolling or hidden text.
4. Open Contact. Confirm `camiloreyna@merkadagency.com`, copy the address, and optionally open an email draft. **Do not send a test message.** Confirm there is no calendar, unusable form or success message.
5. If possible use VoiceOver (iPhone) or TalkBack (Android) to traverse headings, links and the service disclosures. Record the device, OS/browser, settings and any issue. A brief visual check does not count as screen-reader coverage.

Reply with the actual device/browser, checks completed and any failures. Explicitly name a gap if accepting it; acknowledgment is not acceptance of every outstanding gap. This review applies only to this smaller informational patch; it does not close PR #1's redesign acceptance.
