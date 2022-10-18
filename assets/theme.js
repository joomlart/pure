(() => {
  let toogleSidebar = document.getElementById("data-sidebar")
  toogleSidebar.addEventListener("click", function(){
      event.preventDefault();
      event.stopPropagation();
      var element = document.getElementByClassName(".body");
      element.classList.add("open-mobile-sidebar");
      console.log("Sr");
  });
  // $doc.on('click', '[data-sidebar]', (event) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  
  //     $body.addClass('open-mobile-sidebar');
  //   console.log("Sr")
  // });
  
  // $doc.on('click', '[data-close-sidebar]', (event) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  
  //     $body.removeClass('open-mobile-sidebar');
  //     console.log("Sr")
  // });
  
  // $doc.on('click', (event) => {
  //     if($body.hasClass('open-mobile-sidebar')){
  //         if (($(event.target).closest('[data-sidebar]').length === 0) && ($(event.target).closest('#halo-sidebar').length === 0)) {
  //             $body.removeClass('open-mobile-sidebar');
  //         }
  //     }
  //       console.log("Sr")
  // });
})();

