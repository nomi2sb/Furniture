// Image Data
const imageData = {
  sofas: Array.from({ length: 8 }, (_, i) => `images/sofas/sofa${i + 1}.jpg`),
  beds: Array.from({ length: 46 }, (_, i) => `images/beds/bed${i + 1}.jpg`),
  tables: Array.from({ length: 3 }, (_, i) => `images/tables/table${i + 1}.jpg`),
  almari: Array.from({ length: 5 }, (_, i) => `images/almari/almari${i + 1}.jpg`),
  showcase: Array.from({ length: 7 }, (_, i) => `images/showcase/showcase${i + 1}.jpg`),
};

const gallery = document.getElementById("gallery");
let allImages = [];

function renderGallery(category = "all") {
  gallery.innerHTML = "";
  allImages = [];

  Object.keys(imageData).forEach(cat => {
    if (category === "all" || cat === category) {
      allImages.push(...imageData[cat]);
    }
  });

  allImages.forEach((src, i) => {
    const div = document.createElement("div");
    div.className = "gallery-item aspect-[4/3]";
    div.innerHTML = `<img src="${src}" data-index="${i}" alt="Furniture">`;
    gallery.appendChild(div);
  });
}

renderGallery();

// Filter Buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGallery(btn.dataset.category);
  });
});

// Lightbox Setup
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbClose = document.getElementById("lbClose");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;
let zoomed = false;
let isDragging = false;
let startX, startY;

// Open Lightbox
gallery.addEventListener("click", e => {
  const img = e.target.closest("img");
  if (!img) return;
  currentIndex = parseInt(img.dataset.index);
  openLightbox(allImages[currentIndex]);
});

function openLightbox(src) {
  lbImage.src = src;
  lightbox.classList.remove("hidden");
  lbImage.style.transform = "scale(1)";
  lbImage.style.cursor = "zoom-in";
  zoomed = false;
}

// Close Lightbox
lbClose.addEventListener("click", () => lightbox.classList.add("hidden"));
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.add("hidden");
});

// Navigation
nextBtn.addEventListener("click", () => navigate(1));
prevBtn.addEventListener("click", () => navigate(-1));

function navigate(dir) {
  currentIndex = (currentIndex + dir + allImages.length) % allImages.length;
  lbImage.classList.add("opacity-0");
  setTimeout(() => {
    lbImage.src = allImages[currentIndex];
    lbImage.classList.remove("opacity-0");
  }, 200);
}

// Zoom Toggle
lbImage.addEventListener("click", () => {
  zoomed = !zoomed;
  lbImage.style.transform = zoomed ? "scale(1.8)" : "scale(1)";
  lbImage.style.cursor = zoomed ? "grab" : "zoom-in";
});

// Drag While Zoomed
lbImage.addEventListener("mousedown", e => {
  if (!zoomed) return;
  isDragging = true;
  startX = e.pageX;
  startY = e.pageY;
  lbImage.classList.add("dragging");
});
document.addEventListener("mouseup", () => {
  isDragging = false;
  lbImage.classList.remove("dragging");
});
document.addEventListener("mousemove", e => {
  if (!isDragging || !zoomed) return;
  e.preventDefault();
  const xMove = (e.pageX - startX) / 3;
  const yMove = (e.pageY - startY) / 3;
  lbImage.style.transform = `scale(1.8) translate(${xMove}px, ${yMove}px)`;
});

// Mobile Swipe
let touchStartX = 0, touchEndX = 0;
lightbox.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
});
lightbox.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  const swipeDistance = touchEndX - touchStartX;
  if (swipeDistance > 70) navigate(-1);
  if (swipeDistance < -70) navigate(1);
});
