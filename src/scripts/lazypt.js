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
        let storyPreviewsWithoutButtons = panel.querySelectorAll(".story[data-aid='StoryPreviewItem']:not(.lazypt-story-preview)");
        let expandedStoriesWithoutButtons = panel.querySelectorAll(".edit[data-aid='StoryDetailsEdit']:not(.lazypt-story-expanded)");

        this.boardName = document.querySelector('.tc_context_name').textContent;
        this.appendButtonsToExpandedStories(expandedStoriesWithoutButtons);
        this.appendButtonsToStoryPreviews(storyPreviewsWithoutButtons);
        return;
      }
    });

    // start observing
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }

  appendButtonsToExpandedStories(expandedStories) {
    expandedStories.forEach(story => this.appendButtons(story, 'expanded'))
  }

  
  appendButtonsToStoryPreviews(storyPreviews) {
    storyPreviews.forEach(story => this.appendButtons(story, 'preview'))
  }

  appendButtons(storyElement, type) {
    storyElement.classList.add(`lazypt-story-${type}`);
    let buttonContainer = storyElement.querySelector(`.lazypt-button-container.${type}`);
    var story = {}
    if(buttonContainer === null) {
      if(type === 'preview')
        story = this.createObjectFromStoryPreview(storyElement);
      else if(type === 'expanded')
        story = this.createObjectFromExpandedStory(storyElement);
      let onBranchNameClick = this.createBranchNameClickListener(story);
      let onCommitMessageClick = this.createCommitMessageClickListener(story);
      let buttonContainer = this.createButtonscontainer(type, onBranchNameClick, onCommitMessageClick);
      let storyHeader = storyElement.firstChild;
      let storyHeaderName = storyHeader.querySelector('.name');
      storyHeader.style.minHeight = '124px';
      storyHeader.appendChild(buttonContainer);
      storyHeaderName.style.justifyContent = 'inherit';
    }
  }

  createButtonscontainer(type, onBranchNameClick, onCommitMessageClick) {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add(`lazypt-button-container`);
    buttonContainer.classList.add(`lazypt-button-container-${type}`);
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
    return () => navigator.clipboard.writeText(this.generateBranchName(story));
  }

  createCommitMessageClickListener(story) {
    return () => navigator.clipboard.writeText(this.generateCommitMessage(story));
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

  createObjectFromStoryPreview(storyPreview) {
    let id = storyPreview.dataset.id;
    let title = storyPreview.firstChild.querySelector('.tracker_markup').textContent;
    let type = this.getStoryType(storyPreview.classList);
    let labels = Array.from(storyPreview.firstChild.querySelector('.labels').children).map((label) => label.textContent);
    let link = `https://www.pivotaltracker.com/story/show/${id}`;
    return {
      'id': id,
      'title': title,
      'type': type,
      'labels': labels,
      'link': link
    }
  }

  createObjectFromExpandedStory(expandedStory) {
    let id = expandedStory.parentElement.parentElement.parentElement.dataset.id;
    let title = expandedStory.querySelector('textarea[name="story[name]"]').value;
    let type = this.getStoryType(expandedStory.parentElement.parentElement.parentElement.classList);
    let labels = Array.from(expandedStory.querySelector('div[data-aid="StoryLabelsMaker__contentContainer"]').childNodes).filter((item)=>item.dataset['aid']!=='LabelsSearch');
    let link = `https://www.pivotaltracker.com/story/show/${id}`;
    return {
      'id': id,
      'title': title,
      'type': type,
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