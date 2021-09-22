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
  console.log(photographers)
  const navElt = document.querySelector('nav')
  Object.values(photographers).forEach(photographers, index => {
    console.log(photographers)
    navElt.innerHTML += `<div class="tags"><div>${photographers[index].tags}</div></div>`
  })
}

retriveContent('photographers.json')
  .then(photographers => { displaytags(photographers) })
  .catch(error => alert(error.message))
