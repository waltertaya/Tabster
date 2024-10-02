// Query tabs and group them by domain
chrome.tabs.query({}, function(tabs) {
  let domainGroups = {};

  // Categorize tabs by domain
  tabs.forEach(tab => {
    try {
      let url = new URL(tab.url);
      let domain = url.hostname;

      if (!domainGroups[domain]) {
        domainGroups[domain] = [];
      }
      domainGroups[domain].push({ id: tab.id, title: tab.title, url: tab.url });
    } catch (error) {
      console.error(`Error processing URL: ${tab.url} - ${error.message}`);
    }
  });

  // Create groups for each domain
  Object.keys(domainGroups).forEach(domain => {
    chrome.tabs.group({ tabIds: domainGroups[domain].map(tab => tab.id) }, function(groupId) {
      if (chrome.runtime.lastError) {
        console.error(`Error creating group for domain ${domain}: ${chrome.runtime.lastError.message}`);
        return;
      }

      // Dynamically update the DOM to display the group
      displayGroupInDOM(domain, groupId, domainGroups[domain]);
    });
  });
});

// Function to dynamically update the DOM and display groups in the "groupTabs" section
function displayGroupInDOM(domain, groupId, tabs) {
  const groupTabsSection = document.querySelector('.groupTabs');

  const groupDiv = document.createElement('div');
  groupDiv.className = 'groupTab';

  const groupTabName = document.createElement('div');
  groupTabName.className = 'groupTabName';
  groupTabName.innerHTML = `
    <span class="groupIcon">&#128193;</span> 
    ${domain} 
    <span class="collapseIcon">▲</span>
  `;
  groupDiv.appendChild(groupTabName);

  const groupTabContent = document.createElement('div');
  groupTabContent.className = 'groupTabContent';

  // Add individual tabs to the group content
  tabs.forEach(tab => {
    const tabDiv = document.createElement('div');
    tabDiv.className = 'tab';
    tabDiv.innerHTML = `
      <span class="tabIcon">&#128279;</span>
      ${tab.title} 
      <span class="closeIcon">&#10006;</span>
    `;

    groupTabContent.appendChild(tabDiv);
  });

  groupDiv.appendChild(groupTabContent);
  groupTabsSection.appendChild(groupDiv);
}

// Function to group selected tabs
function groupSelectedTabs() {
  chrome.tabs.query({ highlighted: true, currentWindow: true }, function(tabs) {
    let tabIds = tabs.map(tab => tab.id);

    // Group the selected tabs
    chrome.tabs.group({ tabIds: tabIds }, function(groupId) {
      if (chrome.runtime.lastError) {
        console.error(`Error grouping selected tabs: ${chrome.runtime.lastError.message}`);
        return;
      }
      console.log(`Tabs grouped with groupId: ${groupId}`);
    });
  });
}

// Function to rename a group dynamically
function renameGroup(groupName) {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length === 0) {
      console.error("No groups available to rename.");
      return;
    }

    const groupId = groups[0].id;

    chrome.tabGroups.update(groupId, { title: groupName }, function() {
      if (chrome.runtime.lastError) {
        console.error(`Error renaming group: ${chrome.runtime.lastError.message}`);
        return;
      }
      console.log(`Group ${groupId} renamed to ${groupName}`);
    });
  });
}

// Save tab group to local storage
function saveTabGroup() {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length === 0) {
      console.error("No groups available to save.");
      return;
    }

    const groupId = groups[0].id;

    chrome.tabs.query({ groupId: groupId }, function(tabs) {
      if (chrome.runtime.lastError) {
        console.error(`Error retrieving tabs for group ${groupId}: ${chrome.runtime.lastError.message}`);
        return;
      }

      let tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ [groupId]: tabUrls }, function() {
        if (chrome.runtime.lastError) {
          console.error(`Error saving group ${groupId}: ${chrome.runtime.lastError.message}`);
          return;
        }
        console.log(`Tab group ${groupId} saved.`);
      });
    });
  });
}

// Restore tab group from local storage
function restoreTabGroup() {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length === 0) {
      console.error("No groups available to restore.");
      return;
    }

    const groupId = groups[0].id;

    chrome.storage.local.get([groupId], function(result) {
      if (chrome.runtime.lastError) {
        console.error(`Error restoring group ${groupId}: ${chrome.runtime.lastError.message}`);
        return;
      }

      if (result[groupId]) {
        result[groupId].forEach(url => {
          chrome.tabs.create({ url: url });
        });
        console.log(`Tab group ${groupId} restored.`);
      } else {
        console.error(`No data found for group ${groupId}`);
      }
    });
  });
}

// Search tabs within a group
function searchTabsInGroup(query) {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length === 0) {
      console.error("No groups available to search.");
      return;
    }

    const groupId = groups[0].id;

    chrome.tabs.query({ groupId: groupId }, function(tabs) {
      if (chrome.runtime.lastError) {
        console.error(`Error searching tabs in group ${groupId}: ${chrome.runtime.lastError.message}`);
        return;
      }

      let filteredTabs = tabs.filter(tab =>
        tab.title.includes(query) || tab.url.includes(query)
      );

      console.log(`Tabs matching "${query}":`, filteredTabs);
    });
  });
}

// Add listeners to buttons
document.getElementById('groupTabsButton').addEventListener('click', groupSelectedTabs);
document.getElementById('renameGroupButton').addEventListener('click', function() {
  let groupName = document.getElementById('groupNameInput').value;
  renameGroup(groupName);
});
document.getElementById('saveGroupButton').addEventListener('click', saveTabGroup);
document.getElementById('restoreGroupButton').addEventListener('click', restoreTabGroup);

document.getElementById('searchTabsButton').addEventListener('click', function() {
  let query = document.getElementById('searchQueryInput').value; 
  searchTabsInGroup(query);
});

// Event delegation to handle collapsing/expanding and closing tabs dynamically
document.querySelector('.groupTabs').addEventListener('click', (event) => {
  // Handle collapsing and expanding tab groups
  if (event.target.closest('.groupTabName')) {
    const groupTabName = event.target.closest('.groupTabName');
    const content = groupTabName.nextElementSibling;
    content.classList.toggle('hidden');
    const collapseIcon = groupTabName.querySelector('.collapseIcon');
    collapseIcon.textContent = collapseIcon.textContent === '▲' ? '▼' : '▲';
  }

  // Handle removing individual tabs when "X" is clicked
  if (event.target.closest('.closeIcon')) {
    const tabDiv = event.target.closest('.tab');
    tabDiv.remove();
  }
});
