async function retriveContent (url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log('Une réponse ?', data)
    return data
  } catch (error) {
    console.log('Erreur de chargement du fichier !')
    console.error(error)
  }
}
function displaytags(photographers) {
  console.log('displaytags')
  const navElt = document.querySelector('nav')
  for (let index = 0; index < photographers.photographers.length; index++) {
    console.log(photographers.photographers[index])
    navElt.innerHTML += `<div class="tags"><div>${photographers.photographers[index].tags}</div></div>`
  }
  // Object.values(photographers).forEach(photographers, index => {
  //   console.log(photographers)
  //   navElt.innerHTML += `<div class="tags"><div>${photographers.name}</div></div>`
  // })
}

retriveContent('photographers.json')
  .then(photographers => { displaytags(photographers) })
  .catch(error => alert(error.message))
