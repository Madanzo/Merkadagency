# Camilo’s phone review

On the Mac’s Wi-Fi, with the Mac awake and the local preview running, open **http://192.168.0.84:8095/** using HTTP. The address loads from the Mac; physical-phone access is not inferred. If its LAN address changes, use the current address with port 8095. `localhost` on your phone points to the phone.

Record phone, OS, browser and pass/fail/not-tested for each item:

1. Menu → Website development → Contact → Back. Rotate the phone and enlarge text; check clipping and sideways scrolling.
2. Tap email, confirm `camiloreyna@merkadagency.com`, then cancel without sending. `/book` should also show email only, no calendar or calendar warning.
3. Enable Reduce Motion; check still illustrations and usable explanations. Try VoiceOver/TalkBack if available; record announcements/navigation issues.
4. Open privacy/terms and portfolio; confirm the privacy owner and no customer material.

Acknowledgment is not acceptance of untested gaps. [Current coverage and release procedure](ACCEPTANCE-2026-10-14.md) identifies remaining WebKit/Safari, physical-device, screen-reader, actual OS-motion and native text-only zoom limitations. Accept or complete those explicitly. The local cold-load lab is not production field Core Web Vitals.
