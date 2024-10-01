// Function to group selected tabs
function groupSelectedTabs() {
  chrome.tabs.query({ highlighted: true, currentWindow: true }, function(tabs) {
    let tabIds = tabs.map(tab => tab.id);

    if (tabIds.length > 0) {
      chrome.tabs.group({ tabIds: tabIds }, function(groupId) {
        if (chrome.runtime.lastError) {
          console.error(`Error grouping selected tabs: ${chrome.runtime.lastError.message}`);
          return;
        }
        console.log(`Tabs grouped with groupId: ${groupId}`);
      });
    } else {
      console.warn("No tabs selected for grouping.");
    }
  });
}

// Function to rename a group
function renameGroup(groupName) {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length > 0) {
      const groupId = groups[0].id;
      chrome.tabGroups.update(groupId, { title: groupName }, function() {
        if (chrome.runtime.lastError) {
          console.error(`Error renaming group: ${chrome.runtime.lastError.message}`);
          return;
        }
        console.log(`Group ${groupId} renamed to ${groupName}`);
      });
    } else {
      console.error("No groups available to rename.");
    }
  });
}

// Save tab group to local storage
function saveTabGroup() {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length > 0) {
      const groupId = groups[0].id; // Use first available groupId

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
    } else {
      console.error("No groups available to save.");
    }
  });
}

// Restore tab group from local storage
function restoreTabGroup() {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length > 0) {
      const groupId = groups[0].id; // Use first available groupId

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
    } else {
      console.error("No groups available to restore.");
    }
  });
}

// Search tabs within a group
function searchTabsInGroup(query) {
  chrome.tabGroups.query({}, function(groups) {
    if (groups.length > 0) {
      const groupId = groups[0].id; // Use first available groupId

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
    } else {
      console.error("No groups available to search.");
    }
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

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', function() {
  let query = this.value;
  searchTabsInGroup(query);
});

// Reset selections when the popup loads
document.addEventListener('DOMContentLoaded', function() {
  // Optionally clear or set initial states if needed
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.update(tab.id, { highlighted: false });
    });
  });
});
