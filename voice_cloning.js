import { Client } from 'https://esm.sh/@gradio/client';

document.getElementById("sintetizar").addEventListener("click", async () => {
  const fileInput = document.getElementById("audioInput");
  const refText = document.getElementById("refText").value;
  const genText = document.getElementById("genText").value;

  if (!fileInput.files.length) {
    alert("Por favor, selecciona un archivo de audio WAV.");
    return;
  }

  const audioFile = fileInput.files[0];

  try {
    const client = await Client.connect("jpgallegoar/Spanish-F5");

    const result = await client.predict("/infer", {
      ref_audio_orig: audioFile,
      ref_text: refText,
      gen_text: genText,
      model: "F5-TTS",
      remove_silence: false,
      cross_fade_duration: 0.15,
      speed: 1.0
    });

    const audioURL = result.data[0].url;
    const spectrogramURL = result.data[1].url;

    // Mostrar y reproducir audio
    const audioElement = document.getElementById("audioPlayer");
    audioElement.src = audioURL;
    audioElement.style.display = "block";
    //audioElement.play();

    // Mostrar espectrograma
    const imgElement = document.getElementById("spectrogram");
    imgElement.src = spectrogramURL;
    imgElement.style.display = "block";

  } catch (error) {
    console.error("Error al generar voz:", error);
  }
});
