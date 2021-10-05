retriveContent('data.json')
  .then(data => {
    const photographers = data.photographers
    const url = document.location.search
    const medias = data.media
    displayDesc(photographers, url, medias)
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
      const mediasElt = document.getElementsByClassName('medias')[0]
      for (let media = 0; media < medias.length; media++) {
        if (actualPhotographer.id === medias[media].photographerId) {
          mediasElt.innerHTML += `<div class="card_media">
          <img src="img/${actualPhotographer.name}/${medias[media].image}">
          <p>${medias[media].title}</p>
          <div>
          <span>
          ${medias[media].likes}
          </span>
          <i class="fas fa-heart"></i>
          </div>
          </div>`
          console.log()
        }
      }
    }
  }
}

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
