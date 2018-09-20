var windowId;
const contentPane = document.querySelector("#ticketAssist");

/*
Pull data.
*/
browser.commands.onCommand.addListener(function(command) {
  if (command == "pull_data") {
    console.log("Pulling");
  }
});

/*
Push data.
*/
browser.commands.onCommand.addListener(function(command) {
  if (command == "push_data") {
    console.log("Pushing");
  }
});

/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  contentPane.setAttribute("contenteditable", true);
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  contentPane.setAttribute("contenteditable", false);
  browser.tabs.query({windowId: windowId, active: true}).then((tabs) => {
    let contentToStore = {};
    contentToStore[tabs[0].url] = contentPane.textContent;
    browser.storage.local.set(contentToStore);
  });
});

/*
Update the sidebar's content.
1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
  browser.tabs.query({windowId: windowId, active: true})
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url);
    })
    .then((storedInfo) => {
      contentPane.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  windowId = windowInfo.id;
  updateContent();
});