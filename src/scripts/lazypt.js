import tippy from 'tippy.js';

export default class LazyPt {

  constructor() {
    this.defaultPanel = 'my-work';
  }

  onLoad() {
    this.appendButtonsToStories();
  }

  appendButtonsToStories() {
    // set up the mutation observer
    // `mutations` is an array of mutations that occurred
    // `me` is the MutationObserver instance
    let observer = new MutationObserver((mutations, me) => {
      let panel = document.querySelector(".panel[data-type='my_work']");
      if (panel) {
        this.getAllStoryElements(panel);
        me.disconnect();
        return;
      }
    });

    // start observing
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }

  getAllStoryElements(panel) {
    let stories = panel.querySelectorAll(".story[data-aid='StoryPreviewItem']");
    stories.forEach(story => this.appendButtons(story))
  }


  appendButtons(storyElement) {
    let buttonContainer = this.createButtonscontainer();
    let storyHeader = storyElement.firstChild;
    let storyHeaderName = storyHeader.querySelector('.name')
    storyHeader.style.minHeight = '124px';
    storyHeader.appendChild(buttonContainer);
    storyHeaderName.style.justifyContent = 'inherit';
    console.log('story : ' + storyElement);
  }

  createButtonscontainer() {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add('lazypt-button-container');
    buttonContainer.appendChild(this.createButtoncontainerHeader());
    buttonContainer.appendChild(this.createBranchNameButton());
    buttonContainer.appendChild(this.createCommitMessageButton());
    return buttonContainer;
  }

  createBranchNameButton() {
    let button = document.createElement("button");
    button.textContent = "Branch Name";
    button.classList.add('lazypt-button');
    tippy(button, {
      content: 'Branch name copied!',
      trigger: 'click',
      hideOnClick: false,
      onShow(instance) {
        setTimeout(() => {
          instance.hide();
        }, 1000);
      }
    });
    return button;
  }

  createCommitMessageButton() {
    let button = document.createElement("button");
    button.textContent = "Commit Message";
    button.classList.add('lazypt-button');
    button.addEventListener("click", this.showTooltip, false);
    tippy(button, {
      content: 'Commit message copied!',
      trigger: 'click',
      hideOnClick: false,
      onShow(instance) {
        setTimeout(() => {
          instance.hide();
        }, 1000);
      }
    });
    return button;
  }

  createButtoncontainerHeader() {
    let header = document.createElement("p");
    header.textContent = "Generate:"
    return header;
  }
}