function groupUngroupedTabs() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const ungroupedTabs = tabs.filter(tab => !tab.groupId || tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE);

    const tabIds = ungroupedTabs.map(tab => tab.id);

    if (tabIds.length > 0) {
      chrome.tabs.group({ tabIds: tabIds }, (groupId) => {
        if (chrome.runtime.lastError) {
          console.error(`Error grouping tabs: ${chrome.runtime.lastError.message}`);
          return;
        }
        displayGroup(groupId);
      });
    } else {
      console.log("No ungrouped tabs found.");
    }
  });
}

function displayGroup(groupId) {
  chrome.tabGroups.get(groupId, (group) => {
    const groupTabsDiv = document.querySelector('.groupTabs');
    const groupElement = document.createElement('div');
    groupElement.className = 'groupTab';
    groupElement.textContent = `Group ${groupId}: ${group.title || 'Group'}`;
    groupTabsDiv.appendChild(groupElement);
  });
}

function renameGroup() {
  const groupName = document.getElementById('groupNameInput').value || 'Group';

  chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (groups) => {
    const latestGroup = groups[groups.length - 1];
    if (latestGroup) {
      chrome.tabGroups.update(latestGroup.id, { title: groupName, collapsed: true }, () => {
        if (chrome.runtime.lastError) {
          console.error(`Error renaming group: ${chrome.runtime.lastError.message}`);
        } else {
          console.log(`Group ${latestGroup.id} renamed to ${groupName} and minimized.`);
        }
      });
    } else {
      console.error("No groups available to rename.");
    }
  });
}

function deleteLastGroup() {
  chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (groups) => {
    const latestGroup = groups[groups.length - 1];
    if (latestGroup) {
      chrome.tabs.query({ groupId: latestGroup.id }, (tabs) => {
        const tabIds = tabs.map(tab => tab.id);
        chrome.tabs.ungroup(tabIds, () => {
          if (chrome.runtime.lastError) {
            console.error(`Error ungrouping tabs: ${chrome.runtime.lastError.message}`);
          } else {
            console.log(`Group ${latestGroup.id} ungrouped and deleted.`);
          }
        });
      });
    } else {
      console.error("No groups available to delete.");
    }
  });
}


function deleteAllGroups() {
  chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (groups) => {
    groups.forEach((group) => {
      chrome.tabs.query({ groupId: group.id }, (tabs) => {
        const tabIds = tabs.map(tab => tab.id);
        chrome.tabs.ungroup(tabIds, () => {
          if (chrome.runtime.lastError) {
            console.error(`Error ungrouping tabs: ${chrome.runtime.lastError.message}`);
          } else {
            console.log(`Group ${group.id} ungrouped and deleted.`);
          }
        });
      });
    });
  });
}

document.getElementById('groupTabsButton').addEventListener('click', groupUngroupedTabs);
document.getElementById('renameGroupButton').addEventListener('click', renameGroup);
document.getElementById('deleteLastGroup').addEventListener('click', deleteLastGroup);
document.getElementById('deleteAllGroups').addEventListener('click', deleteAllGroups);
