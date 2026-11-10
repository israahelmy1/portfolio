const data = window.portfolioData;

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#primary-navigation");
const currentYear = document.querySelector("#current-year");
const skillsGrid = document.querySelector("#skills-grid");
const projectsGrid = document.querySelector("#projects-grid");
const contactForm = document.querySelector("#contact-form");
const formError = document.querySelector("#form-error");

function renderPersonalInfo() {
  document.querySelectorAll("[data-personal]").forEach((element) => {
    const key = element.dataset.personal;
    if (data[key]) element.textContent = data[key];
  });

  const initials = document.querySelector("[data-initials]");
  if (initials) {
    initials.textContent = data.initials || data.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
  }

  const emailLink = document.querySelector("[data-email-link]");
  if (emailLink) {
    emailLink.href = `mailto:${data.email}`;
    const emailText = emailLink.querySelector("[data-personal='email']");
    if (emailText) emailText.textContent = data.email;
  }
}

function renderSocialLinks() {
  document.querySelectorAll("[data-social-links]").forEach((container) => {
    data.socials.forEach(({ label, url }) => {
      if (!url) return;
      const link = document.createElement("a");
      link.className = "social-link";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = label;
      container.append(link);
    });
  });
}

function renderSkills() {
  if (!skillsGrid) return;
  skillsGrid.replaceChildren(...data.skills.map(({ name, category, icon }) => {
    const card = document.createElement("article");
    card.className = "skill-card";

    const iconElement = document.createElement("span");
    iconElement.className = "skill-icon";
    iconElement.setAttribute("aria-hidden", "true");
    iconElement.textContent = icon;

    const details = document.createElement("span");
    const skillName = document.createElement("span");
    skillName.className = "skill-name";
    skillName.textContent = name;
    const skillCategory = document.createElement("span");
    skillCategory.className = "skill-category";
    skillCategory.textContent = category;
    details.append(skillName, skillCategory);
    card.append(iconElement, details);
    return card;
  }));
}

function createProjectLink(label, url) {
  const link = document.createElement("a");
  link.textContent = label;
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#contact";
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("aria-label", `${label} link not added yet`);
  }
  return link;
}

function renderProjects() {
  if (!projectsGrid) return;
  projectsGrid.replaceChildren(...data.projects.map((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const art = document.createElement("div");
    art.className = "project-art";
    art.setAttribute("aria-hidden", "true");
    art.innerHTML = '<div class="project-window"><div class="window-bar"><i></i><i></i><i></i></div><div class="window-content"><span></span><span></span><b>DESIGN / BUILD</b></div></div>';

    const content = document.createElement("div");
    content.className = "project-content";
    const meta = document.createElement("div");
    meta.className = "project-meta";
    meta.textContent = project.type;

    const title = document.createElement("h3");
    title.textContent = project.title;
    const description = document.createElement("p");
    description.textContent = project.description;
    const tags = document.createElement("ul");
    tags.className = "tag-list";
    project.tags.forEach((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      tags.append(item);
    });

    const links = document.createElement("div");
    links.className = "project-links";
    links.append(createProjectLink("Live preview ↗", project.demoUrl), createProjectLink("GitHub ↗", project.repoUrl));
    content.append(meta, title, description, tags, links);
    card.append(art, content);
    return card;
  }));
}

if (currentYear) currentYear.textContent = new Date().getFullYear();

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("is-open", !expanded);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("is-open");
    });
  });
}

if (contactForm && formError) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.textContent = "";
    contactForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));

    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();
    let invalidField = null;

    if (!name || !email || !message) {
      formError.textContent = "Please complete all fields before sending.";
      invalidField = [contactForm.elements.name, contactForm.elements.email, contactForm.elements.message]
        .find((field) => !field.value.trim());
    } else if (!contactForm.elements.email.validity.valid) {
      formError.textContent = "Please enter a valid email address.";
      invalidField = contactForm.elements.email;
    }

    if (invalidField) {
      invalidField.setAttribute("aria-invalid", "true");
      invalidField.focus();
      return;
    }

    window.alert(`Thanks, ${name}! Your message passed the demo validation. This form is not connected to a mail service, so your message was not sent.`);
    contactForm.reset();
  });
}

renderPersonalInfo();
renderSocialLinks();
renderSkills();
renderProjects();
