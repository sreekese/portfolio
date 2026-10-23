# About photo retouch

The About section now uses `src/assets/sreekese-photo-clean.png`. The built-in imagegen edit removed the red forehead mark from the enhanced portrait while requesting preservation of identity, expression, glasses, hair, beard, clothes, framing, lighting and background. The prior asset is retained. This is a targeted AI retouch, not a new portrait.

## Previous implementation records

# New orange-hoodie character

Replaced the previous avatar geometry with a new simplified Three.js character inspired by the supplied `3d-og.avif` render, following the user's choice of a simplified 3D interpretation. The image is a visual reference, not an imported 3D asset. The new model has swept brown tapered hair locks, large layered eyes, a clean-shaven face, orange hoodie with hood/zipper/drawstrings, dark trousers, and two-tone sneakers. It has no glasses. Its face differs from the reference and is not a reconstruction of the user's face.

The avatar stays stationary facing the studio camera, with relaxed arms, blinking and approximate mouth movement during browser speech. Reduced motion disables these movements. Existing desk, chair, laptop, click-to-speak controls and text-only loading state remain.

## Previous implementation records

# Natural standing refinement

The current character has relaxed arms, a clean-shaven jaw with no moustache, smaller eyes and smile, and symmetrical rounded rectangular glasses. Body orientation is calculated from the shared studio camera position so the face points toward the visitor; a small upward head angle matches the camera elevation. The black shirt, tan trousers, white sneakers, stationary stance and click-to-speak behavior remain. The model is still a stylized procedural likeness, not a photographic reconstruction.

## Previous implementation records

# Reference outfit and pose

The supplied `og.webp` reference now guides the procedural 3D character: charcoal button-up shirt with rolled cuffs, tan trousers with shaped folds, white sneakers, outstretched arms, defined fingers, fuller swept hair and a toothy smile. The desk and laptop remain in the banner. The avatar stays stationary; click-to-speak and reduced-motion support remain. This is a reference-inspired model, not a recovered mesh or exact reconstruction of the image.

## Previous implementation records

# Stationary avatar refinement

The character now stays at a fixed position and orientation. Walking and leg swings are removed; blinking and opt-in speech expressions remain. The forehead mark is removed from both the 3D model and SVG fallback. Hair uses a continuous swept silhouette with fine curved highlights, glasses use thinner frames and subtle transparent lenses, and eyes and beard proportions have been refined. This remains a stylized procedural model rather than a scanned likeness.

## Previous implementation records

# Full-body 3D studio

The banner now lazy-loads a Three.js scene from `src/lib/avatar/model.ts` through `src/components/avatar-studio.tsx`. The local procedural model is a stylized approximation of the supplied photo, not an exact scan or photorealistic reconstruction. It includes swept dark hair, rectangular glasses, beard and moustache, forehead mark, burgundy shirt, jeans, watch and sneakers. A desk with an open laptop and a chair sits beside the character.

The character takes a bounded stroll; starting the introduction stops walking and turns it toward the visitor with approximate mouth motion. The existing browser speech controls remain keyboard accessible. No transcript is displayed. Reduced motion freezes the pose, rendering is skipped offscreen or in a hidden tab, pixel ratio is capped, and geometries, materials, shadows and renderer are disposed on unmount. A 2D fallback retains speech controls if WebGL is unavailable. No external model or texture requests are made.

Renderer lifecycle follows the [Three.js WebGLRenderer reference](https://threejs.org/docs/pages/WebGLRenderer). Exact likeness would require a custom artist-built or scanned and rigged model, which is not supplied here. The enhanced About photo is unchanged.

## Earlier implementation records

# Live character update

The banner now renders a layered SVG anime character in `src/components/speaking-character.tsx`, replacing the static generated portrait. Separate eyes blink and the mouth animates only during browser speech playback. Mouth motion is an approximate talking cycle, not phoneme-level lip sync. Reduced motion and Pause animations disable movement without blocking audio. The visible introduction transcript has been removed by request. The enhanced About photograph is unchanged. Earlier generation records below describe preserved assets.

# Portfolio portrait assets

## Speaking anime avatar update — 19 October 2026

- Current hero: `src/assets/sreekese-avatar-anime.png`, anime-style illustration generated from the original photo with the built-in image-generation tool.
- Current About portrait: `src/assets/sreekese-photo-enhanced.png`, 1254 × 1254 AI-enhanced head-and-shoulders portrait. It replaces the low-resolution image enlarged 1.8× by CSS. The new image is displayed without CSS enlargement. The original photograph and earlier assets remain preserved. Enhancement reconstructs detail from the supplied photo; it is not a higher-resolution original capture.
- Intro text: `spokenIntro` in `src/data/portfolio.json`. Playback uses the visitor’s browser speech synthesis after an explicit click. No cloned voice, microphone access, or automatic playback. Local English voices are preferred when available; voices and pronunciation depend on the device.
- Click the avatar or Play introduction to start; click again or Stop audio to stop. Unsupported browsers display a playback status message. Playback is cancelled on unmount and when the tab becomes hidden. A ten-second startup timeout handles a silent/blocked speech service.
- Head movement and voice bars track speech start/end; these are presentation animations, not phoneme-level lip syncing. Reduced motion disables animation while retaining opt-in audio.
- Browser tests mock speech to verify event handling; they do not verify audible output or voice quality on the visitor’s device.
- API reference: [MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).

### Current generation prompts (built-in tool)

**anime**

Use case: style-transfer. Edit the reference photograph into a polished anime-style illustrated avatar for this same man's professional developer portfolio. Preserve recognizable face, medium brown skin, black swept wavy hair, rectangular glasses, short beard and moustache, small red forehead mark and burgundy collared shirt. Refined hand-drawn anime aesthetic, clean expressive linework, restrained cel shading, warm friendly expression, eyes directed forward, gently smiling mouth. Waist-up centered bust with entire hair and shoulders, arms relaxed, no objects, no text, no logos. Transparent background. Professional approachable adult, not childlike, no exaggerated anatomy. One single character.

**portrait**

Use case: identity-preserve. Enhance the provided original photograph into a clean, natural high-resolution square head-and-shoulders portrait for a professional portfolio. Keep the SAME person's facial proportions, expression, glasses, short beard and moustache, dark wavy hair, skin tone, forehead mark, and burgundy shirt. Frame from above hair to upper chest with room around the head, face centered. Retain softly blurred natural green outdoor background. Improve exposure, balanced natural color and restrained facial detail clarity, without changing identity, facial structure, age or expression. No beauty filter, no waxy skin, no invented accessories, no text or border. Photographic, not illustration. Avoid aggressive sharpening halos. A clean crop optimized for a circular 250px display.

## Earlier assets (preserved)

- `src/assets/sreekese-photo.jpg`: unchanged copy of the user-supplied `unnamed.jpg`; displayed with a CSS circular crop in About. Original source file is untouched. The photo is not AI-retouched.
- `src/assets/sreekese-avatar.png`: transparent illustrated hero avatar generated using the built-in image generation tool, with the supplied photo as the identity reference. Next.js Image optimizes both assets for the requested display size.

The avatar has a one-time arrival/wave, bounded pointer-following tilt, and click/keyboard greeting with a brief nod. These are UI animations of the illustration, not facial motion synthesis. The existing reduced-motion preference and Pause animations control disable movement while preserving the greeting. Timers are cleaned up on unmount.

## Final generation prompt

Use case: style-transfer. Create one polished illustrated avatar asset for this person's professional React developer portfolio. Reference image is the identity reference: preserve his recognizable face, medium brown skin, black wavy swept hair, thin rectangular glasses, short beard and moustache, and burgundy collared shirt. Friendly subtle smile. Premium editorial illustration with softly shaded clean shapes, not exaggerated caricature, not photorealistic. Waist-up centered front-facing bust, both shoulders fully visible, arms resting naturally, clean silhouette. Transparent background, no backdrop, no text, no border, no laptop, no extra objects. Face and eyes facing the viewer. Generous transparent margin around head and shoulders. This will be used as an interactive hero avatar on a minimal teal and cool-neutral portfolio. Return a single avatar, not a sheet.
