export default class Image {
  constructor (media, photographer) {
    this.id = media.id
    this.photographerId = media.photographerId
    this.title = media.title
    this.image = media.image
    this.tags = media.tags
    this.likes = media.likes
    this.date = media.date
    this.price = media.price
    this.imageUrl = `img/${photographer.name}/${media.image}`
  }

  displayInList () {
    return `<div class="card_media">
      <img src="${this.imageUrl}" id=${this.id} alt='${this.title} picture' tabindex="0"></img>
      <h4>${this.title}</h4>
      <div id='clickforlikes'>
      <span>${this.likes}</span>
      <i class="fas fa-heart" tabindex="0" aria-label="likes"></i>
      </div>
      </div>`
  }

  displayInLightBox () {
    return `<div class='nav-btn prev-slide' tabindex="0" aria-label="diapo précédente" id='prevSlide'></div>
      <div class='display'><img src="${this.imageUrl}"></div>
      <p>${this.title}</p>
      <div id="cross" tabindex="0" aria-label="fermer la diapo">X</div>
      <div class='nav-btn next-slide' tabindex="0" aria-label="diapo suivante" id='nextSlide'></div>`
  }

//   displayMedia (media, tableauMedias) {
//     const indexMedia = parseInt(media.id)
//     const index = tableauMedias.findIndex(elt => elt.id === indexMedia)
//     const elt = tableauMedias[index]
//     const slider = document.querySelector('.slider')
//     slider.innerHTML = ''
//     slider.style.display = 'flex'
//     slider.innerHTML += this.displayInLightBox()
//   }
}
