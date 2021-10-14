retriveContent('data.json')
  .then(data => {
    const photographerId = getPhotopgraherId()
    const photographer = data.photographers.find(elt => elt.id === photographerId)
    const medias = data.media.filter(elt => elt.photographerId === photographerId)
    displayDesc(photographer, medias)
    const mediaIMG = document.querySelectorAll('.medias img')
    const mediaVID = document.querySelectorAll('.medias video')
    addSlider(mediaIMG, mediaVID, medias, photographer)
    displayForm(photographer)
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
  <button id="buttonOpen">
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

function displayForm (photographer) {
  const buttonOpen = document.querySelector('#buttonOpen')
  const main = document.querySelector('main')
  const likesAndPrices = document.querySelector('#likes_and_price')
  const fondForm = document.querySelector('.fondForm')
  const contentbg = document.querySelector('.bgroundForm')
  buttonOpen.addEventListener('click', (e) => {
    contentbg.style.display = 'block'
    main.style.opacity = '0.5'
    likesAndPrices.style.filter = 'blur(5px)'
    main.style.filter = 'blur(5px)'
    fondForm.style.display = 'block'
    fondForm.innerHTML = `
     <form id="validation">
      <div>
          <h1>Contactez-moi</h1>
          <h2>${photographer.name}</h2>
          <label for="firstname">Prénom</label>
          <input type="text" id="user_firstname" name="user_firstname">
      </div>
      <div>
          <label for="lastname">Nom</label>
          <input type="text" id="user_lastname" name="user_lastname">
      </div>
     <div>
          <label for="email">E-mail</label>
          <input type="email" id="mail" name="user_mail">
      </div>
      <div>
          <label for="msg">Votre message</label>
          <textarea id="user_mail" name="user_message"></textarea>
      </div>
      <div id="crossForm">X</div>

      <div class="buttonSubmit">
          <button type="submit" id="#buttonSend">Envoyer</button>
      </div>
    </form>
    `
    const cross = document.querySelector('#crossForm')
    cross.addEventListener('click', (e) => {
      fondForm.style.display = 'none'
      main.style.opacity = '1'
      likesAndPrices.style.filter = 'blur(0px)'
      main.style.filter = 'blur(0px)'
      displayForm(photographer)
    })
    const verifFirst = false
    const verifLast = false
    const verifEmail = false
    const validation = document.querySelector('#validation')
    validation.addEventListener('submit', (e) => validate(e, verifFirst, verifLast, verifEmail))
  })
}

function checkTextInput (input) {
  const regText = /^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/gm
  let isOk = false
  if (regText.test(input.value) && input.value.length >= 2) {
    isOk = true
    return isOk
  }
  isOk = false
  alert('veuillez saisir au moins deux lettres dans votre nom et prénom')
  return isOk
}

function checkEmailInput (input) {
  const regEmail = /^[\w\-\+]+(\.[\w\-]+)*@[\w\-]+(\.[\w\-]+)*\.[\w\-]{2,4}$/
  const isOk = regEmail.test(input.value)
  if (!isOk || input.value === '') {
    return true
  } else {
    alert('Veuillez rentrer un mail correct')
  }
  return false
}

function reinitInputs () {
  document.querySelector("input[name='user_firstname']").value = ''
  document.querySelector("input[name='user_lastname']").value = ''
  document.querySelector("input[name='user_mail']").value = ''
  document.querySelector("textarea[name='user_message']").value = ''
}

function validateMessage () {
  const formulaire = document.querySelector('form')
  console.log(formulaire)
  formulaire.style.display = 'none'

  const valide = document.createElement('p')
  const contentbg = document.querySelector('.bgroundForm')
  const newWindow = document.createElement('div')
  contentbg.appendChild(newWindow)
  newWindow.appendChild(valide)
  newWindow.style.display = 'flex'
  valide.textContent = 'Message envoyé'
  valide.style.fontSize = '45px'
  valide.style.color = 'white'
  valide.style.fontWeight = 'bold'
  valide.style.display = 'block'
  const buttonBack = document.createElement('button')
  buttonBack.className = 'button'
  buttonBack.textContent = 'Retour'
  newWindow.appendChild(buttonBack)
  buttonBack.addEventListener('click', () => {
    const main = document.querySelector('main')
    const likesAndPrices = document.querySelector('#likes_and_price')
    const fondForm = document.querySelector('.fondForm')
    contentbg.style.display = 'none'
    fondForm.style.display = 'none'
    main.style.opacity = '1'
    likesAndPrices.style.filter = 'blur(0px)'
    main.style.filter = 'blur(0px)'
    newWindow.style.display = 'none'
  })
}

function validate (event, verifFirst, verifLast, verifEmail) {
  event.preventDefault()
  const firstName = document.querySelector('#user_firstname')
  const lastName = document.querySelector('#user_lastname')
  const email = document.querySelector('#user_mail')
  verifFirst = checkTextInput(firstName)
  verifLast = checkTextInput(lastName)
  verifEmail = checkEmailInput(email)
  if (verifFirst && verifLast && verifEmail) {
    reinitInputs()
    validateMessage()
  } else {
    alert("Erreur lors de l'envoi du message")
  }
}

// Display Slider

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
  const tableauMedias = tableauIMG.concat(tableauVID)
  const select = document.querySelector('select')
  trierSlider(select.value, tableauMedias)
  mediaIMG.forEach((img) => img.addEventListener('click', (e) => {
    displayIMG(img, tableauIMG)
    tableauMedias.forEach((index) => {
      if (index.id === parseInt(img.id)) {
        const position = tableauMedias.indexOf(index)
        addEventOnLayout(position, tableauMedias, photographer, slider)
      }
    })
  }))
  mediaVID.forEach((video) => video.addEventListener('click', (e) => {
    displayVID(video, tableauVID, tableauMedias)
    tableauMedias.forEach((index) => {
      if (index.id === parseInt(video.id)) {
        const position = tableauMedias.indexOf(index)
        addEventOnLayout(position, tableauMedias, photographer, slider)
      }
    })
  }))
}

function addEventOnLayout (position, tableauMedias, photographer, slider) {
  const next = document.querySelector('#nextSlide')
  next.addEventListener('click', (e) => {
    position = position + 1
    nextSlide(tableauMedias, position, photographer)
    addEventToClose(slider)
  })
  const prev = document.querySelector('#prevSlide')
  prev.addEventListener('click', (e) => {
    position = position - 1
    prevSlide(tableauMedias, position, photographer)
    addEventToClose(slider)
  })
}

function addEventToClose (slider) {
  const cross = document.querySelector('#cross')
  cross.addEventListener('click', (e) => {
    slider.style.display = 'none'
  })
}

function prevSlide (tableauMedias, position, photographer) {
  if (position >= 0) {
    if ('image' in tableauMedias[position]) {
      console.log(position)
      const slider = document.querySelector('.slider')
      slider.innerHTML = ''
      const lienPhoto = 'img/' + photographer.name + '/' + tableauMedias[position].image
      slider.style.display = 'flex'
      slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
          <div class='display'><img src="${lienPhoto}"></div>
          <p>${tableauMedias[position].title}</p>
          <div id="cross">X</div>
          <div class='nav-btn next-slide' id='nextSlide'></div>`
      addEventToClose(slider)
      addEventOnLayout(position, tableauMedias, photographer, slider)
    }
    if ('video' in tableauMedias[position]) {
      console.log(position)
      const slider = document.querySelector('.slider')
      slider.innerHTML = ''
      const lienVID = 'img/' + photographer.name + '/' + tableauMedias[position].video
      slider.style.display = 'flex'
      slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide'></div>
      <div class='display'><video controls src="${lienVID}"></video></div>
      <p>${tableauMedias[position].title}</p>
      <div id="cross">X</div>
      <div class='nav-btn next-slide' id='nextSlide'></div>`
      addEventToClose(slider)
      addEventOnLayout(position, tableauMedias, photographer, slider)
    }
  } else {
    console.log(position)
    position = tableauMedias.length - 1
    prevSlide(tableauMedias, position, photographer)
  }
}

function nextSlide (tableauMedias, position, photographer) {
  if (position < tableauMedias.length) {
    if ('image' in tableauMedias[position]) {
      console.log(position)
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
      console.log(position)
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
    console.log(position)
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
  addEventToClose(slider)
}

function displayVID (vid, tableauVID) {
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
  addEventToClose(slider)
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
