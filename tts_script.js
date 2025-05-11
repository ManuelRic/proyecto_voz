// Get references to the sections (which contain both h3 and p)
const SC = document.getElementById('SC');
const SP = document.getElementById('SP');
const SN = document.getElementById('SN');

const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

function glitchEffect(spanEl, finalText, speed = 100) {
    let frame = 0;
    const scramble = setInterval(() => {
        let output = '';
        for (let i = 0; i < finalText.length; i++) {
            output += (i < frame) ? finalText[i] : glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        spanEl.textContent = output;
        frame++;
        if (frame > finalText.length) {
            clearInterval(scramble);
        }
    }, speed);
}

// Function to show one section and hide others, with glitch effect
function showOnly(showEl) {
    [SC, SP, SN].forEach(el => {
        el.style.display = (el === showEl) ? 'block' : 'none';
    });

    const glitchSpan = showEl.querySelector('.glitch-text');
    const finalText = glitchSpan.dataset.original || glitchSpan.textContent;

    if (!glitchSpan.dataset.original) {
        glitchSpan.dataset.original = finalText;
    }

    glitchEffect(glitchSpan, finalText);
}

// Add hover events to show sections
document.getElementById('mono1').addEventListener('mouseover', () => showOnly(SC));
document.getElementById('mono2').addEventListener('mouseover', () => showOnly(SP));
document.getElementById('humano').addEventListener('mouseover', () => showOnly(SN));

// ⬇️ NEW: Permanently hide cursor on first hover
const cursor = document.getElementById('cursor');
let cursorHidden = false;

['mono1', 'mono2', 'humano'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('mouseover', () => {
        if (!cursorHidden) {
            cursor.style.display = 'none';
            cursorHidden = true;
        }
    });
});


// __________________________

document.addEventListener("DOMContentLoaded", function () {
  const testButton = document.getElementById("test_button_p");

  // Redirect to the TTS page when the "¡Pruébalo!" button is clicked
  testButton.addEventListener("click", function() {
      window.location.href = "parametrica.html";  // Replace with the URL of your TTS page
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const testButton = document.getElementById("test_button_n");

  // Redirect to the TTS page when the "¡Pruébalo!" button is clicked
  testButton.addEventListener("click", function() {
      window.location.href = "neuronal.html";  // Replace with the URL of your TTS page
  });
});



const images = document.querySelectorAll('.ev_img');

images.forEach(img => {
img.addEventListener('mouseenter', () => {
    images.forEach(other => {
    if (other !== img) {
        other.classList.add('shrink');
        other.classList.remove('grow');
    } else {
        img.classList.add('grow');
    }
    });
});

img.addEventListener('mouseleave', () => {
    images.forEach(other => {
    other.classList.remove('shrink', 'grow');
    });
});
});
