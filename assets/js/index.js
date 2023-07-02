//Data display 
const loadData = async (dataLimit, sortByDateAscending) => {
  // Show loader
  toggleSpinner(true);
  const url = "https://openapi.programming-hero.com/api/ai/tools";
  const response = await fetch(url);
  const data = await response.json();
  let tools = data.data.tools;
  // Sort tools by date in ascending order
  if (sortByDateAscending) {
    tools = tools.sort((a, b) => new Date(a.published_in) - new Date(b.published_in));
  }
  displayTools(tools, dataLimit);
};

const displayTools = (tools, dataLimit) => {
  const toolsContainer = document.getElementById("tools-container");
  toolsContainer.innerHTML = "";
  let displayedTools;

  if (dataLimit) {
    displayedTools = tools.slice(0, dataLimit);
  } else {
    displayedTools = tools;
  }

  displayedTools.forEach((tool) => {
    // console.log("first",tool);
    const toolsDiv = document.createElement("div");
    toolsDiv.classList.add("col", "mb-3");
    toolsDiv.innerHTML = `
      <div class="card h-100 p-3">
        <img style="" src="${tool.image}" class="w-100 h-75" alt="...">
        <div class="">
          <h5 class="card-title my-4">Feature</h5>
          <div style="line-height: 10px" class="mb-4">
            ${tool.features.slice(0, 3).map((feature, index) => `<p>${index + 1}. ${feature}</p>`).join('')} 
            ${tool.features.length < 3 ? `<p>${tool.features.length + 1}. NO New feature</p>` : ''}
          </div>
          <hr>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5>${tool.name}</h5>
            <span class="fs-6"><i class="bi bi-calendar3"></i> ${tool.published_in}</span>
          </div>
          <div><button onclick="loadDetails('${tool.id}')" style="border-radius: 25px"; class="btn btn-light" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-arrow-right-short text-danger fs-4"></i></button></div>
        </div>
      </div>
    `;
    toolsContainer.appendChild(toolsDiv);
  });

  const showAllButton = document.getElementById("show-all");
  if (!dataLimit || dataLimit >= tools.length) {
    showAllButton.classList.add("d-none");
  } else {
    showAllButton.classList.remove("d-none");
  }

  // Hide the loader
  toggleSpinner(false);
};

const toggleSpinner = isLoading => {
  const loaderSection = document.getElementById('loader');
  if (isLoading) {
    loaderSection.classList.remove('d-none')
  } else {
    loaderSection.classList.add('d-none')
  }
}

const processSearch = (dataLimit) => {
  toggleSpinner(true);
  loadData(dataLimit);
};

document.getElementById("btn-show-all").addEventListener("click", function () {
  processSearch();
});
// Sort the tools 
const sortButton = document.querySelector(".btn-danger").addEventListener("click", () => {
  loadData(null, true);
});

// Modal functional
const loadDetails = async id => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.data);
}

const displayDetails = model => {
  console.log(model);
  const modelContainer = document.getElementById("model-container");
  modelContainer.innerHTML = ''; // clear previous modal data
  const modelDiv = document.createElement("div");
  modelDiv.classList.add("row");
  modelDiv.innerHTML = `
    <div class="col-lg-6">
      <div class="border border-danger rounded bg-light bg-gradient p-3">
        <h4 class="mb-4">${model.description}</h4>
        <div class="row">
          <div class="col-md-4 mb-3 mb-md-0 h-100">
            <p style="50px" class="text-success rounded p-4 text-center bg-white">
              ${model.pricing ? model.pricing[0].price : 'Free of Cost/ '}</br>
              ${model.pricing ? model.pricing[0].plan : 'Basic'}
            </p>
          </div>
          <div class="col-md-4 mb-3 mb-md-0 h-100">
          <p class="text-success text-warning rounded p-4 text-center bg-white">
          ${model.pricing ? model.pricing[1].price : 'Free of Cost'}</br>
          ${model.pricing ? model.pricing[1].plan : 'Pro'}
          </p>
          </div>
          <div class="col-md-4  mb-3 mb-md-0 h-100">
            <p class="text-danger rounded p-3 text-center bg-white">
            ${model.pricing ? model.pricing[2].price : 'Free of Cost'}</br>
            ${model.pricing ? model.pricing[2].plan : 'EnterPrise'}
          </p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <h4 class="mt-4">Features</h4>
            <ul>
              <li>${model.features ? model.features["1"].feature_name : 'No Data Found'}</li>
              <li>${model.features ? model.features["2"].feature_name : 'No Data Found'}</li>
              <li>${model.features ? model.features["3"].feature_name : 'No Data Found'}</li>
            </ul>
          </div>
          <div class="col-md-6">
            <h4 class="mt-4">Integrations</h4>
            <ul>
               ${model.integrations?.slice(0, model.integrations.length).map((integration) => `<li>${integration}</li>`).join("") ?? "<p>No Data Found</p>"}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mt-4 mt-lg-0">
    <div class="position-relative">
        <img src="${model.image_link[0]}" class="img-fluid" alt="">
          <div style="top:20px;right:20px;" class="bg-danger rounded position-absolute py-2 px-4
              ${model.accuracy.score ? 'accuracy' : 'd-none'}">
          <h6 class="text-white">
              ${model.accuracy.score ? `<span>${model.accuracy.score*100}</span>% accuracy` : ''}
          </h6>
    </div>
</div>

      <div class="text-center mt-4">
        <h4>${model.input_output_examples ? model.input_output_examples[0].input : "Can you give any example?"}</h4>
        <p>${model.input_output_examples ? model.input_output_examples[0].output : "No! Not Yet Take a break!!!"}</p>
      </div>
  </div>

    </div>
  `;
  modelContainer.appendChild(modelDiv);
}

loadData(6);



