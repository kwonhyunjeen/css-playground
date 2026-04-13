const NAV_ITEMS = [
  { type: "icon", icon: "home-outline", delay: "0.1s" },
  { type: "icon", icon: "person-outline", delay: "0.2s" },
  { type: "divider", delay: "0.1s" },
  { type: "icon", icon: "heart-outline", delay: "0.4s" },
  { type: "icon", icon: "notifications-outline", delay: "0.1s" },
];

document.getElementById("nav-list").innerHTML = NAV_ITEMS.map((item) =>
  item.type === "divider"
    ? `<li style="--i: ${item.delay}"><div class="divider"></div></li>`
    : `<li style="--i: ${item.delay}"><a href="#"><ion-icon name="${item.icon}"></ion-icon></a></li>`,
).join("");

let toggle = document.querySelector(".toggle");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
});
