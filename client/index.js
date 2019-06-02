const card = post => {
  return `
    <li class="collection-item avatar view" data-id="${post._id}" id="forData">
      <a class="modal-trigger view" href="#veiwPerson" style="color: #000000" data-id="${post._id}">
        <span class="title view" data-id="${post._id}"><b>${post.title} ${post.text}</b></span> <br>
        <p class="view" data-id="${post._id}">${post.about}</p>
        <small class="view" data-id="${post._id}">${new Date(post.date).toLocaleDateString()}</small> <br>
      </a>
      <button class="btn btn-small red js-remove" data-id="${post._id}">
        <i class="material-icons js-remove" data-id="${post._id}">delete</i>
      </button>
    </li>
  `
}

const info = person => {
  return `
  <h4 data-id="${person._id}">${person.title} ${person.text}</h4>
  <p data-id="${person._id}">Recorded in: ${new Date(person.date).toLocaleDateString()}</p>
  `
}

const addDays = person => {
  return `
  <p data-id="${person._id}">Add vacation days</p>
  <button class="btn btn-small green setData modal-trigger" data-id="${person._id}" data-target="setDays">
    <i class="material-icons setData" data-id="${person._id}">add</i>
  </button>
  `
}

const haveDays = vacantion => {
  return `
  <p>Your have ${vacantion.amount} vacation days<p>
  <p>Yor vacantion started in: ${new Date(vacantion.beginDate).toLocaleDateString()}</p>
  <p>Remove vacation days</p>
  <button class="btn btn-small red removeData" data-id="${vacantion._id}">
    <i class="material-icons removeData" data-id="${vacantion._id}">delete</i>
  </button>
  `
}

let posts = [], vacantions = []
let modal, modal2, modal3
const BASE_URL = '/api/post'
const URL = '/vacantion'

class VacantionApi {
  static fetch() {
    return fetch(URL, {method: 'get'}).then(res => res.json())
  }
  static create(vacantion) {
    return fetch(URL, {
      method: 'post',
      body: JSON.stringify(vacantion),
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static remove(id) {
    return fetch(`${URL}/${id}`, {
      method: 'delete'
    }).then(res => res.json())
  }
}

class PostApi {
  static fetch() {
    return fetch(BASE_URL, {method: 'get'}).then(res => res.json())
  }

  static create(post) {
    return fetch(BASE_URL, {
      method: 'post',
      body: JSON.stringify(post),
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  }

  static remove(id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: 'delete'
    }).then(res => res.json())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  PostApi.fetch().then(backendPosts => {
    posts = backendPosts.concat()
    renderPosts(posts)
  })
  VacantionApi.fetch().then(backendVacantion => {
    vacantions = backendVacantion.concat()
  })

  modal = M.Modal.init(document.querySelector('.modal'))
  modal2 = M.Modal.init(document.querySelector('.modal-fixed-footer'))
  modal3 = M.Modal.init(document.querySelector('.modal1'))

  document.querySelector('#createPost').addEventListener('click', onCreatePost)
  document.querySelector('#posts').addEventListener('click', onDeletePost)
  document.querySelector('#posts').addEventListener('click', onOpenModal)
  document.querySelector('#vacantions').addEventListener('click', onDeleteVacantions)
  document.querySelector('#setDays').addEventListener('click', onSetDay)
})

function renderPosts(_posts = []){
  const $posts = document.querySelector('#posts')

  if (_posts.length > 0) {
    $posts.innerHTML = _posts.map(post => card(post)).join(' ')
  } else {
    $posts.innerHTML = `<div class="center">Empty yet</div>`
  }
}

function onCreatePost() {
  const $title = document.querySelector('#title')
  const $text = document.querySelector('#text')
  const $about = document.querySelector('#about')

  if ($title.value && $text.value) {
    const newPost = {
      title: $title.value,
      text: $text.value,
      about: $about.value,
    }
    PostApi.create(newPost).then(post => {
      posts.push(post)
      renderPosts(posts)
    })
    modal.close()
    $title.value = ''
    $text.value = ''
    $about.value = ''
    M.updateTextFields()
  }
}

function onDeletePost(event) {
  if (event.target.classList.contains('js-remove')) {
    const decision = confirm('Are you really want do this?')

    if (decision) {
      const id = event.target.getAttribute('data-id')

      PostApi.remove(id).then(() => {
        const postIndex = posts.findIndex(post => post._id === id)
        posts.splice(postIndex, 1)
        renderPosts(posts)
      })
    }
  }
}
let dataId
function onOpenModal(event) {
  if (event.target.classList.contains('view')) {
    const $person = document.querySelector('#information')
    const id = event.target.getAttribute('data-id')
    dataId = id
    const onePerson = posts.find(post => post._id === id)
    $person.innerHTML = info(onePerson)
    renderVacantions()
  }
}

function findAll($vacantions, id, person){
  let find = vacantions.find(vacantion => vacantion.personId === id)
  if(find){
    return haveDays(find)
  }else {
    return addDays(person)
  }
}

function renderVacantions(_vacantions = []) {

  const $person = document.querySelector('#information')
  const id = event.target.getAttribute('data-id')
  const onePerson = posts.find(post => post._id === id)
  const $vacantions = document.querySelector('#vacantions')
  if(vacantions.length > 0){
    $vacantions.innerHTML = findAll($vacantions, id, onePerson)
  } else {
    $vacantions.innerHTML = addDays(onePerson)
  }
}

function onSetDay(event) {
  if (event.target.classList.contains('configmDates')) {
    const $amount = document.querySelector('#amount')
    const $beginDate = document.querySelector('#vacation')
    const id = dataId
    if($amount && $beginDate){
      const newVacantion = {
        personId: id,
        amount: $amount.value,
        beginDate: $beginDate.value
      }
      VacantionApi.create(newVacantion).then(vacantion => {
        vacantions.push(vacantion)
      })

    }

    modal2.close()
    modal3.close()
    $amount.value = ''
    $beginDate.value = ''
    M.updateTextFields()

    location.reload()
  }
}

function onDeleteVacantions(event){
  if (event.target.classList.contains('removeData')){
    const decision = confirm('You sure about this?')

    if(confirm){
      const id = event.target.getAttribute('data-id')

      VacantionApi.remove(id).then(() => location.reload())
    }
  }
}
