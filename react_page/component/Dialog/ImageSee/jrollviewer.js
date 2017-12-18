/* global define, JRoll */
(function (window, document, JRoll) {
  'use strict'

  var w = window.innerWidth
  var h = window.innerHeight
  var ratio = w / h
  var currentIndex = 0
  var jrolls = []
  var pointers
  var length

  function createDiv (className) {
    var div = document.createElement('div')
    div.className = className
    return div
  }

  var JRollViewer = function (el, options) {
    var me = this

    me.el = typeof el === 'string' ? document.querySelector(el) : el

    me.el.addEventListener('click', function (e) {
      me._click(e)
    }, false)

    me.options = {
      JRoll: JRoll
    }

    for (var i in options) {
      me.options[i] = options[i]
    }

    me._init()
  }

  JRollViewer.version = '{{version}}'

  JRollViewer.prototype = {
    // 创建JRollViewer的jroll-style样式


    // 初始化图片查看框
    _init: function () {
      var me = this

      me.viewer = document.getElementById('jroll_viewer')

    },

  }

  // CommonJS/AMD/CMD规范导出JRoll_Viewer
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JRollViewer
  }
  if (typeof define === 'function') {
    define(function () {
      return JRollViewer
    })
  }
  window.JRollViewer = JRollViewer
})(window, document, JRoll)
