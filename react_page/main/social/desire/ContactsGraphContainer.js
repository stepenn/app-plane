import React, {Component} from 'react'
import Help from '../../../help/Help.js';
import ContactsGraphPainter from './ContactsGraphPainter'
import css from './ContactsGraph.less'
import Toast from '../../../component/Toast'
import HttpTool from '../../../http/HttpTool'
import Loading from '../../../component/Dialog/Loading'
import {API_GET_USER_CONTACTS, API_GET_JOIN_LIST} from '../../../http/APIYHJ'
import shallowCompare from 'react/lib/shallowCompare'

class ContactsGraphContainer extends Component {
  constructor(props) {
    super(props)
    this.helper = new Help()
    this.state = {
      master: null,
      slaves: [],
      parents: [],
      backward: false,
    }
    this.data = {
      relationship: {},
      persons: {
        [props.start.id]: Object.assign({}, props.start)
      },
    }
    this.MAX_PARENTS = 3
    this.nextContacts = this.nextContacts.bind(this)
    this.prevContacts = this.prevContacts.bind(this)
    this.viewProfile = this.viewProfile.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidMount() {
    this.getContacts(this.props.start.id, (contacts) => {
      this.setState({
        master: this.data.persons[this.props.start.id],
        slaves: contacts,
        backward: false,
      })
    })
  }

  getContacts(userId, onData) {
    const contacts = this.getCachedContacts(userId)
    if (contacts) {
      onData(contacts)
    } else {
      this.fetchContacts(userId, onData)
    }
  }

  getCachedContacts(userId) {
    const ids = this.data.relationship[userId]
    if (ids) {
      return ids.map(id => this.data.persons[id])
    } else {
      return null
    }
  }

  fetchContacts(userId, onData) {
    const onSuccess = (code, msg, json) => {
      Loading.show(false)
      this.cacheData(userId, json)
      onData(this.getCachedContacts(userId))
    }
    const onFailure = (code, msg) => {
      Loading.show(false)
      Toast.showToast(msg)
    }
    Loading.show(true)
    // HttpTool.post(API_GET_USER_CONTACTS, onSuccess, onFailure, {id: userId})
    HttpTool.post(API_GET_JOIN_LIST, onSuccess, onFailure, {id: this.props.desireId})
  }

  cacheData(userId, data) {
    const {relationship, persons} = this.data
    relationship[userId] = []
    for (let i = 0; i < data.length; i++) {
      const contact = data[i]
      if (userId !== contact.id) {
        relationship[userId].push(contact.id)
      }
      if (!persons.hasOwnProperty(contact.id)) {
        persons[contact.id] = {
          id: contact.id,
          avatar: contact.avatar,
          nickname: contact.nick_name,
        }
      }
      if (contact.children) {
        this.cacheData(contact.id, contact.children)
      }
    }
  }

  nextContacts(slave) {
    this.getContacts(slave.id, (contacts) => {
      this.setState({
        master: slave,
        slaves: contacts,
        parents: [...this.state.parents, this.state.master],
        backward: false,
      })
    })
  }

  prevContacts(parent) {
    let index = -1
    this.state.parents.forEach((p, i) => {
      if (p.id === parent.id) {
        index = i
      }
    })
    const parents = this.state.parents.slice(0, index)
    this.getContacts(parent.id, (contacts) => {
      this.setState({
        master: parent,
        slaves: contacts,
        parents: parents,
        backward: true,
      })
    })
  }

  viewProfile(person) {
    const userId = person.id
    this.props.openProfile(userId)
  }

  count() {
    let total = 0
    for (let p in this.data.persons) {
      total++
    }
    return total
  }

  render() {
    const count = this.count()
    return (
      <div className={css['contacts-container']}>
        {
          count && <div className={css['total-number']}>当前已有{count}人加入</div>
        }
        {
          this.state.master &&
          <ContactsGraphPainter
            master={this.state.master}
            slaves={this.state.slaves}
            parents={this.state.parents.slice(-this.MAX_PARENTS)}
            nextContacts={this.nextContacts}
            prevContacts={this.prevContacts}
            viewProfile={this.viewProfile}
            backward={this.state.backward}
          />
        }
      </div>
    )
  }
}

module.exports = ContactsGraphContainer