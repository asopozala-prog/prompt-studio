// Silas Studio — welcome, book launch, introductions, and click interactions.

let entranceNavigationStarted = false;

window.addEventListener("load", () => {
  const studio = document.querySelector(".studio");
  const silas = document.querySelector(".silas");
  const welcome = document.querySelector(".welcome-box");
  const dialogue = document.querySelector(".book-dialogue");
  const dialogueTitle = document.querySelector(".book-dialogue-title");
  const dialogueText = document.querySelector(".book-dialogue-text");

  const book01 = document.querySelector(".book-01");
  const book02 = document.querySelector(".book-02");
  const book03 = document.querySelector(".book-03");

  if (
    !studio ||
    !silas ||
    !welcome ||
    !dialogue ||
    !dialogueTitle ||
    !dialogueText ||
    !book01 ||
    !book02 ||
    !book03
  ) {
    return;
  }

  const timers = [];
  let visitorInterrupted = false;
  let silasHovered = false;
  let silasFocused = false;
  let touchWelcomeOpen = false;
  const hasDesktopHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  const updateWelcome = () => {
    const isVisible = hasDesktopHover.matches
      ? silasHovered || silasFocused
      : touchWelcomeOpen;

    welcome.classList.toggle("is-visible", isVisible);
    silas.setAttribute("aria-expanded", String(isVisible));
  };

  silas.addEventListener("mouseenter", () => {
    if (hasDesktopHover.matches) {
      silasHovered = true;
      updateWelcome();
    }
  });

  silas.addEventListener("mouseleave", () => {
    if (hasDesktopHover.matches) {
      silasHovered = false;
      updateWelcome();
    }
  });

  silas.addEventListener("focus", () => {
    if (hasDesktopHover.matches) {
      silasFocused = true;
      updateWelcome();
    }
  });

  silas.addEventListener("blur", () => {
    silasFocused = false;
    updateWelcome();
  });

  silas.addEventListener("click", () => {
    if (!hasDesktopHover.matches) {
      touchWelcomeOpen = !touchWelcomeOpen;
      updateWelcome();
    }
  });

  silas.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !hasDesktopHover.matches) {
      event.preventDefault();
      touchWelcomeOpen = !touchWelcomeOpen;
      updateWelcome();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!hasDesktopHover.matches && touchWelcomeOpen && event.target !== silas) {
      touchWelcomeOpen = false;
      updateWelcome();
    }
  });

  const introductions = [
    {
      book: book01,
      className: "dialogue-01",
      title: "Visual Production",
      text: "I’m Visual Production. I turn ideas into images, structures, and motion."
    },
    {
      book: book02,
      className: "dialogue-02",
      title: "Research & Knowledge",
      text: "I’m Research & Knowledge. I gather what matters and help the house understand it."
    },
    {
      book: book03,
      className: "dialogue-03",
      title: "Business & Strategy",
      text: "I’m Business & Strategy. I turn complicated questions into clearer decisions and direction."
    }
  ];

  const clearDialogueClasses = () => {
    dialogue.classList.remove(
      "dialogue-01",
      "dialogue-02",
      "dialogue-03",
      "is-visible"
    );
  };

  const showDialogue = ({ className, title, text }) => {
    clearDialogueClasses();

    dialogueTitle.textContent = title;
    dialogueText.textContent = text;
    dialogue.classList.add(className);

    requestAnimationFrame(() => {
      dialogue.classList.add("is-visible");
    });
  };

  const hideDialogue = () => {
    dialogue.classList.remove("is-visible");
  };

  const stopAutomaticSequence = () => {
    visitorInterrupted = true;

    timers.forEach((timer) => {
      window.clearTimeout(timer);
    });

    hideDialogue();
  };

  const schedule = (callback, delay) => {
    const timer = window.setTimeout(() => {
      if (!visitorInterrupted) {
        callback();
      }
    }, delay);

    timers.push(timer);
  };

  // Books launch independently of the visitor-controlled Silas welcome.
  schedule(() => {
    studio.classList.add("books-launch");
  }, 800);

  // Books introduce themselves after all three launch animations complete.
  const firstStart = 4100;
  const visibleTime = 4000;
  const gap = 500;
  const step = visibleTime + gap;

  introductions.forEach((item, index) => {
    const start = firstStart + index * step;

    schedule(() => {
      showDialogue(item);
    }, start);

    schedule(() => {
      hideDialogue();
    }, start + visibleTime);
  });

  // Visitor interaction takes priority over the automatic sequence.

  book01.addEventListener("click", () => {
    if (entranceNavigationStarted) {
      return;
    }

    entranceNavigationStarted = true;
    stopAutomaticSequence();

    book01.src = "assets/visual/promptStudio_books_04.svg";
    book01.classList.add("is-open");

    showDialogue({
      className: "dialogue-01",
      title: "Visual Production",
      text: "Come in. This book is open for you. 🍄"
    });

    const link = document.createElement("a");
    link.href = "visual-production.html";
    link.target = "_blank";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      book01.src = "assets/visual/promptStudio_books_01.svg";
      book01.classList.remove("is-open");
      dialogue.classList.remove("is-visible");
      entranceNavigationStarted = false;
    }, 450);
  });

  book02.addEventListener("click", () => {
    stopAutomaticSequence();

    showDialogue({
      className: "dialogue-02",
      title: "Research & Knowledge",
      text: "I’m still private. 🍄"
    });
  });

  book03.addEventListener("click", () => {
    stopAutomaticSequence();

    showDialogue({
      className: "dialogue-03",
      title: "Business & Strategy",
      text: "I’m still private. 🍄"
    });
  });
});

// Restore the closed book if this page is revived from the browser's back-forward cache.
window.addEventListener("pageshow", () => {
  const book01 = document.querySelector(".book-01");
  const dialogue = document.querySelector(".book-dialogue");
  const silas = document.querySelector(".silas");
  const welcome = document.querySelector(".welcome-box");

  entranceNavigationStarted = false;

  if (book01) {
    book01.src = "assets/visual/promptStudio_books_01.svg";
    book01.classList.remove("is-open");
  }

  if (dialogue) {
    dialogue.classList.remove("is-visible");
  }

  if (welcome) {
    welcome.classList.remove("is-visible");
  }

  if (silas) {
    silas.setAttribute("aria-expanded", "false");
  }
});
