document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("personSearch");
  const resultsBox = document.getElementById("personResults");

  const nameHeader = document.getElementById("personName");
  const descriptionParagraph = document.getElementById("personDescription");

  const issuesList = document.getElementById("personIssues");
  const companiesList = document.getElementById("personCompanies");

  let peopleData = [];
  let filteredResults = [];
  let activeIndex = 0;

  fetch("people.json")
    .then(r => r.json())
    .then(data => {
      peopleData = data.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
      filteredResults = peopleData;
    });

  function displayPerson(person) {
    if (!person) return;

    nameHeader.textContent = person.name || "";
    descriptionParagraph.textContent = person.description || "";

    issuesList.innerHTML = "";
    companiesList.innerHTML = "";

    (person.issues || []).forEach(i => {
      const p = document.createElement("p");
      p.textContent = i;
      issuesList.appendChild(p);
    });

    (person.companies || []).forEach(c => {
      const p = document.createElement("p");
      p.textContent = c;
      companiesList.appendChild(p);
    });
  }

  function renderResults(results) {
    resultsBox.innerHTML = "";
    filteredResults = results;
    activeIndex = 0;

    if (!results.length) {
      resultsBox.style.display = "none";
      return;
    }

    results.forEach((person, index) => {
      const item = document.createElement("div");
      item.className = "business-result-item";
      if (index === 0) item.classList.add("active-result");

      item.textContent = person.name;

      item.addEventListener("mousedown", function (e) {
        e.preventDefault();
        selectPerson(person);
      });

      resultsBox.appendChild(item);
    });

    resultsBox.style.display = "block";
  }

  function selectPerson(person) {
    searchInput.value = person.name;
    resultsBox.style.display = "none";
    displayPerson(person);
  }

  function filter(term) {
    const q = term.toLowerCase().trim();

    if (!q) return peopleData;

    return peopleData.filter(p => {
      const name = (p.name || "").toLowerCase();
      return name.startsWith(q) || name.includes(" " + q);
    });
  }

  // 🔥 MATCHES BUSINESS PAGE BEHAVIOR
  searchInput.addEventListener("focus", function () {
    renderResults(peopleData);
    searchInput.select();
  });

  searchInput.addEventListener("click", function () {
    renderResults(peopleData);
    searchInput.select();
  });

  searchInput.addEventListener("input", function () {
    renderResults(filter(searchInput.value));
  });

  searchInput.addEventListener("keydown", function (e) {
    const visible = filteredResults;

    if (!visible.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, visible.length - 1);
      updateActive();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectPerson(visible[activeIndex]);
    }
  });

  function updateActive() {
    const items = resultsBox.querySelectorAll(".business-result-item");
    items.forEach((el, i) => {
      el.classList.toggle("active-result", i === activeIndex);
    });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".business-search-wrap")) {
      resultsBox.style.display = "none";
    }
  });

});