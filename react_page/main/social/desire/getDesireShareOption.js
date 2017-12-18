module.exports = function (desire) {
  if (!desire) {
    return {
      title: '说出你的愿望，拼架飞机一起游',
      content: '来一场说走就走的旅行！',
      href: '',
    }
  } else {
    return {
      title: `一部手机的价格拼机去${desire.city_name}`,
      content: `没去过${desire.city_name}，就相当于世界这本书，你只读了一页。`,
      href: desire.shareurl,
    }
  }
}