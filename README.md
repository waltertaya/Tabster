# **Tabster - Chrome Extension for Managing Tabs Efficiently**

## **Table of Contents**
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
   - [Group Ungrouped Tabs](#group-ungrouped-tabs)
   - [Rename a Tab Group](#rename-a-tab-group)
   - [Saving a Tab Group](#saving-a-tab-group)
   - [Dynamic UI](#dynamic-ui)
5. [File Structure](#file-structure)
6. [Code Documentation](#code-documentation)
   - [JavaScript Functions](#javascript-functions)
   - [Event Listeners](#event-listeners)
7. [Permissions](#permissions)
8. [Future Improvements](#future-improvements)
9. [Contributions](#contributions)
10. [Problem Statements](#problem-statements)
11. [Solution](#solution)
12. [License](#license)
13. [Author](#author)

## **Overview**
**Tabster** is a Chrome extension designed to help users who tend to open many tabs at once. The extension automatically groups ungrouped tabs, assigns default group names, highlights the groups with unique colors, and minimizes them to optimize screen space. Users can rename groups, manage tabs more effectively, and save the tab groups for future use.

## **Features**
1. **Group All Ungrouped Tabs**: Automatically selects and groups all open, ungrouped tabs when the user clicks the "Group Tabs" button.
2. **Dynamic Group Names**: Groups are named by default as "Group" followed by an index number, but the user can rename the group at any time.
3. **Tab Group Minimization**: After renaming, groups are automatically minimized to reduce visual clutter.
4. **Persistent Grouping**: Groups are highlighted with different colors to differentiate between them, and group names can be changed by the user.
5. **Save Tab Groups**: Tab groups can be saved locally, allowing users to preserve their session for future reference.

## **Installation**
1. **Clone or Download the Project**
   ```bash
   git clone https://github.com/waltertaya/tabster.git
   ```

2. **Load the Extension**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** by toggling the switch in the top-right corner.
   - Click **Load unpacked** and select the folder containing the `Tabster` project.

3. **Start Managing Tabs**: Once loaded, the **Tabster** icon will appear in your browser toolbar. Click the icon to start grouping and managing tabs.

## **Usage**

### **Group Ungrouped Tabs**
1. **Click the Extension Icon**: Open the extension by clicking on the **Tabster** icon in your browser.
2. **Group Tabs**: Click the `Group Selected Tabs` button to automatically group all open, ungrouped tabs in your current window.
3. **View Group in the Popup**: The new tab group will be displayed in the popup UI with its default name and color.

### **Rename a Tab Group**
1. Enter a new name for the group in the `New Group Name` input field.
2. Click the `Rename Group` button. The latest created group will be renamed, and the group will be minimized to save space in the tab bar.

### **Saving a Tab Group**
1. Once tabs are grouped, you can save the group for future reference.
2. Click the `Save Group` button to save the group locally.

### **Dynamic UI**
- The grouped tabs are displayed in the extension’s popup UI, with an icon to expand or collapse them for easy access.
- You can expand and collapse tab groups from the popup interface, allowing for efficient navigation through multiple tab groups.

## **File Structure**
- **`manifest.json`**: This file defines the metadata for the Chrome extension, such as permissions and actions.
- **`index.html`**: The UI for the popup window, where users interact with the extension.
- **`popup.css`**: Styles the popup window for a clean, user-friendly interface.
- **`index.js`**: The JavaScript logic that powers the extension, handling tab grouping, renaming, and saving functionality.

## **Code Documentation**

### **JavaScript Functions**
- **groupUngroupedTabs()**: Queries all tabs in the current window and filters out those that are already grouped. It then groups the ungrouped tabs and updates the UI.
  
- **displayGroup(groupId)**: Displays the newly created tab group in the popup window by appending it to the UI dynamically.
  
- **renameGroup()**: Renames the most recently created group based on the user input and collapses the group after renaming to minimize space.

### **Event Listeners**
- **Group Tabs Button**: Listens for a click on the "Group Selected Tabs" button to trigger the grouping of all ungrouped tabs.
- **Rename Group Button**: Listens for a click on the "Rename Group" button to rename and collapse the most recent tab group.

## **Permissions**
The extension requires the following permissions to function:
- **`tabs`**: Allows the extension to interact with the open browser tabs.
- **`tabGroups`**: Enables the extension to group and manage tabs.
- **`storage`**: Allows the extension to save tab groups for future use.

## **Future Improvements**
- **Multiple Window Support**: Expand the functionality to group tabs across multiple browser windows.
- **User-defined Group Settings**: Let users assign custom colors to groups and store group settings persistently across sessions.
- **Session Restore**: Add the ability to restore previously saved tab groups across different browsing sessions.

## **Contributions**
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.

## **Problem Statements**
1. **User Behavior**: People often open many browser tabs while browsing the web. This can lead to:
    - Cluttered browsers
    - Difficulty finding specific tabs
    - Increased memory usage, slowing down the browser and computer

2. **Challenges for Users**:
    - **Tab Overload**: With many tabs open, it becomes hard to manage or even remember the contents of each tab.
    - **Performance Impact**: Browsers use more resources (RAM/CPU) to keep all tabs active, causing slowdowns.
    - **Lost Productivity**: Users spend time searching for the right tab or accidentally closing important ones.

## **Solution**
The **Tabster** Chrome extension improves tab management by offering features that help users with the following:
- **Organizing tabs**: Allows users to categorize or group their tabs based on topics, priority, or other criteria.
- **Finding tabs easily**: Provides a search or filtering function to quickly locate open tabs.
- **Reducing the number of open tabs**: Introduces functionality like "tab suspension" (temporarily putting tabs to sleep) or the ability to close or bookmark multiple tabs at once.
- **Improving browser performance**: Helps users reduce memory consumption by managing or suspending unused tabs.

### **License**
This project is licensed under the MIT License.

## **Author**
- [waltertaya](https://github.com/waltertaya)
