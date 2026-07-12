/* ═══════════════════════════════════════════════
   НАСТРОЙКА
   После публикации Google Apps Script (см. README.md)
   вставьте сюда URL веб-приложения:
   ═══════════════════════════════════════════════ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLPPmpuAgoCNaqgCtDvxm9YdRQiOxkQT0ldJEGGqPXFgKko92gZrCb5qIFDuzPZR5j/exec"; 

const WEDDING_DATE = new Date("2026-08-26T16:00:00+03:00");

/* ── Таймер обратного отсчёта ── */
const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};

function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
  let diff = Math.max(0, WEDDING_DATE - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const mins = Math.floor(diff / 60000) % 60;
  const secs = Math.floor(diff / 1000) % 60;
  cd.days.textContent = days;
  cd.hours.textContent = pad(hours);
  cd.mins.textContent = pad(mins);
  cd.secs.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

/* ── Появление секций при прокрутке ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ── Поле «имя пары» показываем только при выборе «Приду с парой» ── */
const partnerField = document.getElementById("partner-field");
const partnerInput = document.getElementById("f-partner");
const syncPartnerField = () => {
  const checked = document.querySelector('input[name="attendance"]:checked');
  const open = !!checked && checked.value === "Приду с парой";
  partnerField.classList.toggle("open", open);
  partnerInput.disabled = !open;
  if (!open) partnerInput.value = "";
};
document.querySelectorAll('input[name="attendance"]').forEach((radio) => {
  radio.addEventListener("change", syncPartnerField);
});
// браузер мог восстановить выбор после обновления страницы
syncPartnerField();

/* ── Отправка формы ── */
const form = document.getElementById("rsvp-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const successEl = document.getElementById("rsvp-success");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.classList.remove("error");

  const name = form.name.value.trim();
  const attendance = form.querySelector('input[name="attendance"]:checked');

  if (!name) {
    showError("Пожалуйста, укажите имя и фамилию.");
    form.name.focus();
    return;
  }
  if (!attendance) {
    showError("Пожалуйста, отметьте, придёте ли вы.");
    return;
  }
  if (!SCRIPT_URL) {
    showError("Форма ещё не подключена. Напишите нам напрямую!");
    return;
  }

  const data = new FormData();
  data.append("name", name);
  data.append("attendance", attendance.value);
  data.append("partner", form.partner.value.trim());
  data.append("food", form.food.value.trim());
  data.append("comment", form.comment.value.trim());

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправляем…";

  try {
    await fetch(SCRIPT_URL, { method: "POST", body: data, mode: "no-cors" });
    form.hidden = true;
    successEl.hidden = false;
  } catch (err) {
    showError("Не получилось отправить. Проверьте интернет и попробуйте ещё раз.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить ответ";
  }
});

function showError(msg) {
  statusEl.textContent = msg;
  statusEl.classList.add("error");
}

/* ── Фоновая музыка ── */
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      music.volume = 0.65;
      await music.play();
      musicBtn.classList.add("playing");
      musicBtn.setAttribute("aria-pressed", "true");
      musicBtn.setAttribute("aria-label", "Выключить музыку");
    } catch (err) {
      /* браузер запретил воспроизведение — оставляем кнопку как есть */
    }
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.setAttribute("aria-pressed", "false");
    musicBtn.setAttribute("aria-label", "Включить музыку: Felicità");
  }
});
