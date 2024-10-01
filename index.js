// Create a group based on tab domain
chrome.tabs.query({}, function(tabs) {
    let domainGroups = {};
  
    // Categorize tabs by domain
    tabs.forEach(tab => {
      let url = new URL(tab.url);
      let domain = url.hostname;
  
      if (!domainGroups[domain]) {
        domainGroups[domain] = [];
      }
      domainGroups[domain].push(tab.id);
    });
  
    // Create groups for each domain
    Object.keys(domainGroups).forEach(domain => {
      chrome.tabs.group({ tabIds: domainGroups[domain] }, function(groupId) {
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
          console.error(chrome.runtime.lastError);
          return;
        }
        console.log(`Tabs grouped with groupId: ${groupId}`);
        // Optionally, you can now rename or save this group
      });
    });
  }
  
  // Function to rename a group
  function renameGroup(groupId, groupName) {
    if (!groupId || !groupName) {
      console.error("Group ID or Group Name is missing.");
      return;
    }
    
    chrome.tabGroups.update(groupId, { title: groupName }, function() {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      console.log(`Group ${groupId} renamed to ${groupName}`);
    });
  }
  
  // Save tab group to local storage
  function saveTabGroup(groupId) {
    chrome.tabs.query({ groupId: groupId }, function(tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      
      let tabUrls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ [groupId]: tabUrls }, function() {
        console.log(`Tab group ${groupId} saved.`);
      });
    });
  }
  
  // Restore tab group from local storage
  function restoreTabGroup(groupId) {
    chrome.storage.local.get([groupId], function(result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      
      if (result[groupId]) {
        result[groupId].forEach(url => {
          chrome.tabs.create({ url: url });
        });
        console.log(`Tab group ${groupId} restored.`);
      }
    });
  }
  
  // Search tabs within a group
  function searchTabsInGroup(groupId, query) {
    chrome.tabs.query({ groupId: groupId }, function(tabs) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      
      let filteredTabs = tabs.filter(tab => 
        tab.title.includes(query) || tab.url.includes(query)
      );
  
      console.log(`Tabs matching "${query}":`, filteredTabs);
    });
  }
  
  // Add listeners to buttons
  document.getElementById('groupTabsButton').addEventListener('click', groupSelectedTabs);
  document.getElementById('renameGroupButton').addEventListener('click', function() {
    let groupName = document.getElementById('groupNameInput').value;
    
    // Replace 1 with actual group ID if possible
    let groupId = 1; // Use dynamic group ID here if available
    renameGroup(groupId, groupName);
  });
  
  document.getElementById('saveGroupButton').addEventListener('click', function() {
    let groupId = 1; // Replace with actual group ID if possible
    saveTabGroup(groupId);
  });
  
  document.getElementById('restoreGroupButton').addEventListener('click', function() {
    let groupId = 1; // Replace with actual group ID if possible
    restoreTabGroup(groupId);
  });
  
  // Example: Search for tabs in group 1 with the term "Google"
  searchTabsInGroup(1, "Google");
  