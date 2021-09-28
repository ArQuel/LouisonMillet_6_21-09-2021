async function retriveContent (url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

function displaytags (tags) {
  const navElt = document.querySelector('nav')
  for (let i = 0; i < tags.length; i++) {
    navElt.innerHTML += `<span class="tags"><div class="navTags">#${tags[i].charAt(0).toUpperCase() + tags[i].slice(1)}</span></span>`
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
  const divElt = document.getElementsByClassName('tagsList')[index]
  for (let j = 0; j < photographers[index].tags.length; j++) {
    // const navTags = document.querySelectorAll('.navTags')
    // console.log(photographers[index].tags[j], navTags.value)
    // if (photographers[index].tags[j] === navTags.value) {
      divElt.innerHTML += `    
    <span class="tags">
        #${photographers[index].tags[j].charAt(0).toUpperCase() + photographers[index].tags[j].slice(1)}
    </span>`
    // }
  }
}

retriveContent('data.json')
  .then(data => {
    const tags = getTagsFrom(data.photographers)
    displaytags(tags)
    displayCards(data.photographers)
  })
  .catch(error => alert(error.message))
