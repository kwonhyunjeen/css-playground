const ITEMS = [
  {
    title: "Realistic Glass Texture",
    content:
      "By utilizing a diagonal linear-gradient for the background and adding specific top and left edge highlights with border and inset box-shadow, we replicate the physical thickness and light refraction of a real pane of frosted glass.",
  },
  {
    title: "Surface Glare Effect",
    content:
      'The ::before pseudo-element casts a subtle, unclickable highlight across the top-left corner. This "glare" simulates environmental light bouncing off the smooth, reflective surface of the glass, adding an extra layer of depth.',
  },
  {
    title: "Dynamic Background Blur",
    content:
      "The background features more distinct color orbs. When the accordion expands, you can clearly see these background elements being dynamically blurred and color-saturated through the backdrop-filter property, proving it's not just a static transparent layer.",
  },
];

document.getElementById("accordion-list").innerHTML = ITEMS.map(
  ({ title, content }) => `
  <div class="accordion-item">
    <button class="accordion-header">
      ${title}
      <svg class="icon-svg"><use href="#icon-chevron"></use></svg>
    </button>
    <div class="accordion-collapse">
      <div class="accordion-content">${content}</div>
    </div>
  </div>`,
).join("");

const items = document.querySelectorAll(".accordion-item");
items.forEach((item) => {
  const header = item.querySelector(".accordion-header");
  const collapse = item.querySelector(".accordion-collapse");
  header.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");
    items.forEach((o) => {
      if (o !== item && o.classList.contains("is-active")) {
        o.classList.remove("is-active");
        o.querySelector(".accordion-collapse").style.height = "0px";
      }
    });
    if (!isActive) {
      item.classList.add("is-active");
      collapse.style.height = collapse.scrollHeight + "px";
    } else {
      item.classList.remove("is-active");
      collapse.style.height = "0px";
    }
  });
});
