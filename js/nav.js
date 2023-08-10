'use strict'

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories (evt) {
  console.debug('navAllStories', evt)
  hidePageComponents()
  putStoriesOnPage()
}

$body.on('click', '#nav-all', navAllStories)

/** Show login/signup on click on "login" */

function navLoginClick (evt) {
  console.debug('navLoginClick', evt)
  hidePageComponents()
  $loginForm.show()
  $signupForm.show()
}

$navLogin.on('click', navLoginClick)

/** When a user first logins in, update the navbar to reflect that. */

async function updateNavOnLogin () {
  console.debug('updateNavOnLogin')
  $('.main-nav-links').show()
  $navLogin.hide()
  $navLogOut.show()
  $navAdd.show()
  $navFav.show()
  $navOwn.show()
  $navUserProfile.text(`${currentUser.username}`).show()
  await getAndShowStoriesOnStart()
}
/* Show Add Story on click submit*/

function addStoryClick (evt) {
  console.debug('addStoryClick', evt)
  $addStoryForm.show()
}
$navAdd.on('click', addStoryClick)

/* Show Favorites on click Favorites*/

function showFavClick (evt) {
  hidePageComponents()
  putFavStoriesOnPage()
}
$navFav.on('click', showFavClick)

function showOwnClick (evt) {
  hidePageComponents()
  putOwnStoriesOnPage()
}
$navOwn.on('click', showOwnClick)
