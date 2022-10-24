// Slide-down Slide-up   
let slideUp = (target, duration=500) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
    //alert("!");
  }, duration);
}

let slideDown = (target, duration=500) => {
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;

  if (display === 'none')
    display = 'block';

  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}
let slideToggle = (target, duration = 500) => {
rotateIcon.classList.add("cate-btn-slide-up");
if (window.getComputedStyle(target).display === 'none') {
  rotateIcon.classList.remove("cate-btn-slide-up");
  return slideDown(target, duration);
} else {
  return slideUp(target, duration);
}
}

let slideToggle2 = (target, duration = 500) => {
  rotateIcon2.classList.add("recent-btn-slide-up");
  if (window.getComputedStyle(target).display === 'none') {
    rotateIcon2.classList.remove("recent-btn-slide-up");
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

let slideToggle3 = (target, duration = 500) => {
  rotateIcon3.classList.add("tags-btn-slide-up");
  if (window.getComputedStyle(target).display === 'none') {
    rotateIcon3.classList.remove("tags-btn-slide-up");
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

/////
let speedAnimation = 400;
let targetId = document.getElementById("target");
let targetId2 = document.getElementById("target2");
let targetId3 = document.getElementById("target3");

let rotateIcon = document.querySelector('.blog-categories .btn-slide-down');
let rotateIcon2 = document.querySelector('.lastest-posts .btn-slide-down');
let rotateIcon3 = document.querySelector('.list-tag .btn-slide-down');

let slideBtnClick = (id, sl) => document.getElementById(id).addEventListener('click', () => sl(targetId, speedAnimation));
let slideBtnClick2 = (id, sl) => document.getElementById(id).addEventListener('click', () => sl(targetId2, speedAnimation));
let slideBtnClick3 = (id, sl) => document.getElementById(id).addEventListener('click', () => sl(targetId3, speedAnimation));

slideBtnClick('toggle-category', slideToggle);
slideBtnClick2('toggle-recent-post', slideToggle2);
slideBtnClick3('toggle-tags', slideToggle3);

