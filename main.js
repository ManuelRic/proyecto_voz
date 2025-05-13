// tts.js - Text-to-Speech Concatenativo en JavaScript

// ==================== PHONEMES DEFINITION ====================
const Phonemes = {
  // Vocales
  V_A: 0,   // casa
  V_E: 1,   // mesa
  V_I: 2,   // tinta
  V_O: 3,   // sol
  V_U: 4,   // luna

  // Diptongos comunes
  V_AI: 5,   // aire
  V_EI: 6,   // peine
  V_OI: 7,   // boina
  V_AU: 8,   // causa
  V_OU: 9,   // bou
  V_IA: 10,  // piano
  V_IE: 11,  // tierra
  V_IO: 12,  // avión
  V_UA: 13,  // suave
  V_UE: 14,  // fuerte
  V_UI: 15,  // muy

  // Consonantes
  C_B: 16,  // beso
  C_D: 17,  // dado
  C_F: 18,  // foca
  C_G: 19,  // gato
  C_K: 20,  // kilo / casa
  C_L: 21,  // leche
  C_LL: 22, // lluvia
  C_M: 23,  // mano
  C_N: 24,  // noche
  C_NY: 25, // niño
  C_P: 26,  // papa
  C_R: 27,  // caro (simple)
  C_RR: 28, // perro (vibrante múltiple)
  C_S: 29,  // sopa
  C_T: 30,  // taza
  C_CH: 31, // chico
  C_Y: 32,  // yo
  C_J: 33,  // jarra
  C_W: 34,  // whisky
  C_Z: 35,  // zapato

  // Pausas y puntuación
  PUNC_PERIOD: 36,  // punto (pausa larga)
  PUNC_COMMA: 37,   // coma (pausa media)
  PUNC_QUESTION: 38,// signo de pregunta
  PUNC_EXCLAIM: 39, // signo de exclamación
  PAUSE_WORD: 40    // pausa breve entre palabras
};

// ==================== UTILITY FUNCTIONS ====================
class TTSUtils {
  static tokenize(text) {
    // Convierte texto en una lista de palabras y signos de puntuación
    return text.toLowerCase().match(/[\w']+|[.,!?;]/g) || [];
  }

  static async loadPronunciationDict(url) {
    // Carga el diccionario de pronunciación desde un CSV
    try {
      const response = await fetch(url);
      const csvData = await response.text();
      const dict = {};
      
      csvData.split('\n').forEach(line => {
        const [word, phonemes] = line.split(',');
        if (word && phonemes) {
          dict[word.trim()] = phonemes.trim().split(' ').map(Number);
        }
      });
      
      return dict;
    } catch (error) {
      console.error('Error loading pronunciation dictionary:', error);
      return {};
    }
  }
}

// ==================== PHONEME CONVERTER ====================
class PhonemeConverter {
  constructor(usePronunciationDict = true, pronunciationDict = {}) {
    this.usePronunciationDict = usePronunciationDict;
    this.pronunciationDict = pronunciationDict;
  }

  async wordsToPhonemes(words) {
    const result = [];
    for (const word of words) {
      const lowerWord = word.toLowerCase();
      let pronunciation = null;
      
      if (this.usePronunciationDict && this.pronunciationDict[lowerWord]) {
        pronunciation = this.pronunciationDict[lowerWord];
      }
      
      if (pronunciation) {
        result.push(...pronunciation);
      } else {
        const blocked = this.phonemeScan(lowerWord);
        result.push(...this.phonemeBlocksToList(blocked));
      }
      result.push(Phonemes.PAUSE_WORD);
    }
    return result;
  }

  phonemeBlocksToList(blocks) {
    const matches = blocks.match(/\[\d+\]/g) || [];
    return matches.map(b => parseInt(b.replace(/\[(\d+)\]/, '$1')));
  }

  phonemeScan(word) {
    let currentWord = word;
    
    while (/[a-záéíóúüñ.,;!?]/.test(currentWord)) {
      // Reglas especiales para español (dígrafos y combinaciones)
      currentWord = this.replaceWithPhoneme(currentWord, /ch/g, [Phonemes.C_CH]);
      currentWord = this.replaceWithPhoneme(currentWord, /ll/g, [Phonemes.C_LL]);
      currentWord = this.replaceWithPhoneme(currentWord, /rr/g, [Phonemes.C_RR]);
      currentWord = this.replaceWithPhoneme(currentWord, /qu/g, [Phonemes.C_K]);
      currentWord = this.replaceWithPhoneme(currentWord, /gu/g, [Phonemes.C_G]);
      currentWord = this.replaceWithPhoneme(currentWord, /ñ/g, [Phonemes.C_NY]);

      // Vocales (incluyendo tildadas)
      currentWord = this.replaceWithPhoneme(currentWord, /[áa]/g, [Phonemes.V_A]);
      currentWord = this.replaceWithPhoneme(currentWord, /[ée]/g, [Phonemes.V_E]);
      currentWord = this.replaceWithPhoneme(currentWord, /[íi]/g, [Phonemes.V_I]);
      currentWord = this.replaceWithPhoneme(currentWord, /[óo]/g, [Phonemes.V_O]);
      currentWord = this.replaceWithPhoneme(currentWord, /[úüu]/g, [Phonemes.V_U]);

      // Consonantes
      currentWord = this.replaceWithPhoneme(currentWord, /b/g, [Phonemes.C_B]);
      currentWord = this.replaceWithPhoneme(currentWord, /c/g, [Phonemes.C_K]);
      currentWord = this.replaceWithPhoneme(currentWord, /d/g, [Phonemes.C_D]);
      currentWord = this.replaceWithPhoneme(currentWord, /f/g, [Phonemes.C_F]);
      currentWord = this.replaceWithPhoneme(currentWord, /g/g, [Phonemes.C_G]);
      currentWord = this.replaceWithPhoneme(currentWord, /h/g, []);  // muda
      currentWord = this.replaceWithPhoneme(currentWord, /j/g, [Phonemes.C_J]);
      currentWord = this.replaceWithPhoneme(currentWord, /k/g, [Phonemes.C_K]);
      currentWord = this.replaceWithPhoneme(currentWord, /l/g, [Phonemes.C_L]);
      currentWord = this.replaceWithPhoneme(currentWord, /m/g, [Phonemes.C_M]);
      currentWord = this.replaceWithPhoneme(currentWord, /n/g, [Phonemes.C_N]);
      currentWord = this.replaceWithPhoneme(currentWord, /p/g, [Phonemes.C_P]);
      currentWord = this.replaceWithPhoneme(currentWord, /r/g, [Phonemes.C_R]);
      currentWord = this.replaceWithPhoneme(currentWord, /s/g, [Phonemes.C_S]);
      currentWord = this.replaceWithPhoneme(currentWord, /t/g, [Phonemes.C_T]);
      currentWord = this.replaceWithPhoneme(currentWord, /v/g, [Phonemes.C_B]);  // igual que "b" en español
      currentWord = this.replaceWithPhoneme(currentWord, /w/g, [Phonemes.C_W]);
      currentWord = this.replaceWithPhoneme(currentWord, /x/g, [Phonemes.C_K, Phonemes.C_S]);
      currentWord = this.replaceWithPhoneme(currentWord, /y/g, [Phonemes.C_Y]);
      currentWord = this.replaceWithPhoneme(currentWord, /z/g, [Phonemes.C_S]);  // latinoamérica

      // Puntuación
      currentWord = this.replaceWithPhoneme(currentWord, /\./g, [Phonemes.PUNC_PERIOD]);
      currentWord = this.replaceWithPhoneme(currentWord, /,/g, [Phonemes.PUNC_COMMA]);
      currentWord = this.replaceWithPhoneme(currentWord, /;/g, [Phonemes.PUNC_COMMA]);
      currentWord = this.replaceWithPhoneme(currentWord, /\?/g, [Phonemes.PUNC_QUESTION]);
      currentWord = this.replaceWithPhoneme(currentWord, /!/g, [Phonemes.PUNC_EXCLAIM]);
    }
    return currentWord;
  }

  replaceWithPhoneme(word, letters, phonemeIds) {
    const replacement = phonemeIds.map(id => `[${id}]`).join('');
    return word.replace(letters, replacement);
  }
}

// ==================== SOUND CONVERTER ====================
class SoundConverter {
  constructor(voicePath = 'voices/') {
    this.voicePath = voicePath;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.phonemeBuffers = {}; // Cache para buffers de audio
  }

  async loadPhonemeSounds() {
    // Precarga todos los sonidos de fonemas
    const phonemeValues = Object.values(Phonemes);
    for (const phoneme of phonemeValues) {
      await this.loadSound(phoneme);
    }
  }

  async loadSound(phoneme) {
    if (this.phonemeBuffers[phoneme]) return;

    const fname = `${phoneme.toString().padStart(2, '0')}.wav`;
    const url = this.voicePath + fname;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.phonemeBuffers[phoneme] = audioBuffer;
    } catch (error) {
      console.error(`Error loading phoneme ${phoneme}:`, error);
      throw error;
    }
  }

  async phonemesToSounds(phonemeList) {
    // Crea un buffer de audio concatenado
    const totalLength = phonemeList.reduce((sum, phoneme) => {
      return sum + (this.phonemeBuffers[phoneme]?.length || 0);
    }, 0);

    const outputBuffer = this.audioContext.createBuffer(
      1, // Mono
      totalLength,
      this.audioContext.sampleRate
    );

    let offset = 0;
    for (const phoneme of phonemeList) {
      const buffer = this.phonemeBuffers[phoneme];
      if (!buffer) {
        console.warn(`Phoneme ${phoneme} not loaded, skipping`);
        continue;
      }

      const channelData = outputBuffer.getChannelData(0);
      const sourceData = buffer.getChannelData(0);
      channelData.set(sourceData, offset);
      offset += sourceData.length;
    }

    return outputBuffer;
  }

  async playPhonemes(phonemeList) {
    const buffer = await this.phonemesToSounds(phonemeList);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
    return source;
  }
}

// ==================== MAIN TTS CLASS ====================
export default class TextToSpeech {
  constructor(options = {}) {
    this.options = {
      voicePath: 'voices/',
      pronunciationCSV: 'data/pronunciation.csv',
      usePronunciationDict: true,
      debug: false,
      ...options
    };

    this.phonemeConverter = new PhonemeConverter();
    this.soundConverter = new SoundConverter(this.options.voicePath);
    this.pronunciationDict = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    if (this.options.usePronunciationDict) {
      this.pronunciationDict = await TTSUtils.loadPronunciationDict(this.options.pronunciationCSV);
      this.phonemeConverter = new PhonemeConverter(true, this.pronunciationDict);
    }
    
    await this.soundConverter.loadPhonemeSounds();
    this.initialized = true;
  }

  async textToSpeech(text, outputCallback) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.options.debug) console.log("Text to Speech Generation started.");

    const words = TTSUtils.tokenize(text);
    if (this.options.debug) console.log("Words list:", words);

    const phonemes = await this.phonemeConverter.wordsToPhonemes(words);
    if (this.options.debug) console.log("Phonemes list:", phonemes);

    const audioBuffer = await this.soundConverter.phonemesToSounds(phonemes);
    
    if (outputCallback) {
      outputCallback(audioBuffer);
    } else {
      return this.soundConverter.playPhonemes(phonemes);
    }
  }
}

// Uso básico:
// const tts = new TextToSpeech({ debug: true });
// tts.textToSpeech("Hola mundo").then(source => {
//   source.onended = () => console.log("Reproducción completada");
// });