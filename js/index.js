retriveContent('data.json')
  .then(data => {
    const tags = getTagsFrom(data.photographers)
    displaytags(tags)
    displayCards(data.photographers)
    const pageTags = document.querySelectorAll('.tags')
    addListenersToTags(pageTags, data.photographers)
  })
  .catch(error => alert(error.message))

async function retriveContent (url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

function getTagsFrom (photographers) {
  let tableauTags = []
  for (let index = 0; index < photographers.length; index++) {
    tableauTags = tableauTags.concat(photographers[index].tags)
  }
  const filteredArrayTags = tableauTags.filter(function (ele, pos) {
    return tableauTags.indexOf(ele) === pos
  })
  return filteredArrayTags
}

function displaytags (tags) {
  const navElt = document.querySelector('nav')
  for (let i = 0; i < tags.length; i++) {
    navElt.innerHTML += `<span class="tags" data-tag="${tags[i]}">#${tags[i].charAt(0).toUpperCase() + tags[i].slice(1)}</span>`
  }
}

function displayCards (photographers) {
  const cardsElt = document.querySelector('.cards')
  for (let i = 0; i < photographers.length; i++) {
    cardsElt.innerHTML += `<article class="card_photographer">
      <a href="${photographers[i].page}">
          <img src="${photographers[i].portrait}">
          <h2>
              ${photographers[i].name}
          </h2>
      </a>
      <p>
       ${photographers[i].city}, ${photographers[i].country}
      </p>
      <p>
       ${photographers[i].tagline}
      </p>
      <p>
       ${photographers[i].price} /jour
      </p>
      <div class='tagsList'>
      </div>
  </article>`
    displayCardsTags(photographers, i)
  }
}

function displayCardsTags (photographers, index) {
  const photographersElts = document.getElementsByClassName('card_photographer')
  const divElt = photographersElts[photographersElts.length - 1].querySelector('.tagsList')
  for (let j = 0; j < photographers[index].tags.length; j++) {
    divElt.innerHTML += `    
      <span class="tags" data-tag="${photographers[index].tags[j]}">
          #${photographers[index].tags[j].charAt(0).toUpperCase() + photographers[index].tags[j].slice(1)}
      </span>`
  }
}

function addListenersToTags (tagsList, photographers) {
  tagsList.forEach(tag => {
    tag.addEventListener('click', (e) => {
      const cardsElt = document.querySelector('.cards')
      cardsElt.innerHTML = ''
      const tag = e.target.dataset.tag
      const filterPhotographers = photographers.filter(photographer => photographer.tags.includes(tag))
      displayCards(filterPhotographers)
      const pageTags = document.querySelectorAll('article span.tags')
      addListenersToTags(pageTags, photographers)
    })
  })
}

