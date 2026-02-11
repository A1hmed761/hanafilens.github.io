/* ------------------------------
   Compute Dynamic Presets
------------------------------ */
function computeDynamicPresets() {
  // Base preset (4)
  const base = {
    gridMin: 300,
    gap: 40,
    emoji: 120,
    width: 300,
    height: 220,
    radius: 12,
    capPad: 20,
    capFont: 2,
    capRadius: 12,

    // NEW FONT & SPACING VALUES
    fontBase: 1,               // rem
    fontPlural: 1.7,             // rem
    fontLabel: 1.3,            // em
    fontSmall: 0.825,          // rem

    pluralMarginBottom: 30,
    pluralPaddingBottom: 15,
    pluralBorderWidth: 3,
    sentenceMarginTop: 4
  };

  const deviceWidth = window.innerWidth;

  // Read actual padding (even when changed by media queries)
  const bodyStyle = window.getComputedStyle(document.body);
  const bodyPadding = parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);

  // Autofill columns using preset 4
  let baseCols = Math.floor((deviceWidth - bodyPadding + base.gap) / base.gridMin);
  if (baseCols < 1) baseCols = 1;

  function makePreset(extraCards) {
    const newCols = baseCols + extraCards;

    // Total gap width
    const totalGap = base.gap * (newCols - 1);

    // New card width
    const newGridMin = (deviceWidth - bodyPadding - totalGap) / newCols;

    const factor = newGridMin / base.gridMin;

    return {
      gridMin: newGridMin + "px",
      gap: (base.gap * factor) + "px",
      emoji: (base.emoji * factor) + "px",
      width: newGridMin + "px",
      height: (base.height * factor) + "px",
      radius: (base.radius * factor) + "px",
      capPad: (base.capPad * factor) + "px",
      capFont: (base.capFont * factor) + "rem",
      capRadius: (base.capRadius * factor) + "px",

      // NEW DYNAMIC VALUES
      fontBase: (base.fontBase * factor) + "rem",
      fontPlural: (base.fontPlural * factor) + "rem",
      fontLabel: (base.fontLabel * factor) + "em", 
      fontSmall: (base.fontSmall * factor) + "rem",

      pluralMarginBottom: (base.pluralMarginBottom * factor) + "px",
      pluralPaddingBottom: (base.pluralPaddingBottom * factor) + "px",
      pluralBorderWidth: (base.pluralBorderWidth * factor) + "px",
      sentenceMarginTop: (base.sentenceMarginTop * factor) + "px"
    };
  }

  return {
    4: {
      gridMin: base.gridMin + "px",
      gap: base.gap + "px",
      emoji: base.emoji + "px",
      width: base.width + "px",
      height: base.height + "px",
      radius: base.radius + "px",
      capPad: base.capPad + "px",
      capFont: base.capFont + "rem",
      capRadius: base.capRadius + "px",

      fontBase: base.fontBase + "rem",
      fontPlural: base.fontPlural + "rem",
      fontLabel: base.fontLabel + "em",
      fontSmall: base.fontSmall + "rem",

      pluralMarginBottom: base.pluralMarginBottom + "px",
      pluralPaddingBottom: base.pluralPaddingBottom + "px",
      pluralBorderWidth: base.pluralBorderWidth + "px",
      sentenceMarginTop: base.sentenceMarginTop + "px"
    },
    5: makePreset(1),
    6: makePreset(2)
  };
}


/* ------------------------------
   Update Back Height
------------------------------ */
function updateBackHeight() {
  const sampleFront = document.querySelector(".card .front");
  if (!sampleFront) return;

  const emojiHeight = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--card-height")
  );

  const captionHeight = sampleFront.offsetHeight;

  const total = emojiHeight + captionHeight;

  document.documentElement.style.setProperty("--back-height", total + "px");
}


/* ------------------------------
   Row Selector Change
------------------------------ */
let presets = computeDynamicPresets();

const rowSelector = document.getElementById("rowSelector");

rowSelector.addEventListener("change", () => {
  presets = computeDynamicPresets();

  // Reset all flipped cards when row changes
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("show-back", "flipping");
  });

  const p = presets[rowSelector.value];
  const r = document.documentElement.style;

  r.setProperty("--grid-min", p.gridMin);
  r.setProperty("--gap", p.gap);
  r.setProperty("--emoji-size", p.emoji);
  r.setProperty("--card-width", p.width);
  r.setProperty("--card-height", p.height);
  r.setProperty("--radius", p.radius);
  r.setProperty("--caption-padding", p.capPad);
  r.setProperty("--caption-font", p.capFont);
  r.setProperty("--caption-radius", p.capRadius);

  r.setProperty("--font-base", p.fontBase);
  r.setProperty("--font-plural", p.fontPlural);
  r.setProperty("--font-label", p.fontLabel);
  r.setProperty("--font-small", p.fontSmall);

  r.setProperty("--plural-margin-bottom", p.pluralMarginBottom);
  r.setProperty("--plural-padding-bottom", p.pluralPaddingBottom);
  r.setProperty("--plural-border-width", p.pluralBorderWidth);
  r.setProperty("--sentence-margin-top", p.sentenceMarginTop);

  updateBackHeight(); // Update back after rows change
});


/* Update back height on first load */
window.addEventListener("load", updateBackHeight);


/* ------------------------------
   Sidebar Toggle
------------------------------ */
document.getElementById('toggleSidebar').onclick = () => {
  const sidebar = document.getElementById('sidebar');
  const open = sidebar.classList.toggle('open');
  sidebar.setAttribute('aria-hidden', (!open).toString());
};



/* ============================================================

   CLICK-TO-FLIP SYSTEM (FRONT ↔ BACK)

   ============================================================ */

document.querySelectorAll(".card").forEach(card => {



  card.addEventListener("click", function(e) {

    // Only flip when clicking image/emoji/caption

    if (

      e.target.classList.contains("emoji") ||

      e.target.classList.contains("emoji-alt") ||

      e.target.classList.contains("thumb") ||

      e.target.classList.contains("thumb-alt") ||

      e.target.tagName === "FIGCAPTION"

    ) {

      this.classList.toggle("show-back");

    }

  });



});

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    // Start fake flip
    card.classList.add("flipping");

    // Wait half animation, then swap faces
    setTimeout(() => {
      card.classList.toggle("show-back");
    }, 200);

    // Finish animation by expanding back
    setTimeout(() => {
      card.classList.remove("flipping");
    }, 400);
  });
});

// Helper function to swap button text
function swapButtons(mainBtn, subBtn) {
  let mainText = mainBtn.innerText.replace("▾", "").trim();
  let subText = subBtn.innerText.trim();

  // Swap values
  mainBtn.innerHTML = `${subText} <span class="arrow">▾</span>`;
  subBtn.innerText = mainText;
}

// Dropdown opening only
document.querySelectorAll('.main-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
  });
});

// Urdu <-> English
document.getElementById('btn-urd-sub').addEventListener('click', () => {
  document.body.classList.toggle('show-urd');

  let main = document.getElementById('btn-urd-main');
  let sub  = document.getElementById('btn-urd-sub');

  swapButtons(main, sub);

  main.classList.remove('open');  // close dropdown
});

// Arabic <-> Persian
document.getElementById('btn-ar-sub').addEventListener('click', () => {
  document.body.classList.toggle('show-per');

  let main = document.getElementById('btn-ar-main');
  let sub  = document.getElementById('btn-ar-sub');

  swapButtons(main, sub);

  main.classList.remove('open'); // close dropdown
});

// Select all buttons
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
