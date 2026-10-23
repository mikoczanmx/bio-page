const audio = document.getElementById("bg-audio");
const playPauseBtn = document.getElementById("play-pause-btn");
const playIcon = playPauseBtn.querySelector("i");
const enterOverlay = document.getElementById("enter-overlay");

audio.volume = 0.25;

function updateIcon() {
  if (audio.paused) {
    playIcon.className = "fa-solid fa-play";
  } else {
    playIcon.className = "fa-solid fa-pause";
  }
}

// Kliknięcie w nakładkę odblokowuje dźwięk w przeglądarce i odsłania profil
enterOverlay.addEventListener("click", () => {
  audio
    .play()
    .then(() => {
      updateIcon();
      enterOverlay.classList.add("hidden");
    })
    .catch((err) => {
      console.error("Błąd odtwarzania:", err);
      enterOverlay.classList.add("hidden");
    });
});

// Dedykowany przycisk play/pause na dole
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", updateIcon);
audio.addEventListener("pause", updateIcon);

// Blokada prawego przycisku myszy
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// 1. Funkcja aktualizująca ikonkę w Twoim przycisku
function updateModeIcon(mode) {
  const icon =
    document.querySelector(".modeIcon") || document.querySelector(".modeBtn i");
  if (!icon) return;

  if (mode === "light") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-lightbulb");
  } else {
    icon.classList.remove("fa-lightbulb");
    icon.classList.add("fa-moon");
  }
}

// 2. Funkcja aplikująca motyw (zmienia data-mode, zapisuje w localStorage i aktualizuje ikonę)
function setMode(mode) {
  document.body.setAttribute("data-mode", mode);
  localStorage.setItem("theme-mode", mode);
  updateModeIcon(mode);
}

// 3. Główna funkcja wywoływana przez onclick="changeMode()" w Twoim HTML
function changeMode() {
  const currentMode = document.body.getAttribute("data-mode");
  // Jeśli jest "dark" -> przełącz na "light", w przeciwnym razie na "dark"
  const newMode = currentMode === "dark" ? "light" : "dark";
  setMode(newMode);
}

// 4. Inicjalizacja przy starcie strony (localStorage -> preferencje Windowsa -> domyślny ciemny)
function initTheme() {
  const savedMode = localStorage.getItem("theme-mode");

  if (savedMode) {
    // Krok 1: Sprawdź, czy użytkownik ma zapisany wybór w localStorage
    setMode(savedMode);
  } else {
    // Krok 2: Fallback - preferencje systemowe Windowsa
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) {
      setMode("light");
    } else {
      // Krok 3: Domyślny tryb ciemny
      setMode("dark");
    }
  }
}

// Uruchomienie od razu po załadowaniu struktury strony
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
let toastTimeout;

// Funkcja pokazująca powiadomienie
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const toastText = toast.querySelector("span");
  if (toastText) {
    toastText.textContent = message;
  }

  toast.classList.add("show");

  // Jeśli kliknięto ponownie, resetujemy licznik czasu
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Obsługa kliknięcia w dowolny element z atrybutem data-copy
document.addEventListener("click", function (e) {
  const copyBtn = e.target.closest("[data-copy]");
  if (!copyBtn) return;

  e.preventDefault();
  const textToCopy = copyBtn.getAttribute("data-copy");

  // Kopiowanie do schowka (nowoczesne API + fallback dla starszych przeglądarek)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showToast(`Skopiowano: ${textToCopy}`);
      })
      .catch(() => {
        fallbackCopy(textToCopy);
      });
  } else {
    fallbackCopy(textToCopy);
  }
});

// Zapasowa metoda kopiowania (gdyby przeglądarka blokowała clipboard)
function fallbackCopy(text) {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  tempInput.style.position = "fixed";
  tempInput.style.opacity = "0";
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand("copy");
    showToast(`Skopiowano: ${text}`);
  } catch (err) {
    console.error("Błąd kopiowania:", err);
  }
  document.body.removeChild(tempInput);
}
// ===================================================
// OBSŁUGA EFEKTU SPOTLIGHT
// ===================================================
const spotlight = document.querySelector(".spotlight");

if (spotlight) {
  let mouseX = -1000;
  let mouseY = -1000;
  let isTicking = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!document.body.classList.contains("has-mouse")) {
      document.body.classList.add("has-mouse");
    }

    // Płynna aktualizacja pozycji w rytmie odświeżania ekranu (60/144Hz)
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        spotlight.style.setProperty("--mouse-x", `${mouseX}px`);
        spotlight.style.setProperty("--mouse-y", `${mouseY}px`);
        isTicking = false;
      });
      isTicking = true;
    }
  });

  // Ukryj poświatę, gdy kursor opuści okno przeglądarki
  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("has-mouse");
  });
}
