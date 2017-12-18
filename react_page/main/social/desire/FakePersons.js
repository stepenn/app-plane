function fetchContacts(onSuccess, onFailure, params) {
  setTimeout(() => {
    if (Math.random() > 0.05) {
      const contacts = makeContacts()
      onSuccess(0, '', contacts)
    } else {
      onFailure(-1, '获取失败')
    }
  }, 500)
}

function randomID() {
  return Math.random().toString(16).substr(2)
}

function randomNumberOfContacts() {
  if (Math.random() > 0.05) {
    return Math.floor(Math.random() * 30)
  } else {
    return Math.floor(Math.random() * 71) + 30
  }
}

function makeContacts() {
  const n = randomNumberOfContacts()
  const contacts = []
  for (let i = 0; i < n; i++) {
    const contact = makeContact()
    if (Math.random() < 0.5) {
      const children = []
      const n = randomNumberOfContacts()
      for (let i = 0; i < n; i++) {
        children.push(makeContact())
      }
      contact.children = children
    } else {

    }
    contacts.push(contact)
  }
  return contacts
}

function makeContact() {
  return {
    id: randomID(),
    avatar: '',
    nick_name: ''
  }
}

module.exports = {
  fetchContacts,
}