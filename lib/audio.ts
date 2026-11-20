// Hospital Chime and Natural Female Voice Text-To-Speech announcement utility using native Web APIs

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoadedPromise: Promise<SpeechSynthesisVoice[]> | null = null;

/**
 * Initializes and retrieves available browser speech synthesis voices.
 * Handles asynchronous voice loading in Chrome, Edge, and Windows.
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (voicesLoadedPromise) {
    return voicesLoadedPromise;
  }

  voicesLoadedPromise = new Promise((resolve) => {
    const immediate = window.speechSynthesis.getVoices();
    if (immediate.length > 0) {
      cachedVoices = immediate;
      resolve(immediate);
      return;
    }

    const onVoicesChanged = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        cachedVoices = v;
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(v);
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    // Timeout safety fallback after 500ms
    setTimeout(() => {
      const v = window.speechSynthesis.getVoices();
      cachedVoices = v;
      resolve(v);
    }, 500);
  });

  return voicesLoadedPromise;
}

/**
 * Intelligent selector to choose the highest-quality realistic female voice.
 * Prioritizes Microsoft Neural/Natural online voices, Google high-definition female voices,
 * Apple Samantha/Victoria, and Windows female voices (Aria, Jenny, Sonia, Neerja, Zira).
 */
export function findBestFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Top Tier: Realistic Natural / Neural Female voices (available in Windows Edge, Chrome, Safari)
  const topTierFemaleKeywords = [
    'microsoft aria online (natural)',
    'microsoft jenny online (natural)',
    'microsoft sonia online (natural)',
    'microsoft libby online (natural)',
    'microsoft neerja online (natural)',
    'microsoft heera online (natural)',
    'google uk english female',
    'google us english',
    'samantha',
    'victoria',
    'karen',
    'tessa',
    'zira',
    'microsoft aria',
    'microsoft jenny',
    'microsoft zira',
    'microsoft sonia',
    'microsoft neerja'
  ];

  for (const keyword of topTierFemaleKeywords) {
    const found = voices.find(v => v.name.toLowerCase().includes(keyword));
    if (found) return found;
  }

  // 2. Any English voice with "female", "woman", or "natural" in the name
  const explicitFemaleEn = voices.find(
    v => v.lang.startsWith('en') && (
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('natural')
    )
  );
  if (explicitFemaleEn) return explicitFemaleEn;

  // 3. Known feminine first names across global TTS engines
  const femaleNames = [
    'jenny', 'aria', 'zira', 'samantha', 'victoria', 'karen', 
    'sonia', 'libby', 'neerja', 'heera', 'fiona', 'tessa', 
    'moira', 'alice', 'veena', 'catherine', 'hazel', 'susan'
  ];
  const femaleEn = voices.find(
    v => v.lang.startsWith('en') && femaleNames.some(fn => v.name.toLowerCase().includes(fn))
  );
  if (femaleEn) return femaleEn;

  // 4. Any English voice that is NOT explicitly named after a male persona
  const maleNames = ['david', 'mark', 'george', 'guy', 'male', 'richard', 'james', 'stefan', 'ravi', 'sean'];
  const nonMaleEn = voices.find(
    v => v.lang.startsWith('en') && !maleNames.some(mn => v.name.toLowerCase().includes(mn))
  );
  if (nonMaleEn) return nonMaleEn;

  // 5. Default English voice fallback
  const anyEn = voices.find(v => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  return voices[0] || null;
}

/**
 * Synthesizes a soothing 3-tone acoustic hospital chime (E5 -> G#5 -> B5) with warm reverb
 */
export function playHospitalChime() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Pleasant 3-note harmonic hospital announcement chime
    // Note 1: E5 (659.25 Hz)
    // Note 2: G#5 (830.61 Hz)
    // Note 3: B5 (987.77 Hz)
    const tones = [
      { freq: 659.25, time: 0.00, duration: 0.55, gain: 0.22 },
      { freq: 830.61, time: 0.18, duration: 0.60, gain: 0.26 },
      { freq: 987.77, time: 0.38, duration: 0.85, gain: 0.28 }
    ];

    tones.forEach(({ freq, time, duration, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + time + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });
  } catch (err) {
    console.warn('AudioContext chime error:', err);
  }
}

/**
 * Formats a ticket token into spaced phonetics so the TTS pronounces every letter and number clearly.
 * Example: "GEN-101" becomes "G E N, 1 0 1"
 */
function formatTokenForSpeech(token: string): string {
  if (!token) return '';
  return token.replace(/([A-Za-z]+)-?(\d+)/, (_, letters: string, digits: string) => {
    const spelledLetters = letters.toUpperCase().split('').join(' ');
    const spacedDigits = digits.split('').join(' ');
    return `${spelledLetters}, ${spacedDigits}`;
  });
}

/**
 * Formats room number for clear natural speech.
 * Example: "Room 101" -> "Room 1 0 1"
 */
function formatRoomForSpeech(room: string): string {
  if (!room) return 'Consultation Room';
  return room.replace(/(\d+)/g, (digits) => digits.split('').join(' '));
}

/**
 * Plays the hospital chime and announces the patient's token number and name
 * using a high-quality, realistic female receptionist voice.
 */
export async function announcePatientCall(
  ticketNumber: string, 
  roomNumber: string, 
  patientName?: string
) {
  // 1. Play realistic hospital chime
  playHospitalChime();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Pre-fetch voices
  const voices = await getAvailableVoices();
  const femaleVoice = findBestFemaleVoice(voices);

  // Allow chime to ring smoothly before speech starts (700ms)
  setTimeout(() => {
    try {
      // Cancel any ongoing or stuck speech
      window.speechSynthesis.cancel();

      const phoneticToken = formatTokenForSpeech(ticketNumber);
      const phoneticRoom = formatRoomForSpeech(roomNumber);

      // Natural, polite hospital receptionist announcement phrasing
      const announcementText = patientName && patientName.trim()
        ? `Attention please. Token number ${phoneticToken}, ${patientName.trim()}, please proceed to ${phoneticRoom}.`
        : `Attention please. Token number ${phoneticToken}, please proceed to ${phoneticRoom}.`;

      const utterance = new SpeechSynthesisUtterance(announcementText);

      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang || 'en-US';
      }

      // Tuned for natural, clear, professional female receptionist delivery:
      // Slightly measured pacing so patients in noisy waiting rooms catch every syllable
      utterance.rate = 0.88;
      utterance.pitch = 1.08;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis announcement error:', err);
    }
  }, 700);
}

/**
 * Announces doctor room status change (Active vs Break) using a natural, clear female voice.
 * Plays immediately upon button click using browser SpeechSynthesis API.
 */
export function announceDoctorStatus(status: 'ACTIVE' | 'BREAK') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Cancel any previous or ongoing speech so new status plays immediately
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const announcementText = status === 'ACTIVE'
      ? 'Doctor is now Active. The doctor is available for consultation.'
      : 'The doctor is currently on a break and is temporarily unavailable.';

    const utterance = new SpeechSynthesisUtterance(announcementText);

    const applyVoiceAndSpeak = (voices: SpeechSynthesisVoice[]) => {
      const femaleVoice = findBestFemaleVoice(voices);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      // Professional, natural, clear female delivery
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    };

    const immediateVoices = window.speechSynthesis.getVoices();
    if (immediateVoices && immediateVoices.length > 0) {
      applyVoiceAndSpeak(immediateVoices);
    } else {
      getAvailableVoices()
        .then(voices => applyVoiceAndSpeak(voices))
        .catch(() => {
          utterance.lang = 'en-US';
          window.speechSynthesis.speak(utterance);
        });
    }
  } catch (err) {
    console.warn('Doctor status announcement error:', err);
  }
}

/**
 * Announces doctor delay status using a natural, clear female voice.
 * Plays immediately upon button click using browser SpeechSynthesis API.
 */
export function announceDoctorDelay(minutes: number, reason?: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Cancel any previous or ongoing speech so new status plays immediately
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    let announcementText: string;
    const cleanReason = reason ? reason.trim() : '';

    if (minutes > 0) {
      if (cleanReason) {
        announcementText = `The doctor is currently delayed by ${minutes} minutes due to ${cleanReason}. Please wait for your consultation.`;
      } else {
        announcementText = `The doctor is currently delayed by ${minutes} minutes. Please wait for your consultation.`;
      }
    } else {
      announcementText = 'Doctor is now Active and on schedule. The doctor is available for consultation.';
    }

    const utterance = new SpeechSynthesisUtterance(announcementText);

    const applyVoiceAndSpeak = (voices: SpeechSynthesisVoice[]) => {
      const femaleVoice = findBestFemaleVoice(voices);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      // Professional, natural, clear female delivery
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    };

    const immediateVoices = window.speechSynthesis.getVoices();
    if (immediateVoices && immediateVoices.length > 0) {
      applyVoiceAndSpeak(immediateVoices);
    } else {
      getAvailableVoices()
        .then(voices => applyVoiceAndSpeak(voices))
        .catch(() => {
          utterance.lang = 'en-US';
          window.speechSynthesis.speak(utterance);
        });
    }
  } catch (err) {
    console.warn('Doctor delay announcement error:', err);
  }
}
