retriveContent('data.json')
  .then(data => {
    const photographerId = getPhotopgraherId()
    const photographer = data.photographers.find(elt => elt.id === photographerId)
    const medias = data.media.filter(elt => elt.photographerId === photographerId)
    displayDesc(photographer, medias)
    const mediaIMG = document.querySelectorAll('.medias img')
    const mediaVID = document.querySelectorAll('.medias video')
    addSlider(mediaIMG, mediaVID, medias, photographer)
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

function getPhotopgraherId () {
  const query = window.location.search
  const urlParams = new URLSearchParams(query)
  return parseInt(urlParams.get('id'))
}

function displayDesc (actualPhotographer, medias) {
  const photographHeader = document.getElementsByClassName('photograph-header')[0]
  photographHeader.innerHTML += `<div>
  <h1>
      ${actualPhotographer.name}
  </h1>
  <p>
      ${actualPhotographer.city}, ${actualPhotographer.country}
  </p>
  <p>
      ${actualPhotographer.tagline}
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
  <img src="${actualPhotographer.portrait}">
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
    addSlider(mediaIMG, mediaVID, medias, photographerMedias, actualPhotographer)
  })
  const likes = document.querySelectorAll('.medias .card_media span')
  displayPriceAndLikes(likes, actualPhotographer)
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

function addSlider (mediaIMG, mediaVID, medias, photographer) {
  const slider = document.querySelector('.slider')
  const tableauIMG = []

  medias.forEach((media) => {
    if ('image' in media) {
      tableauIMG[tableauIMG.length] = media
    }
  })
  const tableauVID = []
  medias.forEach((media) => {
    if ('video' in media) {
      tableauVID[tableauVID.length] = media
    }
  })

  // Trier tableau des medias pour slider

  const tableauMedias = tableauIMG.concat(tableauVID)
  const select = document.querySelector('select')
  trierSlider(select.value, tableauMedias)

  // imgforeach

  mediaIMG.forEach((img) => img.addEventListener('click', (e) => {
    displayIMG(img, tableauIMG)
    tableauMedias.forEach((index) => {
      if (index.id === parseInt(img.id)) {
        let position = tableauMedias.indexOf(index)
        position = addEventOnLayout(position, tableauMedias, photographer, slider)
      }
    })
  }))

  // vidforeach

  mediaVID.forEach((video) => video.addEventListener('click', (e) => {
    tableauMedias.push(video)
    displayVID(video, tableauVID, tableauMedias)
    tableauMedias.forEach((index) => {
      if (index.id === parseInt(video.id)) {
        let position = tableauMedias.indexOf(index)
        position = addEventOnLayout(position, tableauMedias, photographer, slider)
      }
    })
  }))
}

function addEventOnLayout (position, tableauMedias, photographer, slider) {
  const next = document.querySelector('#nextSlide')
  next.addEventListener('click', (e) => {
    position = position + 1
    nextSlide(tableauMedias, position, photographer)
    const cross = document.querySelector('#cross')
    cross.addEventListener('click', (e) => {
      slider.style.display = 'none'
    })
  })
  const prev = document.querySelector('#prevSlide')
  prev.addEventListener('click', (e) => {
    position = position - 1
    prevSlide(tableauMedias, position, photographer)
    const cross = document.querySelector('#cross')
    cross.addEventListener('click', (e) => {
      slider.style.display = 'none'
    })
  })
  return position
}

function prevSlide (tableauMedias, position, photographer) {
  if (position >= 0) {
    if ('image' in tableauMedias[position]) {
      const slider = document.querySelector('.slider')
      slider.innerHTML = ''
      const lienPhoto = 'img/' + photographer.name + '/' + tableauMedias[position].image
      slider.style.display = 'flex'
      slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
          <div class='display'><img src="${lienPhoto}"></div>
          <p>${tableauMedias[position].title}</p>
          <div id="cross">X</div>
          <div class='nav-btn next-slide' id='nextSlide'></div>`
      addEventOnLayout(position, tableauMedias, photographer, slider)
    }
    if ('video' in tableauMedias[position]) {
      const slider = document.querySelector('.slider')
      slider.innerHTML = ''
      const lienVID = 'img/' + photographer.name + '/' + tableauMedias[position].video
      slider.style.display = 'flex'
      slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
      <div class='display'><video controls src="${lienVID}"></video></div>
      <p>${tableauMedias[position].title}</p>
      <div id="cross">X</div>
      <div class='nav-btn next-slide' id='nextSlide'></div>`
      addEventOnLayout(position, tableauMedias, photographer, slider)
    }
  } else {
    position = tableauMedias.length - 1
    prevSlide(tableauMedias, position, photographer)
  }
}

function nextSlide (tableauMedias, position, photographer) {
  if (position < tableauMedias.length) {
    if ('image' in tableauMedias[position]) {
      const slider = document.querySelector('.slider')
      slider.innerHTML = ''
      const lienPhoto = 'img/' + photographer.name + '/' + tableauMedias[position].image
      slider.style.display = 'flex'
      slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
          <div class='display'><img src="${lienPhoto}"></div>
          <p>${tableauMedias[position].title}</p>
          <div id="cross">X</div>
          <div class='nav-btn next-slide' id='nextSlide'></div>`
      addEventOnLayout(position, tableauMedias, photographer, slider)
    }
    if ('video' in tableauMedias[position]) {
      const slider = document.querySelector('.slider')
      slider.innerHTML = ''
      const lienVID = 'img/' + photographer.name + '/' + tableauMedias[position].video
      slider.style.display = 'flex'
      slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
      <div class='display'><video controls src="${lienVID}"></video></div>
      <p>${tableauMedias[position].title}</p>
      <div id="cross">X</div>
      <div class='nav-btn next-slide' id='nextSlide'></div>`
      addEventOnLayout(position, tableauMedias, photographer, slider)
    }
  } else {
    position = 0
    nextSlide(tableauMedias, position, photographer)
  }
}

function displayIMG (img, tableauIMG) {
  const indexImage = parseInt(img.id)
  const index = tableauIMG.findIndex(elt => elt.id === indexImage)
  const image = tableauIMG[index]
  const slider = document.querySelector('.slider')
  slider.innerHTML = ''
  slider.style.display = 'flex'
  slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
        <div class='display'><img src="${img.src}"></img></div>
        <p>${image.title}</p>
        <div id="cross">X</div>
        <div class='nav-btn next-slide' id='nextSlide'></div>`
}

function displayVID (vid, tableauVID, tableauMedias) {
  const indexVideo = parseInt(vid.id)
  const index = tableauVID.findIndex(elt => elt.id === indexVideo)
  const video = tableauVID[index]
  const slider = document.querySelector('.slider')
  slider.innerHTML = ''
  slider.style.display = 'flex'
  slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
        <div class='display'><video controls src="${vid.src}"></video></div>
        <p>${video.title}</p>
        <div id="cross">X</div>
        <div class='nav-btn next-slide' id='nextSlide'></div>`
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

function trierSlider (sort, medias) {
  switch (sort) {
    case 'Popularité':
      medias.sort((a, b) => b.likes - a.likes)
      break

    case 'Titre':
      medias.sort((a, b) => a.title.localeCompare(b.title))
      break

    case 'Date':
      medias.sort((a, b) => new Date(b.date) - new Date(a.date))
      break

    default:
      medias.sort((a, b) => b.likes - a.likes)
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
