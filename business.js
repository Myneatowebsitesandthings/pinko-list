document.addEventListener("DOMContentLoaded", function () {

  const dropdown = document.getElementById("businessSelect");
  const searchWrap = document.getElementById("businessSearchWrap");
  const searchInput = document.getElementById("businessSearch");

  const nameHeader = document.getElementById("businessName");
  const descriptionParagraph = document.getElementById("businessDescription");

  const issuesList = document.getElementById("issuesList");
  const peopleList = document.getElementById("peopleList");
  const subsidiariesList = document.getElementById("subsidiariesList");

  // Quick sanity check so we don't silently fail
  if (!dropdown || !searchWrap || !searchInput) {
    console.error("Missing businessSelect/businessSearchWrap/businessSearch in HTML.");
    return;
  }

  let companiesData = [];

  fetch("companies.json")
    .then(r => r.json())
    .then(data => {
      companiesData = (data || []).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      populateDropdown(companiesData);
    })
    .catch(err => console.error("Error loading companies.json:", err));

  function populateDropdown(data) {
    dropdown.innerHTML = '<option value="">Choose a business...</option>';

    data.forEach(company => {
      const opt = document.createElement("option");
      opt.value = company.name;
      opt.textContent = company.name;
      dropdown.appendChild(opt);
    });
  }

  function displayCompany(company, highlightTerm = "") {
    if (!company) return;

    if (nameHeader) nameHeader.textContent = company.name || "";
    if (descriptionParagraph) {
      const clean = (company.description || "No description available.").replace(/\[\d+\]/g, "");
      descriptionParagraph.textContent = clean;
    }

    if (issuesList) issuesList.innerHTML = "<p>No issues listed yet.</p>";
    if (peopleList) peopleList.innerHTML = "<p>No associated people yet.</p>";
    if (subsidiariesList) subsidiariesList.innerHTML = "";

    const subs = Array.isArray(company.subsidiaries) ? company.subsidiaries : [];

    if (!subsidiariesList) return;

    if (subs.length === 0) {
      subsidiariesList.innerHTML = "<p>No subsidiaries listed.</p>";
      return;
    }

    subs.forEach(sub => {
      const p = document.createElement("p");
      p.textContent = sub;

      if (highlightTerm && sub.toLowerCase().includes(highlightTerm.toLowerCase())) {
        p.classList.add("highlight-brand");
      }

      subsidiariesList.appendChild(p);
    });
  }

  // Show the search box when user interacts with dropdown
  function showSearch() {
    searchWrap.style.display = "block";
    searchInput.focus();
    searchInput.select(); // highlight existing text when clicked again
  }

  dropdown.addEventListener("focus", showSearch);
  dropdown.addEventListener("mousedown", showSearch);
  dropdown.addEventListener("click", showSearch);

  dropdown.addEventListener("change", function () {
    const selected = companiesData.find(c => c.name === dropdown.value);
    displayCompany(selected);
  });

  searchInput.addEventListener("input", function () {
    const term = searchInput.value.trim().toLowerCase();

    if (!term) {
      populateDropdown(companiesData);
      return;
    }

    const filtered = companiesData.filter(c => {
      const nameMatch = (c.name || "").toLowerCase().includes(term);
      const subs = Array.isArray(c.subsidiaries) ? c.subsidiaries : [];
      const subMatch = subs.some(s => (s || "").toLowerCase().includes(term));
      return nameMatch || subMatch;
    });

    populateDropdown(filtered);

    if (filtered.length === 1) {
      dropdown.value = filtered[0].name;
      displayCompany(filtered[0], term);
    }
  });

});