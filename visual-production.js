// Visual Production — character introductions and prompt-workspace UI shell.

window.addEventListener("load", () => {
  const stage = document.querySelector(".visual-production-stage");
  const dialogue = document.querySelector(".production-dialogue");
  const dialogueTitle = document.querySelector(".production-dialogue-title");
  const dialogueText = document.querySelector(".production-dialogue-text");
  const characterButtons = [...document.querySelectorAll(".forest-character")];
  const workspace = document.querySelector(".prompt-workspace");
  const workspaceAvatar = document.querySelector(".workspace-avatar");
  const workspaceTitle = document.querySelector(".workspace-title");
  const workspaceRole = document.querySelector(".workspace-role");
  const workspaceStatus = document.querySelector(".workspace-status");
  const libraryBack = document.querySelector(".workspace-back");
  const libraryLocationTitle = document.querySelector(".workspace-location-title");
  const libraryLocationPath = document.querySelector(".workspace-location-path");
  const libraryView = document.querySelector(".workspace-prompt-list");
  const bookController = document.querySelector(".workspace-book-controller");
  const bookControllerImage = bookController?.querySelector("img");

  if (
    !stage || !dialogue || !dialogueTitle || !dialogueText ||
    characterButtons.length !== 4 || !workspace || !workspaceAvatar ||
    !workspaceTitle || !workspaceRole || !workspaceStatus ||
    !libraryBack || !libraryLocationTitle || !libraryLocationPath || !libraryView ||
    !bookController || !bookControllerImage
  ) {
    return;
  }

  const characters = {
    tuki: {
      name: "Tuki",
      role: "Narrative & Motif Designer",
      introduction: "I’m Tuki. I turn ideas, intentions, and stories into clear visual motifs for Lasu to create.",
      avatar: "assets/visual/Tuki_01.svg",
      folder: "prompt_library/Tuki🦜/library/"
    },
    piko: {
      name: "Piko",
      role: "Visual–Machine Translator",
      introduction: "I’m Piko. I translate images and visual ideas into structured JSON and vector forms that machines can understand.",
      avatar: "assets/visual/Piko_05.svg",
      folder: "prompt_library/Piko🐦/library/"
    },
    mako: {
      name: "Mako",
      role: "Motion Designer",
      introduction: "I’m Mako. I study characters, objects, and scenes and work out how they can move naturally and meaningfully.",
      avatar: "assets/visual/Mako_01.svg",
      folder: "prompt_library/Mako🦤/library/"
    },
    lasu: {
      name: "Lasu",
      role: "Visual Artist & Designer",
      introduction: "I’m Lasu. I turn visual motifs and creative requirements into coherent images and designs.",
      avatar: "assets/visual/Lasu_01.svg",
      folder: "prompt_library/Lasu🦩/library/"
    }
  };

  // UI-only demo hierarchy. No prompt-library files are read in this phase.
  const createDemoLibrary = () => ({
    type: "root",
    title: "Prompt Library",
    items: [
      {
        type: "prompt",
        title: "Standalone Prompt",
        label: "Single prompt",
        copyText: "Placeholder standalone prompt text."
      },
      {
        type: "folder",
        kind: "family",
        title: "Mother Prompt Family",
        subtitle: "2 related prompts · 2 projects",
        items: [
          {
            type: "prompt",
            title: "Variation 01",
            label: "Mother prompt family",
            copyText: "Placeholder mother-prompt variation 01."
          },
          {
            type: "prompt",
            title: "Variation 02",
            label: "Mother prompt family",
            copyText: "Placeholder mother-prompt variation 02."
          },
          {
            type: "folder",
            kind: "project",
            title: "Forest Animation",
            subtitle: "3 prompts",
            items: [
              { type: "prompt", title: "Scene 01", label: "Forest Animation", copyText: "Placeholder Forest Animation scene 01." },
              { type: "prompt", title: "Scene 02", label: "Forest Animation", copyText: "Placeholder Forest Animation scene 02." },
              { type: "prompt", title: "Scene 03", label: "Forest Animation", copyText: "Placeholder Forest Animation scene 03." }
            ]
          },
          {
            type: "folder",
            kind: "project",
            title: "Greenhouse Story",
            subtitle: "2 prompts",
            items: [
              { type: "prompt", title: "Opening Scene", label: "Greenhouse Story", copyText: "Placeholder Greenhouse Story opening scene." },
              { type: "prompt", title: "Closing Scene", label: "Greenhouse Story", copyText: "Placeholder Greenhouse Story closing scene." }
            ]
          }
        ]
      }
    ]
  });

  const hasDesktopHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let activeCharacterKey = "tuki";
  let libraryStack = [];
  let reactionTimer;

  const characterTitle = (character) => `${character.name} — ${character.role}`;

  const showDialogue = (character) => {
    if (workspace.classList.contains("is-open")) {
      return;
    }

    dialogue.classList.remove("is-visible");
    dialogueTitle.textContent = characterTitle(character);
    dialogueText.textContent = character.introduction;
    window.requestAnimationFrame(() => dialogue.classList.add("is-visible"));
  };

  const hideDialogue = () => dialogue.classList.remove("is-visible");

  const reactAvatar = (reactionClass) => {
    window.clearTimeout(reactionTimer);
    workspaceAvatar.classList.remove("avatar-open", "avatar-copy", "avatar-close", "avatar-react");
    void workspaceAvatar.offsetWidth;
    workspaceAvatar.classList.add(reactionClass);
    reactionTimer = window.setTimeout(() => workspaceAvatar.classList.remove(reactionClass), 450);
  };

  const createPromptCard = (item) => {
    const card = document.createElement("article");
    card.className = "workspace-prompt-card";

    const details = document.createElement("div");
    const label = document.createElement("span");
    const title = document.createElement("h2");
    const copyButton = document.createElement("button");

    label.className = "workspace-item-label";
    label.textContent = item.label || "Prompt";
    title.textContent = item.title;
    copyButton.type = "button";
    copyButton.className = "prompt-copy";
    copyButton.dataset.copy = item.copyText;
    copyButton.textContent = "Copy";

    details.append(label, title);
    card.append(details, copyButton);
    return card;
  };

  const createFolderCard = (item, index) => {
    const button = document.createElement("button");
    const heading = document.createElement("span");
    const kind = document.createElement("span");
    const title = document.createElement("strong");
    const subtitle = document.createElement("span");
    const action = document.createElement("span");

    button.type = "button";
    button.className = "workspace-folder-card";
    button.dataset.folderIndex = index;
    kind.className = "workspace-item-label";
    kind.textContent = item.kind === "project" ? "Project folder" : "Prompt family";
    title.textContent = item.title;
    subtitle.className = "workspace-folder-subtitle";
    subtitle.textContent = item.subtitle;
    action.className = "workspace-folder-action";
    action.textContent = "Open →";

    heading.append(kind, title, subtitle);
    button.append(heading, action);
    return button;
  };

  const renderLibrary = ({ focusHeading = false } = {}) => {
    const character = characters[activeCharacterKey];
    const currentFolder = libraryStack[libraryStack.length - 1];
    const path = libraryStack.slice(1).map((item) => item.title);

    libraryBack.hidden = libraryStack.length === 1;
    libraryLocationTitle.textContent = currentFolder.title;
    libraryLocationPath.textContent = [character.name, "Visual Production", ...path].join(" → ");
    libraryView.replaceChildren(...currentFolder.items.map((item, index) => (
      item.type === "folder" ? createFolderCard(item, index) : createPromptCard(item)
    )));
    workspaceStatus.textContent = "Demo library structure — real prompt loading is not connected yet.";

    if (focusHeading) {
      libraryLocationTitle.focus({ preventScroll: true });
    }
  };

  const resetLibrary = () => {
    libraryStack = [createDemoLibrary()];
    renderLibrary();
  };

  const updateWorkspace = () => {
    const character = characters[activeCharacterKey];
    workspaceAvatar.src = character.avatar;
    workspaceAvatar.alt = character.name;
    workspaceTitle.textContent = character.name;
    workspaceRole.textContent = `${character.role} / Prompt Workspace`;
    workspace.dataset.folder = character.folder;
    bookController.setAttribute("aria-label", `Close ${character.name}’s prompt workspace`);
    resetLibrary();
  };

  const openWorkspace = () => {
    updateWorkspace();
    hideDialogue();
    workspace.removeAttribute("inert");
    workspace.setAttribute("aria-hidden", "false");
    workspace.classList.add("is-open");
    bookController.classList.add("is-open");
    bookController.setAttribute("aria-expanded", "true");
    bookController.title = "Close prompt workspace";
    bookControllerImage.src = "assets/visual/promptStudio_books_04.svg";
    reactAvatar("avatar-open");
  };

  const closeWorkspace = () => {
    const character = characters[activeCharacterKey];
    reactAvatar("avatar-close");
    workspace.classList.remove("is-open");
    workspace.setAttribute("aria-hidden", "true");
    workspace.setAttribute("inert", "");
    bookController.classList.remove("is-open");
    bookController.setAttribute("aria-expanded", "false");
    bookController.setAttribute("aria-label", `Open ${character.name}’s prompt workspace`);
    bookController.title = "Open prompt workspace";
    bookControllerImage.src = "assets/visual/promptStudio_books_01.svg";
    bookController.focus({ preventScroll: true });
  };

  characterButtons.forEach((button) => {
    const characterKey = button.dataset.character;
    const character = characters[characterKey];

    button.addEventListener("animationend", () => button.classList.add("is-ready"), { once: true });
    button.addEventListener("mouseenter", () => {
      if (hasDesktopHover.matches && character) showDialogue(character);
    });
    button.addEventListener("mouseleave", () => {
      if (hasDesktopHover.matches) hideDialogue();
    });
    button.addEventListener("focus", () => {
      if (character) showDialogue(character);
    });
    button.addEventListener("blur", hideDialogue);
    button.addEventListener("click", () => {
      if (!character) return;
      activeCharacterKey = characterKey;
      openWorkspace();
    });
  });

  bookController.addEventListener("click", () => {
    if (workspace.classList.contains("is-open")) closeWorkspace();
    else openWorkspace();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && workspace.classList.contains("is-open")) closeWorkspace();
  });

  libraryBack.addEventListener("click", () => {
    if (libraryStack.length <= 1) return;
    libraryStack.pop();
    renderLibrary({ focusHeading: true });
  });

  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.append(temporaryInput);
    temporaryInput.select();
    if (!document.execCommand("copy")) {
      temporaryInput.remove();
      throw new Error("Copy command was unavailable");
    }
    temporaryInput.remove();
  };

  libraryView.addEventListener("click", async (event) => {
    const folderButton = event.target.closest(".workspace-folder-card");

    if (folderButton) {
      const currentFolder = libraryStack[libraryStack.length - 1];
      const nextFolder = currentFolder.items[Number(folderButton.dataset.folderIndex)];

      if (nextFolder?.type === "folder") {
        libraryStack.push(nextFolder);
        renderLibrary({ focusHeading: true });
        reactAvatar("avatar-react");
      }
      return;
    }

    const button = event.target.closest(".prompt-copy");
    if (!button) return;

    try {
      await copyText(button.dataset.copy);
      button.textContent = "Copied";
      workspaceStatus.textContent = `${characters[activeCharacterKey].name} copied the placeholder prompt.`;
      reactAvatar("avatar-copy");
      window.setTimeout(() => { button.textContent = "Copy"; }, 1200);
    } catch (error) {
      button.textContent = "Try again";
      workspaceStatus.textContent = "Clipboard access was unavailable.";
      window.setTimeout(() => { button.textContent = "Copy"; }, 1600);
    }
  });

  const updateBookFollow = (event) => {
    const bounds = stage.getBoundingClientRect();
    const normalizedX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const normalizedY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    bookController.style.setProperty("--book-follow-x", `${(normalizedX - 0.5) * 20}px`);
    bookController.style.setProperty("--book-follow-y", `${(normalizedY - 0.5) * 16}px`);
  };

  stage.addEventListener("pointermove", updateBookFollow, { passive: true });
  stage.addEventListener("pointerleave", () => {
    bookController.style.setProperty("--book-follow-x", "0px");
    bookController.style.setProperty("--book-follow-y", "0px");
  });
});
