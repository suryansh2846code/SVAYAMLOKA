# /public/audio — sound for the void

Drop your samples here and they're used automatically. If a file is
missing, the scene falls back to live in-browser synthesis, so it
always works.

| File | What it is | Notes |
|------|------------|-------|
| `drone.mp3` | Looping ambient drone | Deep, near-inaudible temple hum. Should loop seamlessly. Plays quietly under everything. |
| `thump.mp3` | The pulse strike (Scene 0.1) | An ancient bell / sub-bass hit struck from far away — deep, long metallic decay. One-shot. |
| `whisper.mp3` | The fracture whisper (Scene 0.1) | Thousands of voices speaking one syllable, barely audible. Plays once as reality fractures. Optional. |

- Accepted formats: `.mp3`, `.ogg`, or `.wav` (same base name). `.mp3` is the safest cross-browser choice.
- Keep the drone LUFS low — it's meant to be *felt*, not heard.
- Both start on the visitor's first mouse move (browsers block autoplay).
- Volume is set in `app/enter/scene/audio.js` (drone `target`, thump gain) if you need to trim.
