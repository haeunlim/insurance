$(document).ready(function(){
 
  var $header = $('#header');
  var $menu = $('#gnb .menu-01 > li > a');
  // var $moMenu = $('.mo-menu .menu-box .menu > li > a');

  $menu.on('mouseover',function(){
      $header.addClass('on');
  });

  $menu.on("focusin", function(e){
    e.preventDefault();
    $header.addClass('on');
  });

  $(".dep2").find('a').last().focusout(function(){
      $header.removeClass('on');
  });  

  $('#header').on('mouseleave',function(){
      $header.removeClass('on');
  });


  // $(".sitemap-btn").on("click", function(e){
  //     e.preventDefault();
  //     $('#sitemap-wrap').addClass('on');
  // });

  // $(".sitemap-close").on("click", function(e){
  //     e.preventDefault();
  //     $('#sitemap-wrap').removeClass('on');
  // });


  // var moWarp = $(".mo-gnb");
  // $(".mo-menu").on("click", function (e) {
  //     e.preventDefault();
  //     moWarp.addClass("action");
  //     $('body').addClass('action');
  //     $(".back-bg").addClass('action');
  // });

  // $(".mo-close").on("click", function (e) {
  //     e.preventDefault();
  //     moWarp.removeClass("action");
  //     $('body').removeClass('action');
  //     $(".back-bg").removeClass('action');
  // });

  // $(".mo-menu-list > li > a").on("click", function (e) {
  //     e.preventDefault();

  //     $(".mo-menu-list > li").removeClass("active");
  //     $(this).parent().addClass("active");


  // });

  // $('.mo-menu-list > li').each(function() {
  //     $(this).find('.mo-snb1').children('li').each(function(i) {
  //         $(this).css("transition-delay",i*10/100+"s");
  //     });
  // });

  


  $(window).on("resize", function(){
      $header.removeClass("on");
      $('#sitemap-wrap').removeClass('on');
      $('body').removeClass('action');
      $(".mo-gnb").removeClass("action");
      $(".back-bg").removeClass('action');
  });


  // accordionMenu(".mo-snb1 > li", ".mo-snb1 > li.open");



  // $moMenu.on('click',function(e){
  //     e.preventDefault();
  //     if($(this).hasClass('active')){
  //         $moMenu.removeClass('active').siblings('.menu-02').stop().slideUp();
  //     }else{
  //         $moMenu.removeClass('active').siblings('.menu-02').stop().slideUp();
  //         $(this).addClass('active').siblings('.menu-02').stop().slideDown();
  //     }
  // });




});






function accordionMenu(selecter, active) {

  var $selecter = null;
  var $active = null;

  function start() {

      init();
      initEvent();
      initActive();
  }
  function init() {
      $selecter = $(selecter);
      $active = $(active);

      $selecter.each(function(index){
          if($(this).find("ul > li").length > 0){
              $(this).addClass("find");
          }
      });
  }
  function initEvent() {
      $selecter.on('click', function (e) {
          if ($(this).find('ul > li').length != 0) {
              e.preventDefault();
              setSeleterItem($(this));
          }
      });
      $selecter.find("ul > li").on('click', function (e) {
          e.stopPropagation();
      });

  }
  function setSeleterItem(seleter) {
      var $item = seleter.find("ul");




      $selecter.find("ul").slideUp();
      $selecter.removeClass("open");

      if ($item.css("display") == "none") {
          seleter.addClass("open");
          $item.slideDown("slow");
      } else {
          seleter.removeClass("open");
          $item.slideUp("slow");
      }
  }
  function initActive() {
      if ($selecter.hasClass("open") == true) {
          $active.find("ul").slideDown();
      };
  }
  start();
};