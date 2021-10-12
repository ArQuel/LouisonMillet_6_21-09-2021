retriveContent('data.json')
  .then(data => {
    const photographers = data.photographers
    const url = document.location.search
    const medias = data.media
    displayDesc(photographers, url, medias)
    const mediaIMG = document.querySelectorAll('.medias img')
    const mediaVID = document.querySelectorAll('.medias video')
    addEvents(mediaIMG, mediaVID, medias)
    displayForm()
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
  <button id="button">
      Contactez-moi
  </button>
</div>
<div>
  <img src="${photographers[i].portrait}">
</div>`
      displayCardsTags(actualPhotographer)
      const photographerMedias = medias.filter(elt => elt.photographerId === actualPhotographer.id)
      const mediasElt = document.getElementsByClassName('medias')[0]
      photographerMedias.sort((a, b) => b.likes - a.likes)
      displayMediasSortedBy('Popularité', photographerMedias, mediasElt, actualPhotographer)
      document.querySelector('select').addEventListener('change', (e) => {
        const select = document.querySelector('select')
        displayMediasSortedBy(select.value, photographerMedias, mediasElt, actualPhotographer)
        const mediaIMG = document.querySelectorAll('img')
        const mediaVID = document.querySelectorAll('video')
        addEvents(mediaIMG, mediaVID, medias)
      })
      const likes = document.querySelectorAll('.medias .card_media span')
      displayPriceAndLikes(likes, actualPhotographer)
    }
  }
}

function factoryMedia (actualPhotographer, media, container) {
  const mediasElt = container
  if ('image' in media) {
    mediasElt.innerHTML += `<div class="card_media">
  <img src="img/${actualPhotographer.name}/${media.image}" id=${media.id}></img>
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
    <video src="img/${actualPhotographer.name}/${media.video}" id=${media.id}></video>
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

function addEvents (mediaIMG, mediaVID, medias) {
  const tableauIMG = []
  medias.forEach((media) => {
    if ('image' in media) {
      tableauIMG[tableauIMG.length] = media
    }
  })
  mediaIMG.forEach((img) => img.addEventListener('click', (e) => {
    for (let index = 0; index < tableauIMG.length; index++) {
      const indexImage = parseInt(img.id)
      if (tableauIMG[index].id === indexImage) {
        const slider = document.querySelector('.slider')
        const main = document.querySelector('#second-page')
        const header = document.querySelector('header')
        slider.innerHTML = ''
        slider.style.display = 'flex'
        main.style.filter = 'blur(10px)'
        header.style.filter = 'blur(10px)'

        slider.innerHTML += `<div class='nav-btn prev-slide'></div>
        <div class='display'><img src=${img.src}></img></div>
        <p>${tableauIMG[index].title}</p>
        <div id="cross">X</div>
        <div class='nav-btn next-slide'></div>`
        const cross = document.querySelector('#cross')
        cross.addEventListener('click', (e) => {
          slider.style.display = 'none'
          main.style.filter = 'blur(0px)'
          header.style.filter = 'blur(0px)'
        })
      }
    }
  }))
  const tableauVID = []
  medias.forEach((media) => {
    if ('video' in media) {
      tableauVID[tableauVID.length] = media
    }
  })
  mediaVID.forEach((video) => video.addEventListener('click', (e) => {
    for (let index = 0; index < tableauVID.length; index++) {
      const indexVideo = parseInt(video.id)
      if (tableauVID[index].id === indexVideo) {
        const slider = document.querySelector('.slider')
        const main = document.querySelector('#second-page')
        const header = document.querySelector('header')
        slider.innerHTML = ''
        slider.style.display = 'flex'
        main.style.filter = 'blur(10px)'
        header.style.filter = 'blur(10px)'
        slider.innerHTML += `<div class='nav-btn prev-slide'></div>
        <div class='display'><video controls src=${video.src}></video></div>
        <p>${tableauVID[index].title}</p>
        <div id="cross">X</div>
        <div class='nav-btn next-slide'></div>`
        const cross = document.querySelector('#cross')
        cross.addEventListener('click', (e) => {
          slider.style.display = 'none'
          main.style.filter = 'blur(0px)'
          header.style.filter = 'blur(0px)'
        })
      }
    }
  }))
}

function displayMediasSortedBy (sort, medias, container, photographer) {
  switch (sort) {
    case 'Popularité':
      medias.sort((a, b) => b.likes - a.likes)
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
      })
      break
    case 'Titre':
      medias.sort((a, b) => a.title.localeCompare(b.title))
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
      })
      break

    case 'Date':
      medias.sort((a, b) => new Date(b.date) - new Date(a.date))
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
      })
      break

    default:
      medias.sort((a, b) => b.likes - a.likes)
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
      })
      break
  }
}

function displayPriceAndLikes (likes, photographer) {
  let totalLikes = 0
  const totalLikesElt = document.querySelector('#likes_and_price')
  likes.forEach((like) => {
    totalLikes = parseInt(like.innerText) + parseInt(totalLikes)
  })
  totalLikesElt.innerHTML += `<div><span>${totalLikes}</span>
  <i class="fas fa-heart"></i></div>
  <p>${photographer.price}€ /jour</p>`
}

function displayForm () {
  const button = document.querySelector('button')
  console.log(button)
  button.addEventListener('click', (e) => {
    const fondForm = document.querySelector('.fondForm')
    fondForm.innerHTML = `
     <form>
      <div>
          <label for="firstname">Prénom</label>
          <input type="text" id="name" name="user_name">
      </div>
      <div>
          <label for="lastname">Nom</label>
          <input type="text" id="name" name="user_name">
      </div>
     <div>
          <label for="email">E-mail</label>
          <input type="email" id="mail" name="user_mail">
      </div>
      <div>
          <label for="msg">Votre message</label>
          <textarea id="msg" name="user_message"></textarea>
      </div>
      <div class="buttonSubmit">
          <button type="submit">Envoyer</button>
      </div>
    </form>
    `
  })
}
