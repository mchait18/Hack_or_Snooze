'use strict'

// This is the global list of the stories, an instance of StoryList
let storyList

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart () {
  storyList = await StoryList.getStories()
  $storiesLoadingMsg.remove()

  putStoriesOnPage()
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup (story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName()

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser)

  return $(`
      <li id="${story.storyId}">
      <div>
      ${showDeleteBtn ? getDeleteBtnHTML() : ''} 
      ${showStar ? getStarHTML(story, currentUser) : ''} 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
       </div>
      </li>
    `)
}
/** Make delete button HTML for story */

function getDeleteBtnHTML () {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`
}
/** Make favorite/not-favorite star for story */

function getStarHTML (story, user) {
  const isFavorite = user.isFavorite(story)
  const starType = isFavorite ? 'fas' : 'far'
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage () {
  console.debug('putStoriesOnPage')

  $allStoriesList.empty()

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story)
    $allStoriesList.append($story)
  }

  $allStoriesList.show()
}

/** Gets list of favorite stories from server, generates their HTML, and puts on page. */

function putFavStoriesOnPage () {
  $allStoriesList.empty()

  // loop through all the favorite stories and generate HTML for them
  if (currentUser.favorites.length === 0)
    $allStoriesList.append('<h5>No favorites added!</h5>')
  else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story)
      $allStoriesList.append($story)
    }
  }

  $allStoriesList.show()
}

function putOwnStoriesOnPage () {
  $allStoriesList.empty()

  // loop through all the Own stories and generate HTML for them
  if (currentUser.ownStories.length === 0)
    $allStoriesList.append('<h5>No stories added by user yet!</h5>')
  else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true)
      $allStoriesList.append($story)
    }
  }

  $allStoriesList.show()
}

async function addStoryInfo (evt) {
  evt.preventDefault()
  const title = $('#story-title').val()
  const author = $('#story-author').val()
  const url = $('#story-url').val()
  await storyList.addStory(currentUser, { title, author, url })
  $addStoryForm.trigger('reset')
  $addStoryForm.hide()
  await getAndShowStoriesOnStart()
}
$addStoryForm.on('submit', addStoryInfo)

async function toggleStoryFavorite (evt) {
  //console.debug('toggleStoryFavorite')
  const $tgt = $(evt.target)
  const $closestLi = $tgt.closest('li')
  const storyId = $closestLi.attr('id')
  const story = storyList.stories.find(s => s.storyId === storyId)
  if ($tgt.hasClass('fas')) {
    await currentUser.removeFromFavorites(story)
    $tgt.closest('i').toggleClass('fas far')
  } else {
    await currentUser.addToFavorites(story)
    $tgt.closest('i').toggleClass('fas far')
  }
}
$storiesLists.on('click', '.star', toggleStoryFavorite)

async function deleteStory (evt) {
  const $tgt = $(evt.target)
  const $closestLi = $tgt.closest('li')
  const storyId = $closestLi.attr('id')
  await storyList.removeStory(currentUser, storyId)
  putOwnStoriesOnPage()
}
$storiesLists.on('click', '.trash-can', deleteStory)
