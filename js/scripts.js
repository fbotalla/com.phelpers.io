/*!
    * Start Bootstrap - Freelancer v6.0.5 (https://startbootstrap.com/theme/freelancer)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
    */
    (function($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - 71)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });

    // Scroll to top button appear
    $(document).scroll(function() {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 80
    });

    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Floating label headings for the contact form
    $(function() {
      $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
      }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
      }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
      });
    });

        $(document).ready(function() {
            $('#termsTrigger').click(function(){
                console.log("triggers")
            });
        });

    $(document).on("click", "#privacy-pdf", function () {
        openBootboxPdf("privacy")
    })

    $(document).on("click", "#terms-pdf", function () {
        openBootboxPdf("terms")
    })

    $(document).on("click", "#guidelines-pdf", function () {
        openBootboxPdf("guidelines")
    })


    })(jQuery); // End of use strict

function openBootboxPdf(topic){
    bootbox.dialog({
        size:"xl",
        message:'<div id="open-pdf" style="height: 600px"></div>'
    })
    initPdf(topic)
}

function initPdf(topic){
    let url = ""
    switch (topic) {
        case "privacy":
            url = "https://firebasestorage.googleapis.com/v0/b/phelpers-48992.appspot.com/o/Legal%20Documents%2FPrivacy.pdf?alt=media&token=da3bf24e-78de-4d64-8692-d47aa1ab286d";
            break;
        case "terms":
            url = "https://firebasestorage.googleapis.com/v0/b/phelpers-48992.appspot.com/o/Legal%20Documents%2FTerms.pdf?alt=media&token=097aa352-ee3f-435c-9b5f-54f8521fd664";
            break;
        case "guidelines":
            url = "https://firebasestorage.googleapis.com/v0/b/phelpers-48992.appspot.com/o/Legal%20Documents%2FGuidelines.pdf?alt=media&token=0d366ba3-e2ad-465e-a2f6-5ab76f13002d";
            break;

    }

    let $container = $("#open-pdf");
    PDFObject.embed(url,$container )
}


