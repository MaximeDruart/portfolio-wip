// MOUSEFOLLOWER **************************************************************************************
let mouseFollower = document.querySelector(".mouseFollower")
let mfSize = 35
let images = document.querySelectorAll(".img")

document.addEventListener('mousemove', (event) => {
  mouseFollower.style.top = (event.clientY-(mfSize/2)) + "px"
  mouseFollower.style.left = (event.clientX-(mfSize/2)) + "px"
})
// MOUSEFOLLOWER **************************************************************************************



// HEADER **************************************************************************************
let isAboutActive = false
let tlAbout = new TimelineMax({paused:true})
document.querySelector(".about").addEventListener('click',function(){
  tlAbout.to(".about", 0.3, {borderLeft:"1px solid white"})
  tlAbout.to(".about_before", 0.3, {x:0},"-=0.3") // translation
  tlAbout.to(".about_before",0.3,{opacity:1},"-=0.2") // apparition du txt
  !isAboutActive ? (tlAbout.timeScale(1), tlAbout.play(), isAboutActive = true)
  : (tlAbout.timeScale(2), tlAbout.reverse(), isAboutActive = false)
})
document.querySelector('.siteName').addEventListener('click', () => {
  tl.reverse()
  openTl.reverse()
})
// HEADER **************************************************************************************



// ANIMATION TO MAIN SITE **************************************************************************************
let rt = document.querySelector(".roundTransform"), rtSize = 65
let rtDot = document.querySelector(".roundTransform .middleDot")
let rtDotSize  = 2, dotProgress, dotRegress

const items = document.querySelectorAll('.flex-wrapper .item')
let activePos = 2

function dotAffichage() {
  rtDot.style.width = rtDotSize + "px"
  rtDot.style.height = rtDotSize + "px"
}

let tl = new TimelineMax({paused:true})
tl.addLabel("sync", 0)
tl.addLabel("sync2", 1.5)
tl.to(rt, 0.6, {ease: Power1.easeOut, width:0, height:0}, "sync")
.to(rtDot, 0.6, {ease: Power1.easeOut, width:0, height:0}, "sync")
.to(rt, 0.6, {ease: Power1.easeOut, height:"100%", width:2, borderRadius:"0%", backgroundColor:"#111"})
.to(rt, 0.6, {ease: Power1.easeOut, width:"100%"},"+=0.15")
.to(mouseFollower, 0.3, {border:"1px solid #eee"}, "sync2")
.to(".middleDot", 0.3, {backgroundColor:"#eee"}, "sync2")
.to(".containerPage2", 0, {display:"block"}, "sync2")
.from(".roundScroll .item", 0.6, {ease:Power1.easeOut, width:0, height:0, onComplete: opacCheck()})
.from(".textbox span", 0.4, {ease:Power1.easeOut, opacity:0}, "-=0.2")

rt.addEventListener('mousedown', (event) => {
  clearInterval(dotRegress)
  dotProgress = setInterval(function() {
    if (rtDotSize >= rtSize) {
      clearInterval(dotProgress)
      setTimeout(() => {
        rtDotSize = 2
        dotAffichage()
      },150)
      tl.play()
    }
    rtDotSize++
    dotAffichage()
  },10)
})
rt.addEventListener('mouseup', (event) => {
  dotRegress = setInterval(function() {
    if (rtDotSize>2) {
      rtDotSize--
      dotAffichage()
    }
  },10)
  clearInterval(dotProgress)
})

rt.addEventListener('touchstart', (event) => {
  clearInterval(dotRegress)
  dotProgress = setInterval(function() {
    if (rtDotSize >= rtSize) {
      clearInterval(dotProgress)
      setTimeout(() => {
        rtDotSize = 2
        dotAffichage()
      },20)
      tl.play()
    }
    rtDotSize++
    dotAffichage()
  },10)
})
rt.addEventListener('touchend', (event) => {
  dotRegress = setInterval(function() {
    if (rtDotSize>2) {
      rtDotSize--
      dotAffichage()
    }
  },10)
  clearInterval(dotProgress)
})
// ANIMATION TO MAIN SITE **************************************************************************************




// BIG DOTS HELL YEAH **************************************************************************************
let bigDotActive = false


items.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    !bigDotActive ? TweenMax.to(item, 0.3, {scale:1.2}) :""
  })
  item.addEventListener('mouseleave', () => {
    !bigDotActive ? TweenMax.to(item, 0.3, {scale:1}) :""
  })
  item.addEventListener('click', () => {
    if (activePos == index) {
      !bigDotActive ? openItem(index, item) : ""
    } else if (activePos>index) {
      moveItems(-1)
    } else {
      moveItems(1)
    }
  })
})

function moveItems(value){
  let multiplier = 200 / items.length // 40 pour 5 items
  activePos = activePos + value
  let newPos = (-(multiplier/2)*activePos)+multiplier
  // en vrai je sais pas pourquoi mais c'est ca l'équation
  // pour aller vers la gauche on translate x en positif ???
  // le premier element est en x: -40% ???
  // mais bon c'est une histoire de 200% de largeur / 5 items = 40 %
  let posString = newPos + "%"
  TweenMax.to(".flex-wrapper",  0.4, {x:posString})
  opacCheck()
}


function opacCheck() {
  items.forEach((item, index) => {
    index != activePos ? TweenMax.to(item, 0.4, {opacity:0.7}) : TweenMax.to(item, 0.4, {opacity:1})
  })
}

let openTl
function openItem(index, item) {
  let sc = 4.75, w = window.innerWidth
  w<1700 ? sc+=0.5 : w<1200 ? sc+=1.5 : "" // to continue, too tired atm, screw mobile users
  let txtToClone = item.innerText,
    widthTC = item.firstElementChild.offsetWidth,
    heightTC = item.firstElementChild.offsetHeight
  bigDotActive = true
  openTl = new TimelineMax({paused:true})
    openTl.addLabel("sync")
    .set(".arrowBack", {display:"block"} )
    .to(item, 0.6, {scale:sc, zIndex:10}, "sync")
    .set(".containerPage2", {overflowY:"scroll"})
    .to(mouseFollower, 0.6, {border:"1px solid black"}, "sync")
    .to(".middleDot", 0.6, {backgroundColor:"black"}, "sync")
    .set(".roundScroll", {position:"absolute"})
    .set(".opening .textbox", {display:"flex", zIndex:15, width:widthTC, height:heightTC, scale:sc})
    .set(".opening .textbox span", {innerText:txtToClone})
    .to(".desc", 0.6, {y:"65%", zIndex:11})
  openTl.play()

}

document.querySelector('.arrowBack').addEventListener('click', () => {
  TweenMax.set(".arrowBack", {display:"none"} )
  openTl.reverse()
  bigDotActive = false
})
