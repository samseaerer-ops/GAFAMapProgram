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
    // 优先使用楼层平面图中的图片；如果某层没有对应平面图，则退回 icons 中原来的图层线框
    const mapPath = `楼层平面地图/${floor}F.png`;
    const iconPath = `icons/${floor}F.png`;
    img.src = mapPath;
    img.onerror = () => {
      img.src = iconPath;
    };
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
    // 鼠标离开楼层索引后回到默认的 2F
    setActiveFloor(2);
  });

  stack.addEventListener("mousemove", (event) => {
    const layers = Array.from(document.querySelectorAll(".floor-layer"));
    if (!layers.length) return;

    // 根据鼠标在堆叠区域中的垂直位置，选择距离最近的那一层
    const clientY = event.clientY;
    let closestLayer = null;
    let closestDistance = Infinity;

    layers.forEach((layer) => {
      const rect = layer.getBoundingClientRect();
      const centerY = (rect.top + rect.bottom) / 2;
      const distance = Math.abs(centerY - clientY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestLayer = layer;
      }
    });

    if (!closestLayer) return;
    const floor = closestLayer.dataset.floor;
    if (!floor) return;
    setActiveFloor(Number(floor));
  });

  stack.addEventListener("mouseleave", () => {
    // 鼠标离开楼层区域后回到默认的 2F
    setActiveFloor(2);
  });

  // 卡片区域：支持鼠标拖拽横向滚动
  const cardList = document.querySelector(".card-list");
  if (cardList) {
    // 卡片 hover 动效：通过类名控制，保证在某些环境下 hover 也生效
    const cards = cardList.querySelectorAll(".place-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.classList.add("card-hover");
      });
      card.addEventListener("mouseleave", () => {
        card.classList.remove("card-hover");
      });
    });
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    cardList.addEventListener("mousedown", (e) => {
      isDown = true;
      cardList.classList.add("is-dragging");
      startX = e.pageX - cardList.offsetLeft;
      scrollLeft = cardList.scrollLeft;
    });

    const endDrag = () => {
      // 只有确实从卡片区域拖动过，才触发回弹
      if (!isDown) return;
      isDown = false;
      cardList.classList.remove("is-dragging");

      // 只有拉到边缘（最左或最右）时才触发回弹效果
      const maxScrollLeft = cardList.scrollWidth - cardList.clientWidth;
      const atLeftEdge = cardList.scrollLeft <= 0;
      const atRightEdge = cardList.scrollLeft >= maxScrollLeft - 1;

      if (atLeftEdge || atRightEdge) {
        cardList.classList.add("is-bounce");
        setTimeout(() => {
          cardList.classList.remove("is-bounce");
        }, 300);
      }
    };

    document.addEventListener("mouseup", endDrag);

    cardList.addEventListener("mouseleave", () => {
      if (!isDown) return;
      endDrag();
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
  // 默认选中 2F
  setActiveFloor(2);
  bindInteractions();
});


