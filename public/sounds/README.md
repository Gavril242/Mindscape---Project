
# Sound Assets Documentation

This document outlines all sound files used in the MindHUB application and their requirements.

## Ambient Sounds (Up to 10 minutes each, should loop seamlessly)

- **rain.mp3**: Gentle rainfall sounds for relaxation and focus
- **ocean.mp3**: Ocean waves sounds for calm and tranquility
- **fireplace.mp3**: Crackling fireplace sounds for warmth and comfort
- **forest.mp3**: Forest ambient sounds with birds and leaves rustling

## Interactive Sounds (Maximum 1 second each)

- **water-drop.mp3**: Water drop sound for button clicks and general interactions
- **inhale.mp3**: Breathing in sound for the breathing exercise
- **exhale.mp3**: Breathing out sound for the breathing exercise

## Sound Replacement Guidelines

1. All ambient sounds should be:
   - Up to 10 minutes in length (optimal range: 3-10 minutes)
   - High quality (at least 128kbps)
   - Set up to loop seamlessly without noticeable transitions
   - Stereo audio for immersive experience

2. All interactive sounds should be:
   - Maximum 1 second in length
   - Quick to load and play
   - Not too jarring or distracting
   - Normalized to avoid volume spikes

3. File format:
   - All sounds should be MP3 format for broad compatibility
   - Consider providing OGG alternatives for broader browser support
   - Sample rate of 44.1kHz recommended

## Implementation Notes

- Ambient sounds are played through the AudioPlayer component
- The MiniAudioPlayer component provides controls when minimized
- Interactive sounds are triggered through the SoundContext
- Volume settings are saved per user in localStorage (and will be moved to Supabase in the future)

