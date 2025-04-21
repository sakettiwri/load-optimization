// Module and Submodule Filter Setup
function setupModuleFilters(modules) {
    const moduleFiltersContainer = document.getElementById('moduleFilters');
    moduleFiltersContainer.innerHTML = '';
  
    modules.forEach(module => {
      const moduleCheckbox = document.createElement('input');
      moduleCheckbox.type = 'checkbox';
      moduleCheckbox.id = module.id;
      moduleCheckbox.name = module.name;
      moduleCheckbox.value = module.name;
  
      const moduleLabel = document.createElement('label');
      moduleLabel.setAttribute('for', module.id);
      moduleLabel.textContent = module.name;
  
      const div = document.createElement('div');
      div.appendChild(moduleCheckbox);
      div.appendChild(moduleLabel);
      moduleFiltersContainer.appendChild(div);
    });
  }
  
  function setupSubModuleFilters(subModules) {
    const subModuleFiltersContainer = document.getElementById('subModuleFilters');
    subModuleFiltersContainer.innerHTML = '';
  
    subModules.forEach(subModule => {
      const subModuleCheckbox = document.createElement('input');
      subModuleCheckbox.type = 'checkbox';
      subModuleCheckbox.id = subModule.id;
      subModuleCheckbox.name = subModule.name;
      subModuleCheckbox.value = subModule.name;
  
      const subModuleLabel = document.createElement('label');
      subModuleLabel.setAttribute('for', subModule.id);
      subModuleLabel.textContent = subModule.name;
  
      const div = document.createElement('div');
      div.appendChild(subModuleCheckbox);
      div.appendChild(subModuleLabel);
      subModuleFiltersContainer.appendChild(div);
    });
  }
  
  // Example data for modules and submodules
  const modules = [
    { id: 'module1', name: 'Module 1' },
    { id: 'module2', name: 'Module 2' },
  ];
  
  const subModules = [
    { id: 'subModule1', name: 'SubModule 1' },
    { id: 'subModule2', name: 'SubModule 2' },
  ];
  
  // Initialize Filters
  setupModuleFilters(modules);
  setupSubModuleFilters(subModules);
  