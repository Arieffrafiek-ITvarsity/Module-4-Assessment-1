// api.js — Modern Drag & Drop (desktop + mobile) — no jQuery needed

document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");
  const dropzones = document.querySelectorAll(".dropzone");

  draggables.forEach(el => {
    let offsetX = 0, offsetY = 0, isDragging = false, currentDropZone = null;
    let originalParent = null;
    let originalPosition = { x: 0, y: 0 };

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

      // Save original position and parent
      originalParent = el.parentElement;
      originalPosition = { x: el.offsetLeft, y: el.offsetTop };

      document.addEventListener("pointermove", onDrag);
      document.addEventListener("pointerup", stopDrag);
    }

    function onDrag(e) {
      if (!isDragging) return;
      e.preventDefault();

      el.style.position = "absolute";
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;

      // Check for active dropzone
      const draggedRect = el.getBoundingClientRect();
      let foundDropZone = null;

      dropzones.forEach(zone => {
        const zoneRect = zone.getBoundingClientRect();
        const overlap =
          draggedRect.right > zoneRect.left &&
          draggedRect.left < zoneRect.right &&
          draggedRect.bottom > zoneRect.top &&
          draggedRect.top < zoneRect.bottom;

        if (overlap) foundDropZone = zone;
        zone.classList.toggle("highlight", overlap);
      });

      currentDropZone = foundDropZone;
    }

    function stopDrag() {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = "grab";
      el.style.zIndex = "";

      if (currentDropZone) {
        // Snap into dropzone
        currentDropZone.appendChild(el);
        currentDropZone.classList.remove("highlight");
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.position = "relative";
      } else {
        // Snap back to original position
        el.style.transition = "all 0.2s ease";
        el.style.left = `${originalPosition.x}px`;
        el.style.top = `${originalPosition.y}px`;
        setTimeout(() => {
          el.style.transition = "";
        }, 200);
      }

      dropzones.forEach(zone => zone.classList.remove("highlight"));
      document.removeEventListener("pointermove", onDrag);
      document.removeEventListener("pointerup", stopDrag);
    }
  });
});
