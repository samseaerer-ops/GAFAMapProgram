// 动态创建 1F-7F 图层与索引，并在鼠标滑动时放大对应图层

const floors = [1, 2, 3, 4, 5, 6, 7];

function createFloorStack() {
  const container = document.getElementById("floorStack");
  if (!container) return;

  floors.forEach((floor) => {
    const wrapper = document.createElement("div");
    wrapper.className = "floor-layer";
    wrapper.dataset.floor = String(floor);

    const img = document.createElement("img");
    img.src = `icons/${floor}F.png`;
    img.alt = `${floor}F 图层`;

    wrapper.appendChild(img);
    container.appendChild(wrapper);
  });
}

function createFloorIndex() {
  const container = document.getElementById("floorIndex");
  if (!container) return;

  floors
    .slice()
    .reverse()
    .forEach((floor) => {
      const item = document.createElement("div");
      item.className = "floor-index-item";
      item.dataset.floor = String(floor);
      item.textContent = `${floor}F`;
      container.appendChild(item);
    });
}

function setActiveFloor(floor) {
  const layers = document.querySelectorAll(".floor-layer");
  const indexItems = document.querySelectorAll(".floor-index-item");

  layers.forEach((el) => {
    el.classList.toggle("is-active", el.dataset.floor === String(floor));
  });

  indexItems.forEach((el) => {
    el.classList.toggle("is-active", el.dataset.floor === String(floor));
  });
}

function bindInteractions() {
  const stack = document.getElementById("floorStack");
  const index = document.getElementById("floorIndex");
  if (!stack || !index) return;

  index.addEventListener("mousemove", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const floor = target.dataset.floor;
    if (!floor) return;
    setActiveFloor(Number(floor));
  });

  index.addEventListener("mouseleave", () => {
    setActiveFloor(1);
  });

  stack.addEventListener("mousemove", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const layer =
      target.classList.contains("floor-layer") ? target : target.parentElement;
    if (!layer) return;
    const floor = layer.dataset.floor;
    if (!floor) return;
    setActiveFloor(Number(floor));
  });

  stack.addEventListener("mouseleave", () => {
    setActiveFloor(1);
  });

  // 卡片区域：支持鼠标拖拽横向滚动
  const cardList = document.querySelector(".card-list");
  if (cardList) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    cardList.addEventListener("mousedown", (e) => {
      isDown = true;
      cardList.classList.add("is-dragging");
      startX = e.pageX - cardList.offsetLeft;
      scrollLeft = cardList.scrollLeft;
    });

    document.addEventListener("mouseup", () => {
      isDown = false;
      cardList.classList.remove("is-dragging");
    });

    cardList.addEventListener("mouseleave", () => {
      isDown = false;
      cardList.classList.remove("is-dragging");
    });

    cardList.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - cardList.offsetLeft;
      const walk = x - startX;
      cardList.scrollLeft = scrollLeft - walk;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createFloorStack();
  createFloorIndex();
  setActiveFloor(1);
  bindInteractions();
});


