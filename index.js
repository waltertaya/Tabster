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
          domainGroups[domain].push(tab.id);
      } catch (error) {
          console.error(`Error processing URL: ${tab.url} - ${error.message}`);
      }
  });

  // Create groups for each domain
  Object.keys(domainGroups).forEach(domain => {
      chrome.tabs.group({ tabIds: domainGroups[domain] }, function(groupId) {
          if (chrome.runtime.lastError) {
              console.error(`Error creating group for domain ${domain}: ${chrome.runtime.lastError.message}`);
              return;
          }
          console.log(`Group created for domain ${domain} with groupId ${groupId}`);
      });
  });
});

// Function to manually group selected tabs
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
  // Query all tab groups dynamically
  chrome.tabGroups.query({}, function(groups) {
      if (groups.length === 0) {
          console.error("No groups available to rename.");
          return;
      }

      // Use the first groupId dynamically
      const groupId = groups[0].id;

      // Rename the group
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
  // Query groups dynamically
  chrome.tabGroups.query({}, function(groups) {
      if (groups.length === 0) {
          console.error("No groups available to save.");
          return;
      }

      const groupId = groups[0].id; // Get dynamic groupId

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
  // Query groups dynamically
  chrome.tabGroups.query({}, function(groups) {
      if (groups.length === 0) {
          console.error("No groups available to restore.");
          return;
      }

      const groupId = groups[0].id; // Get dynamic groupId

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
  // Query groups dynamically
  chrome.tabGroups.query({}, function(groups) {
      if (groups.length === 0) {
          console.error("No groups available to search.");
          return;
      }

      const groupId = groups[0].id; // Get dynamic groupId

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

// Example: Search for tabs in the first available group with the term "Google"
document.getElementById('searchTabsButton').addEventListener('click', function() {
  let query = document.getElementById('searchQueryInput').value;
  searchTabsInGroup(query);
});
