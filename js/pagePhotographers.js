retriveContent('data.json')
  .then(data => {
    const photographers = data.photographers
    const url = document.location.search
    const medias = data.media
    displayDesc(photographers, url, medias)
    const mediaCard = document.querySelectorAll('.card_media')
    addEvents(mediaCard)
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

function displayDesc (photographers, url, medias) {
  const photographHeader = document.getElementsByClassName('photograph-header')[0]
  let id = url.substring(url.lastIndexOf(' = ') + 5)
  id = parseInt(id)
  for (let i = 0; i < photographers.length; i++) {
    if (photographers[i].id === id) {
      const actualPhotographer = photographers[i]
      photographHeader.innerHTML += `<div>
  <h1>
      ${actualPhotographer.name}
  </h1>
  <p>
      ${photographers[i].city}, ${photographers[i].country}
  </p>
  <p>
      ${photographers[i].tagline}
  </p>
  <div class="tagsList">
      
  </div>
</div>
<div>
  <button>
      Contactez-moi
  </button>
</div>
<div>
  <img src="${photographers[i].portrait}">
</div>`
      displayCardsTags(actualPhotographer)
      for (let media = 0; media < medias.length; media++) {
        if (actualPhotographer.id === medias[media].photographerId) {
          factoryMedia(actualPhotographer, medias[media])
        }
      }
    }
  }
}

function factoryMedia (actualPhotographer, media) {
  const mediasElt = document.getElementsByClassName('medias')[0]
  if ('image' in media) {
    mediasElt.innerHTML += `<div class="card_media">
  <img src="img/${actualPhotographer.name}/${media.image}"></img>
  <p>${media.title}</p>
  <div>
  <span>
  ${media.likes}
  </span>
  <i class="fas fa-heart"></i>
  </div>
  </div>`
  } else if ('video' in media) {
    mediasElt.innerHTML += `<div class="card_media">
    <video controls src="img/${actualPhotographer.name}/${media.video}"></video>
    <p>${media.title}</p>
    <div>
    <span>
    ${media.likes}
    </span>
    <i class="fas fa-heart"></i>
    </div>
    </div>`
  }
}

/* Coucouille Léo Millet*/

function displayCardsTags (photographer) {
  const photographHeader = document.getElementsByClassName('photograph-header')[0]
  const divElt = photographHeader.querySelector('.tagsList')
  for (let j = 0; j < photographer.tags.length; j++) {
    divElt.innerHTML += `    
        <span class="tags" data-tag="${photographer.tags[j]}">
            #${photographer.tags[j].charAt(0).toUpperCase() + photographer.tags[j].slice(1)}
        </span>`
  }
}

function addEvents (mediaCard) {
  mediaCard.forEach((media) => media.addEventListener('click', displayGallery))
}

function displayGallery () {
  const slider = document.querySelector('.slider')
  const main = document.querySelector('#second-page')
  const header = document.querySelector('header')
  slider.style.display = 'block'
  main.style.filter = 'blur(10px)'
  header.style.filter = 'blur(10px)'
}
