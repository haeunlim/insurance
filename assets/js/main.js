$(document).ready(function () {
  $("#header").addClass("main_header");

  Main.init();
});

var Main = {
  init: function (e) {
    Main.mainVisual();
    Main.insuranceNewsF();
    Main.myBannerF();
    Main.mainTopinformationF();
  },
  mainVisual: function () {

    /* Swiper Slider Cards Home - Show only on mobile */
    var mainVisualSlider = Swiper;
    var init = false;
    function swiperMode() {
      let mobile = window.matchMedia("(min-width: 0px) and (max-width: 768px)");

      if (mobile.matches) {
        if (!init) {
          init = true;
           mainVisualSlider = new Swiper(".mainVisualSlider", {
            slidesPerView: 1,
            centeredSlides: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            effect: "fade",
            loop: true,
            loopAdditionalSlides: 1,
            spaceBetween: 0,
            navigation: {
              nextEl: ".mainVisualSlider .swiper-button-next",
              prevEl: ".mainVisualSlider .swiper-button-prev",
            },
          });
        }
        $('.mainVisualSlider').removeClass('web');
        $('.mainVisualSlider').addClass('mo');
      } else {
        mainVisualSlider.destroy();
        init = false;
        $('.mainVisualSlider').removeClass('mo');
        $('.mainVisualSlider').addClass('web');
      }
    }

    window.addEventListener("load", function () {
      swiperMode();
    });

    window.addEventListener("resize", function () {
      swiperMode();
    });
  


   
  },
  mainTopinformationF: function(){
    mainTopInforSwiper = new Swiper('.supplementary_information_slider', {
        slidesPerView: 3,
        spaceBetween: 15,
        loop: true,
        loopAdditionalSlides: 1,
        navigation: {
          nextEl: $(`.supplementary_information_box .swiper-button-next`),
          prevEl: $(`.supplementary_information_box .swiper-button-prev`),
        },
        watchOverflow: true,
        breakpoints: {
          768: {
            spaceBetween: 20,
          },
        },
      });

      console.log("first");
      
  },
  myBannerF: function () {
    $(".my_banner_sect .swiper-slide-btn").each(function (index, element) {
      var $this = $(this);
      $this.addClass(`slider-btn-${index}`);
    });
    $(".my_key_services_slider").each(function (index) {
      let $this = $(this);
      let myKeySwiper = undefined;
      let slideNum = $this.find(".swiper-slide").length; //슬라이드 총 개수
      let slideInx = 0; //현재 슬라이드 index

      //디바이스 체크
      let oldWChk = window.innerWidth > 768 ? "pc" : "mo";
      sliderAct();
      $(window).on("resize", function () {
        let newWChk = window.innerWidth > 768 ? "pc" : "mo";
        if (newWChk != oldWChk) {
          oldWChk = newWChk;
          sliderAct();
        }
      });

      function sliderAct() {
        //슬라이드 인덱스 클래스 추가
        $this.addClass(`my_key_services_slider${index}`);

        //슬라이드 초기화
        if (myKeySwiper != undefined) {
          myKeySwiper.destroy();
          myKeySwiper = undefined;
        }

        //slidesPerView 옵션 설정

        myKeySwiper = new Swiper(`.my_key_services_slider${index}`, {
         
          loop: true,
          loopAdditionalSlides: 1,
          observer: true,
          observeParents: true,
          navigation: {
            nextEl: $(`.slider-btn-${index} .swiper-button-next`),
            prevEl: $(`.slider-btn-${index} .swiper-button-prev`),
          },
          watchOverflow: true,
          breakpoints: {
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
          },
          slidesPerView: 2,
          spaceBetween: 15,
          
        });
      }
    });
  },
  insuranceNewsF: function () {
    $(".insurance_news_sect .swiper-slide-btn").each(function (index, element) {
      var $this = $(this);
      $this.addClass(`insurance_news_slider-btn-${index}`);
    });

    $(".insurance_news_slider").each(function (index) {
      let $this = $(this);
      let insuranceSwiper = undefined;
      let slideNum = $this.find(".swiper-slide").length;
      let slideInx = 0;
      let oldWChk = window.innerWidth > 768 ? "pc" : "mo";
      sliderAct2();
      $(window).on("resize", function () {
        let newWChk = window.innerWidth > 768 ? "pc" : "mo";
        if (newWChk != oldWChk) {
          oldWChk = newWChk;
          sliderAct2();
        }
      });

      function sliderAct2() {
        $this.addClass(`insurance_news_slider-${index}`);
        if (insuranceSwiper != undefined) {
          insuranceSwiper.destroy();
          insuranceSwiper = undefined;
        }

        insuranceSwiper = new Swiper(`.insurance_news_slider-${index}`, {
          slidesPerView: 'auto',
          spaceBetween: 15,
          slidesOffsetAfter: 2,
          observer: true,
          observeParents: true,
          navigation: {
            nextEl: $(
              `.insurance_news_slider-btn-${index} .swiper-button-next`
            ),
            prevEl: $(
              `.insurance_news_slider-btn-${index} .swiper-button-prev`
            ),
          },
          watchOverflow: true,
          // on: {
          //   init: function () {
          //     for (var i = 0; i < 3; i++) {
          //       this.slides.eq(i).addClass("active-slide");
          //     }
          //   },
          //   slideChange: function () {
          //     var activeIndex = this.activeIndex;
          //     this.slides.removeClass("active-slide");
          //     for (var i = activeIndex; i <= activeIndex + 2; i++) {
          //       if (insuranceSwiper.slides.eq(i)) {
          //         insuranceSwiper.slides.eq(i).addClass("active-slide");
          //       }
          //     }
          //   },
          // },
          breakpoints: {
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 15,
            },
          },
        });

        $this.addClass(`insurance_news_slider-${index}`);
      }

      // function initializeinsuranceSwiper() {
      //   insuranceSwiper.slides.removeClass("active-slide");
      //   for (var i = 0; i < 3; i++) {
      //     insuranceSwiper.slides.eq(i).addClass("active-slide");
      //   }
      // }

      $(".insurance_news_sect .insurance_news_tab button").on("click", function () {
          let $this = $(this);
          let target = $this.val();
          insuranceSwiper.destroy();
          sliderAct2()
          // initializeinsuranceSwiper();

          $(".insurance_news_sect .insurance_news_slider").removeClass( "active");
          $(".insurance_news_sect .swiper-slide-btn").removeClass("active");
          $("." + target).addClass("active");
          addRemove(this);
        }
      );
    });
  },
};
