retriveContent('data.json')
  .then(data => {
    const photographers = data.photographers
    const medias = data.medias
    const url = document.location.href
    displayDesc(photographers, url)
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


function displayDesc (photographers, url) {
  const photographHeader = document.getElementsByClassName('photograph-header')[0]
  let id = url.slice(48)
  id = parseInt(id)
  for (let i = 0; i < photographers.length; i++) {
    if (photographers[i].id === id) {
      const actualPhotographer = photographers[i]
      console.log(actualPhotographer)
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
