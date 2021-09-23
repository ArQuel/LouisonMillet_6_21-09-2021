async function retriveContent (url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// function displayElements(photographers) {
//   console.log('displayElements')
//   const tableauPhotographers = []
//   for (let index = 0; index < photographers.photographers.length; index++) {
//     tableauPhotographers.push(photographers.photographers[index].tags)
//   } return tableauPhotographers
// }

function displaytags (photographers) {
  const tableauPhotographers = []
  for (let index = 0; index < photographers.photographers.length; index++) {
    tableauPhotographers.push(photographers.photographers[index].tags)
  }
  const navElt = document.querySelector('nav')
  let tableauTags = []
  for (let i = 0; i < tableauPhotographers.length; i++) {
    for (let j = 0; j < tableauPhotographers[i].length; j++) {
      tableauTags = tableauTags.concat(tableauPhotographers[j])
    }
  }
  const filteredArray = tableauTags.filter(function (ele, pos) {
    return tableauTags.indexOf(ele) === pos
  }
  )
  for (let k = 0; k < filteredArray.length; k++) {
    navElt.innerHTML += `<div class="tags"><div>#${filteredArray[k]}</div></div>`
  }
}

retriveContent('photographers.json')
  .then(photographers => { displaytags(photographers) })
  .catch(error => alert(error.message))
