HAPPY BIRTHDAY WEBSITE (v3) — SETUP GUIDE
============================================

THE FLOW
--------
1. ENTRANCE — flower photos frame a tap-to-open button over the
   candlelit theme background.
2. FLOWER BURST — the moment she taps in, all 8 flower photos tile in
   and fill the whole screen for a beat before the video starts.
3. RANDOM VIDEO — one of your 6 videos (vid1–vid6) is picked at
   random and plays full-screen with its own sound, "Happy Birthday
   LOVE" fading in over it in a bold rounded font.
4. CAKE — a symmetric, premium-styled cake with gold detailing and
   icing drip. Blow the candles via mic (or tap a flame) — clearing
   them triggers a confetti burst + synthesized applause. Then drag
   across the cake to slice it (cursor/finger only, no icon) — the
   cut triggers another confetti + applause moment, and the cake
   splits into two true, symmetric halves with an exposed sponge
   edge. bgm-music.mp3 starts here and loops, with a mute button.
5. SWIPE FLOWERS → LOVE LETTER — a scattering of flower photos covers
   the screen. She drags each one away, left or right, to clear them.
   Once they're all swiped away, an envelope is revealed underneath —
   tapping it opens the flap and slides the letter out, and your
   message types itself in word by word.
6. CAROUSEL — the fanned, cascading photo carousel, auto-rotating
   every 3 seconds, unchanged from before.

WHAT CHANGED FROM THE LAST VERSION
------------------------------------
• Cake rebuilt from scratch to be perfectly symmetric (the two halves
  are now identical clipped copies of the same cake, not offset
  pieces), the floating "plate" bug above the candles is gone, and the
  look is more premium — gold dot trim, dripping icing, a cake board,
  and soft ambient shadow underneath.
• Added confetti + synthesized crowd-applause sound both when the
  candles are blown out and when the cake is cut ("celebration mode").
• Added the flower-swipe → envelope → word-by-word letter sequence
  in place of the old static message screen.
• Intro now randomly picks one of 6 videos instead of always playing
  the same two in sequence.
• Entrance flowers and the full-screen flower burst use your new
  flower4–flower8 photos alongside the original three.

HOW TO USE IT
-------------
1. Add her photos to /photos, named 1.jpg, 2.jpg, 3.jpg, etc. — this
   feeds the final carousel. Until you do, it shows soft placeholder
   cards so you can preview the whole site right away.

2. Open index.html in a browser to preview locally.

3. Personalise text and settings in the CONFIG block at the top of
   js/script.js:
     - cakeHeading, collageTitle, finalNote, candleCount, blowSensitivity
     - letterMessage — the text that appears word-by-word in the letter
     - flowers / videos — swap in different files if you add more later

4. All videos, flowers, the theme background, and the music are
   already wired up in /media. Swap any file (keep the same filename)
   to change it without touching the code.

HOSTING IT SO SHE CAN OPEN IT FROM A LINK
------------------------------------------
  • Netlify Drop (netlify.com/drop) — drag the whole folder in, get a
    shareable link instantly.
  • GitHub Pages / Vercel — push the folder and deploy.

Any of these serve over HTTPS, which mic access requires.

NOTES
-----
• If the mic is denied or unsupported, tapping a candle blows it out
  instead — the flow always works either way.
• Autoplay-with-sound on the intro video and background music both
  need a user gesture first; her tap on "open your surprise" covers
  that, so sound should play normally from then on.
• Applause and the little three-note chime when the letter opens are
  generated live with the Web Audio API — nothing extra to download.
• No build step — plain HTML/CSS/JS, just open and go.

Happy birthday to her — hope she loves it! 🎂
