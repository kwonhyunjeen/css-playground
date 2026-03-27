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
