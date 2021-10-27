import Image from './Image.class.js'
import Video from './Video.class.js'

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
  <h2>
      ${actualPhotographer.city}, ${actualPhotographer.country}
  </h2>
  <h3>
      ${actualPhotographer.tagline}
  </h3>
  <div class="tagsList">
  </div>
</div>
<div>
  <button id="buttonOpen" aria-label="Ouvrir le formulaire">
      Contactez-moi
  </button>
</div>
<div>
  <img src="${actualPhotographer.portrait}" alt="Photo de ${actualPhotographer.name}">
</div>`
  displayCardsTags(actualPhotographer)
  const photographerMedias = medias.filter(elt => elt.photographerId === actualPhotographer.id)
  const mediasElt = document.getElementsByClassName('medias')[0]
  photographerMedias.sort((a, b) => b.likes - a.likes)
  displayMediasSortedBy('Popularité', photographerMedias, mediasElt, actualPhotographer)
  document.querySelector('.select-selected').addEventListener('click', (e) => {
    const select = document.querySelectorAll('.select-selected')[0]
    displayMediasSortedBy(select.textContent, photographerMedias, mediasElt, actualPhotographer)
    const mediaIMG = document.querySelectorAll('img')
    const mediaVID = document.querySelectorAll('video')
    addSlider(mediaIMG, mediaVID, photographerMedias, actualPhotographer)
  })
  displayPriceAndLikes(actualPhotographer)
}

function factoryMedia (actualPhotographer, media, container) {
  const mediasElt = container
  const mediaObject = factory(media, actualPhotographer)
  mediasElt.innerHTML += mediaObject.displayInList()
}

function likesCount (photographer) {
  const likes = document.querySelectorAll('#clickforlikes')
  let isIncrement = false
  likes.forEach(elt => {
    elt.addEventListener('click', (e) => {
      const spanLikes = elt.querySelector('span')
      const mediaLikes = parseInt(spanLikes.textContent)
      if (isIncrement === false) {
        const incrementLikes = mediaLikes + 1
        spanLikes.textContent = incrementLikes
        isIncrement = true
      } else {
        const decrementLikes = mediaLikes - 1
        spanLikes.textContent = decrementLikes
        isIncrement = false
      }
      displayPriceAndLikes(photographer)
    })
    elt.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const spanLikes = elt.querySelector('span')
        const mediaLikes = parseInt(spanLikes.textContent)
        if (isIncrement === false) {
          const incrementLikes = mediaLikes + 1
          spanLikes.textContent = incrementLikes
          isIncrement = true
        } else {
          const decrementLikes = mediaLikes - 1
          spanLikes.textContent = decrementLikes
          isIncrement = false
        }
        displayPriceAndLikes(photographer)
      }
    })
  })
}

function displayCardsTags (photographer) {
  const photographHeader = document.getElementsByClassName('photograph-header')[0]
  const divElt = photographHeader.querySelector('.tagsList')
  for (let j = 0; j < photographer.tags.length; j++) {
    divElt.innerHTML += `    
        <span class="tags" tabindex="0" data-tag="${photographer.tags[j]}">
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
        likesCount(media, photographer)
      })
      break
    case 'Titre':
      medias.sort((a, b) => a.title.localeCompare(b.title))
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
        likesCount(media, photographer)
      })
      break

    case 'Date':
      medias.sort((a, b) => new Date(b.date) - new Date(a.date))
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
        likesCount(media, photographer)
      })
      break

    default:
      medias.sort((a, b) => b.likes - a.likes)
      container.innerHTML = ''
      medias.forEach(media => {
        factoryMedia(photographer, media, container)
        likesCount(media, photographer)
      })
      break
  }
}

function displayPriceAndLikes (photographer) {
  let totalLikes = 0
  const totalLikesElt = document.querySelector('#likes_and_price')
  const likes = document.querySelectorAll('#clickforlikes')
  likes.forEach(elt => {
    const spanLikes = elt.querySelector('span')
    const mediaLikes = parseInt(spanLikes.textContent)
    totalLikes = totalLikes + mediaLikes
  })
  totalLikesElt.innerHTML = ''
  totalLikesElt.innerHTML += `<div><span>${totalLikes}</span>
  <i class="fas fa-heart" tabindex="0" aria-label="likes"></i></div>
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
    fondForm.style.display = 'block'
    main.classList.add('blurred')
    fondForm.innerHTML = `
     <form id="validation">
     <div id="crossForm" tabindex="0" aria-label="fermer le formulaire">X</div>
      <div>
          <h1>Contactez-moi</h1>
          <h2>${photographer.name}</h2>
      </div>
      <div>
          <label for="user_firstname">Prénom</label>
          <input type="text" id="user_firstname" name="user_firstname" for="firstname">
      </div>
      <div>
          <label for="user_lastname">Nom</label>
          <input type="text" id="user_lastname" name="user_lastname">
      </div>
     <div>
          <label for="mail">E-mail</label>
          <input type="email" id="mail" name="user_mail">
      </div>
      <div>
          <label for="user_mail">Votre message</label>
          <textarea id="user_mail" name="user_message"></textarea>
      </div>

      <div class="buttonSubmit">
          <button type="submit" id="#buttonSend" aria-label="Envoyer le formulaire">Envoyer</button>
      </div>
    </form>
    `
    const firstFocusableElement = fondForm.querySelector('#crossForm')
    const lastFocusableElement = fondForm.querySelector('button')
    firstFocusableElement.focus()
    const cross = document.querySelector('#crossForm')
    cross.addEventListener('click', (e) => {
      fondForm.style.display = 'none'
      main.style.opacity = '1'
      likesAndPrices.style.filter = 'blur(0px)'
      main.classList.remove('blurred')
      contentbg.style.display = 'none'
    })
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        fondForm.style.display = 'none'
        main.style.opacity = '1'
        likesAndPrices.style.filter = 'blur(0px)'
        main.classList.remove('blurred')
        contentbg.style.display = 'none'
      }
    })
    console.log(firstFocusableElement, lastFocusableElement)
    document.addEventListener('keydown', function (e) {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus()
        e.preventDefault()
      }
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
  const regEmail = /^[\w\-\\+]+(\.[\w\\-]+)*@[\w\\-]+(\.[\w\\-]+)*\.[\w\\-]{2,4}$/
  const isOk = regEmail.test(input.value)
  if (!isOk || input.value === '') {
    alert('Veuillez rentrer un mail correct')
  } else {
    return true
  }
}

function reinitInputs () {
  document.querySelector("input[name='user_firstname']").value = ''
  document.querySelector("input[name='user_lastname']").value = ''
  document.querySelector("input[name='user_mail']").value = ''
  document.querySelector("textarea[name='user_message']").value = ''
}

function validateMessage () {
  const formulaire = document.querySelector('form')
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
  const email = document.querySelector('#mail')
  verifFirst = checkTextInput(firstName)
  verifLast = checkTextInput(lastName)
  verifEmail = checkEmailInput(email)
  if (verifFirst && verifLast && verifEmail) {
    console.log('Prénom : ' + firstName.value, 'Nom : ' + lastName.value, 'email : ' + email.value)
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
  // const main = document.querySelector('main')
  // const header = document.querySelector('header')
  // header.setAttribute('aria-hidden', 'true')
  // main.setAttribute('aria-hidden', 'true')
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
        const buttonOpen = document.querySelector('#buttonOpen')
        buttonOpen.style.display = 'none'
      }
    })
  }))
  mediaVID.forEach((video) => video.addEventListener('click', (e) => {
    displayVID(video, tableauVID, tableauMedias)
    tableauMedias.forEach((index) => {
      if (index.id === parseInt(video.id)) {
        const position = tableauMedias.indexOf(index)
        addEventOnLayout(position, tableauMedias, photographer, slider)
        const buttonOpen = document.querySelector('#buttonOpen')
        buttonOpen.style.display = 'none'
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
  next.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      position = position + 1
      nextSlide(tableauMedias, position, photographer)
      addEventToClose(slider)
    }
  })
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
      position = position + 1
      nextSlide(tableauMedias, position, photographer)
      addEventToClose(slider)
    }
  })
  const prev = document.querySelector('#prevSlide')
  prev.addEventListener('click', (e) => {
    position = position - 1
    prevSlide(tableauMedias, position, photographer)
    addEventToClose(slider)
  })
  prev.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      position = position - 1
      prevSlide(tableauMedias, position, photographer)
      addEventToClose(slider)
    }
  })
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
      position = position - 1
      prevSlide(tableauMedias, position, photographer)
      addEventToClose(slider)
    }
  })
  const firstFocusableElement = slider.querySelectorAll('div')[0]
  const focusableContent = slider.querySelectorAll('div')
  const lastFocusableElement = focusableContent[focusableContent.length - 1]
  console.log(firstFocusableElement, lastFocusableElement)
  document.addEventListener('keydown', function (e) {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus()
      e.preventDefault()
    }
  })
}

function addEventToClose (slider) {
  const cross = document.querySelector('#cross')
  const buttonOpen = document.querySelector('#buttonOpen')
  cross.addEventListener('click', (e) => {
    slider.style.display = 'none'
    buttonOpen.style.display = 'block'
  })
  cross.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      slider.style.display = 'none'
      buttonOpen.style.display = 'block'
    }
  })
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      slider.style.display = 'none'
      buttonOpen.style.display = 'block'
    }
  })
}

function prevSlide (tableauMedias, position, photographer) {
  if (position >= 0) {
    displayLightBoxContent(tableauMedias, position, photographer)
  } else {
    position = tableauMedias.length - 1
    prevSlide(tableauMedias, position, photographer)
  }
}

function nextSlide (tableauMedias, position, photographer) {
  if (position < tableauMedias.length) {
    displayLightBoxContent(tableauMedias, position, photographer)
  } else {
    position = 0
    nextSlide(tableauMedias, position, photographer)
  }
}

function displayLightBoxContent (tableauMedias, position, photographer) {
  const slider = document.querySelector('.slider')
  slider.innerHTML = ''
  const media = factory(tableauMedias[position], photographer)
  slider.style.display = 'flex'
  slider.innerHTML += media.displayInLightBox()
  addEventOnLayout(position, tableauMedias, photographer, slider)
}

function displayIMG (img, tableauIMG) {
  const indexImage = parseInt(img.id)
  const index = tableauIMG.findIndex(elt => elt.id === indexImage)
  const image = tableauIMG[index]
  const slider = document.querySelector('.slider')
  slider.innerHTML = ''
  slider.style.display = 'flex'
  slider.innerHTML += `<div class='nav-btn prev-slide' tabindex="0" id='prevSlide'></div>
        <div class='display'><img src="${img.src}" alt='${image.title} picture' tabindex="0"></img></div>
        <p>${image.title}</p>
        <div id="cross" tabindex="0">X</div>
        <div class='nav-btn next-slide' tabindex="0" id='nextSlide'></div>`
  addEventToClose(slider)
}

function displayVID (vid, tableauVID) {
  const indexVideo = parseInt(vid.id)
  const index = tableauVID.findIndex(elt => elt.id === indexVideo)
  const video = tableauVID[index]
  const slider = document.querySelector('.slider')
  slider.innerHTML = ''
  slider.style.display = 'flex'
  slider.innerHTML += `<div class='nav-btn prev-slide' id='prevSlide' tabindex="0"></div>
        <div class='display'><video controls src="${vid.src}" alt='${video.title} video' tabindex="0"></video></div>
        <p>${video.title}</p>
        <div id="cross" tabindex="0">X</div>
        <div class='nav-btn next-slide' tabindex="0" id='nextSlide'></div>`
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

/* Chercher les éléments avec custom-select */
let i
let j
let ll
let selElmnt
let a, b, c
const x = document.getElementsByClassName('custom-select')
const l = x.length
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName('select')[0]
  ll = selElmnt.length
  /* Pour chaque élément créer une nouvelle div qui agira comme un élément select et lui ajouter les attributs d'accessibilité */
  a = document.createElement('DIV')
  a.setAttribute('class', 'select-selected')
  a.setAttribute('id', 'select-selected')
  a.setAttribute('role', 'button')
  a.setAttribute('aria-haspopup', 'listbox')
  a.setAttribute('aria-expanded', 'false')

  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML
  x[i].appendChild(a)
  /* Pour chaque élément créer une nouvelle div qui contiendra la liste des options */
  b = document.createElement('DIV')
  b.setAttribute('class', 'select-items select-hide')

  for (j = 1; j < ll; j++) {
    /* Pour chaque option dans l'élément select original, crée une nouvelle div qui agira comme une option */
    c = document.createElement('DIV')
    c.setAttribute('tabindex', 0)
    c.innerHTML = selElmnt.options[j].innerHTML
    c.addEventListener('click', function (e) {
      /* Quand un élément est cliqué, met à jour */
      let y
      let i
      let k
      let yl
      const s = this.parentNode.parentNode.getElementsByTagName('select')[0]
      const sl = s.length
      const h = this.parentNode.previousSibling
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML === this.innerHTML) {
          s.selectedIndex = i
          h.innerHTML = this.innerHTML
          y = this.parentNode.getElementsByClassName('same-as-selected')
          yl = y.length
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute('class')
          }
          this.setAttribute('class', 'same-as-selected')
          break
        }
      }
      h.click()
    })
    b.appendChild(c)
  }
  x[i].appendChild(b)
  a.addEventListener('click', function (e) {
    /* Quand le select est cliqué, ferme tous les autres select et ouvre/ferme celle actuelle */
    e.stopPropagation()
    closeAllSelect(this)
    a.setAttribute('aria-expanded', 'true')
    this.nextSibling.classList.toggle('select-hide')
    this.classList.toggle('select-arrow-active')
  })
  a.addEventListener('keyup', function (e) {
    /* Quand on appuie sur Enter, ferme tous les autres select et ouvre/ferme celle actuelle */
    if (e.key === 'Enter') {
      closeAllSelect(this)
      a.setAttribute('aria-expanded', 'true')
      this.nextSibling.classList.toggle('select-hide')
      this.classList.toggle('select-arrow-active')
    }
  })
}

function closeAllSelect (elmnt) {
  /* Fonction qui va fermer toutes les select box sauf l'actuelle */
  let i
  const arrNo = []
  const x = document.getElementsByClassName('select-items')
  const y = document.getElementsByClassName('select-selected')
  const xl = x.length
  const yl = y.length
  for (i = 0; i < yl; i++) {
    if (elmnt === y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove('select-arrow-active')
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add('select-hide')
    }
  }
}

/* Si l'utilisateur clique partout, ferme la selectbox */
document.addEventListener('click', closeAllSelect)

function factory (media, photographer) {
  if ('image' in media) {
    return new Image(media, photographer)
  } else if ('video' in media) {
    return new Video(media, photographer)
  }
  return undefined
}
