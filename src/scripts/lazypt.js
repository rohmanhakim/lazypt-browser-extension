import tippy from 'tippy.js';

export default class LazyPt {

  constructor() {
    this.defaultPanel = 'my-work';
    this.boardName = '';
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
        this.boardName = document.querySelector('.tc_context_name').textContent;
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
    let story = this.generateStoryObject(storyElement);
    let onBranchNameClick = this.createBranchNameClickListener(story);
    let onCommitMessageClick = this.createCommitMessageClickListener(story);
    let buttonContainer = this.createButtonscontainer(onBranchNameClick, onCommitMessageClick);
    let storyHeader = storyElement.firstChild;
    let storyHeaderName = storyHeader.querySelector('.name');
    storyHeader.style.minHeight = '124px';
    storyHeader.appendChild(buttonContainer);
    storyHeaderName.style.justifyContent = 'inherit';
    console.log('story : ' + storyElement);
  }

  createButtonscontainer(onBranchNameClick, onCommitMessageClick) {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add('lazypt-button-container');
    buttonContainer.appendChild(this.createButtoncontainerHeader());
    buttonContainer.appendChild(this.createBranchNameButton(onBranchNameClick));
    buttonContainer.appendChild(this.createCommitMessageButton(onCommitMessageClick));
    return buttonContainer;
  }

  createBranchNameButton(onClick) {
    let button = document.createElement("button");
    button.textContent = "Branch Name";
    button.classList.add('lazypt-button');
    button.addEventListener('click', onClick, false);
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

  createCommitMessageButton(onClick) {
    let button = document.createElement("button");
    button.textContent = "Commit Message";
    button.classList.add('lazypt-button');
    button.addEventListener('click', onClick, false);
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

  createBranchNameClickListener(story) {
    return () => console.log('branch name: ' + this.generateBranchName(story));
  }

  createCommitMessageClickListener(story) {
    return () => console.log('commit msg: ' + this.generateCommitMessage(story));
  }

  generateBranchName(story) {
    let board = this.convertToKebabCase(this.boardName);
    let storyType = this.convertToKebabCase(story.type);
    let storyTitle = this.convertToKebabCase(story.title);
    return `${board}/${storyType}/${story.id}-${storyTitle}`;
  }

  generateCommitMessage(story) {
    let board = this.convertToKebabCase(this.boardName);
    return `[#${story.id}][${board}] ${story.title}`;
  }

  convertToKebabCase(text) {
    return text.toLowerCase().replace(/[^a-zA-Z\d:]/gm,'-').replace(/-{2,}/gm,'-');
  }

  generateStoryObject(storyElement) {
    let id = storyElement.dataset['id'];
    let title = storyElement.firstChild.querySelector('.tracker_markup').textContent;
    let type = this.getStoryType(storyElement.classList);
    let owner = storyElement.firstChild.querySelector('.owner').getAttribute('title');
    let ownerInitial = storyElement.firstChild.querySelector('.owner').textContent;
    let labels = Array.from(storyElement.firstChild.querySelector('.labels').children).map((label) => label.textContent);
    let link = `https://www.pivotaltracker.com/story/show/${id}`;
    return {
      'id': id,
      'title': title,
      'type': type,
      'owner': owner,
      'ownerInitial': ownerInitial,
      'labels': labels,
      'link': link
    }
  }

  getStoryType(classList) {
    let storyType = null;
    if(classList.contains('feature')) storyType = 'feature';
    if(classList.contains('bug')) storyType = 'bug';
    if(classList.contains('bug')) storyType = 'chore';
    return storyType;
  }
}