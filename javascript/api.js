// api.js — Simple Drag & Drop (desktop + mobile) — no jQuery needed

document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");

  draggables.forEach(el => {
    let offsetX = 0, offsetY = 0, isDragging = false;

    el.style.touchAction = "none"; // Prevent scroll on touch drag

    el.addEventListener("pointerdown", startDrag);

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      el.setPointerCapture(e.pointerId);
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      el.style.zIndex = 1000;
      el.style.cursor = "grabbing";

      document.addEventListener("pointermove", onDrag);
      document.addEventListener("pointerup", stopDrag);
    }

    function onDrag(e) {
      if (!isDragging) return;
      e.preventDefault();
      el.style.position = "absolute";
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }

    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = "grab";
      el.style.zIndex = "";
      document.removeEventListener("pointermove", onDrag);
      document.removeEventListener("pointerup", stopDrag);
    }
  });
});
