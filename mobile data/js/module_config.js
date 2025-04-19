const modules = [
  {
    name: "A COY",
    color: "#ff6666",
    submodules: ["NSQM STORE", "KOTE"]
  },
  {
    name: "B COY",
    color: "#66ccff",
    submodules: ["NSQM STORE", "KOTE"]
  },
  {
    name: "C COY",
    color: "#99ff99",
    submodules: ["NSQM STORE", "KOTE"]
  },
  {
    name: "D COY",
    color: "#ffcc99",
    submodules: ["NSQM STORE", "KOTE"]
  },
  {
    name: "SP COY",
    color: "#cc99ff",
    submodules: ["NSQM STORE", "KOTE"]
  },
  {
    name: "HQ COY",
    color: "#ffd700",
    submodules: ["NSQM STORE", "KOTE"]
  },
  {
    name: "BN MAG",
    color: "#ff4444",
    submodules: ["AMMN", "FOL", "CLTH"]
  },
  {
    name: "BN",
    color: "#444444",
    submodules: []
  }
];

function renderModuleFilters() {
  const container = document.getElementById("module-filters");
  if (!container) return;

  container.innerHTML = "";

  modules.forEach((module) => {
    const wrapper = document.createElement("div");
    wrapper.className = "module-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = module.name;
    checkbox.className = "module-checkbox";
    checkbox.id = `module-${module.name}`;
    checkbox.onchange = applyFilter;

    const label = document.createElement("label");
    label.setAttribute("for", `module-${module.name}`);
    label.innerText = module.name;
    label.style.backgroundColor = module.color;
    label.style.padding = "4px 8px";
    label.style.margin = "2px";
    label.style.borderRadius = "6px";
    label.style.color = "#fff";
    label.style.cursor = "pointer";
    label.style.display = "inline-block";

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

window.onload = function () {
  renderModuleFilters();
  loadFromLocalStorage();
  startClock();
};
