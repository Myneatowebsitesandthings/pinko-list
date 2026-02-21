// Toggle the collapse functionality
const collapseBtn = document.getElementById("collapse-btn");
const leftFrame = document.getElementById("left-frame");

collapseBtn.addEventListener("click", () => {
  leftFrame.classList.toggle("collapsed");
  collapseBtn.textContent = leftFrame.classList.contains("collapsed") ? "=>" : "<=";
});

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("left-frame");
  const mobileToggle = document.getElementById("mobile-toggle");

  if (sidebar && mobileToggle) {
    // Start closed on mobile
    sidebar.classList.remove("mobile-open");

    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }
});