document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("issueSearch");
  const resultsBox = document.getElementById("issueResults");

  const nameHeader = document.getElementById("issueName");
  const descriptionParagraph = document.getElementById("issueDescription");

  const companiesList = document.getElementById("issueCompanies");
  const peopleList = document.getElementById("issuePeople");

  let issuesData = [];
  let filteredResults = [];
  let activeIndex = 0;

  fetch("issues.json")
    .then(r => r.json())
    .then(data => {
      issuesData = data.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
      filteredResults = issuesData;
    });

  function displayIssue(issue) {
    if (!issue) return;

    nameHeader.textContent = issue.name || "";
    descriptionParagraph.textContent = issue.description || "";

    companiesList.innerHTML = "";
    peopleList.innerHTML = "";

    (issue.companies || []).forEach(c => {
      const p = document.createElement("p");
      p.textContent = c;
      companiesList.appendChild(p);
    });

    (issue.people || []).forEach(ppl => {
      const p = document.createElement("p");
      p.textContent = ppl;
      peopleList.appendChild(p);
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

    results.forEach((issue, index) => {
      const item = document.createElement("div");
      item.className = "business-result-item";
      if (index === 0) item.classList.add("active-result");

      item.textContent = issue.name;

      item.addEventListener("mousedown", function (e) {
        e.preventDefault();
        selectIssue(issue);
      });

      resultsBox.appendChild(item);
    });

    resultsBox.style.display = "block";
  }

  function selectIssue(issue) {
    searchInput.value = issue.name;
    resultsBox.style.display = "none";
    displayIssue(issue);
  }

  function filter(term) {
    const q = term.toLowerCase().trim();

    if (!q) return issuesData;

    return issuesData.filter(i => {
      const name = (i.name || "").toLowerCase();
      return name.startsWith(q) || name.includes(" " + q);
    });
  }

  searchInput.addEventListener("focus", function () {
    renderResults(issuesData);
    searchInput.select();
  });

  searchInput.addEventListener("click", function () {
    renderResults(issuesData);
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
      selectIssue(visible[activeIndex]);
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