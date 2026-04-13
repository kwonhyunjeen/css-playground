const FAB_ITEMS = [
  {
    label: "Write Journal",
    svg: '<path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />',
  },
  {
    label: "Capture Moment",
    svg: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />',
  },
  {
    label: "Voice Note",
    svg: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
  },
  {
    label: "Location Tag",
    svg: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
  },
];

const wrapper = document.getElementById("fab-wrapper");
const fabBtn = wrapper.querySelector(".fab-btn");

FAB_ITEMS.forEach(({ label, svg }) => {
  const item = document.createElement("div");
  item.className = "fab-item";
  item.innerHTML = `
    <span class="item-label">${label}</span>
    <div class="item-circle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        ${svg}
      </svg>
    </div>`;
  wrapper.insertBefore(item, fabBtn);
});
