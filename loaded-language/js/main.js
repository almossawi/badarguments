// This is adapted from a variation I worked on in 2015 for Hans in the Land of Bards
// that I never released. I wish I didn't have to use jQuery, but turn.js requires it
// todo serious cleanup
(function() {
  'use strict';

  var args = {
    display: 'double',
    height_in_double: 600,
    width_in_double: 1368,
    height_in_single: 600,
    width_in_single: 664,
    mobile_width_cutoff: 1450
  };

  function loadApp() {
    var flipbook = $('.flipbook');

    // Check if the CSS was already loaded
    if(flipbook.width() == 0 || flipbook.height() == 0) {
      setTimeout(loadApp, 10);
      return;
    }

    // Slider
    $("#slider").slider({
      min: 1,
      max: 100,

      start: function(event, ui) {
        moveBar(false);
      },

      stop: function() {
        // skip over cover page (you're dead to me, old friend, you're dead to me)
        var page = Math.max(1, $(this).slider('value') * 2 - 2);
        $('.flipbook').turn('page', page);
      }
    });

    // URIs  
    Hash.on('page\/([0-9]*)$', {
      yep: function(path, parts) {
        //console.log("yep", path);

        var page = parts[1];

        if(page !== undefined) {
          if($('.flipbook').turn('is'))
            $('.flipbook').turn('page', page);
        }
      },

      nop: function(path) {
        if($('.flipbook').turn('is'))
          $('.flipbook').turn('page', 1);
      }
    });

    // Arrows
    $(document).keydown(function(e) {
      var previous = 37,
        next = 39;

      switch (e.keyCode) {
        case previous:
          $('.flipbook').turn('previous');
          break;
        case next:
          $('.flipbook').turn('next');
          break;
      }
    });

    // Flipbook
    flipbook.bind(($.isTouch) ? 'touchend' : 'click', zoomHandle);

    // desktop view
    if(args.display == 'double') {
      args.height = args.height_in_double;
      args.width = args.width_in_double;

      $('#canvas')
        .css('width', args.width_in_double + 'px');
    } else { // mobile view
      args.height = args.height_in_single;
      args.width = args.width_in_single;

      $('#canvas')
        .css('width', args.width_in_single + 'px');
    }

    flipbook.turn({
      width: args.width,
      height: args.height,
      display: args.display,
      elevation: 10,
      acceleration: !isChrome(),
      autoCenter: true,
      duration: 200,
      pages: 33,
      when: {
        turning: function(e, page, view) {
          var book = $(this),
            currentPage = book.turn('page'),
            pages = book.turn('pages');

          if(currentPage > 3 && currentPage < pages - 3) {

            if(page == 1) {
              book.turn('page', 2).turn('stop').turn('page', page);
              e.preventDefault();
              return;
            } else if(page == pages) {
              book.turn('page', pages - 1).turn('stop').turn('page', page);
              e.preventDefault();
              return;
            }
          } else if(page > 3 && page < pages - 3) {
            if(currentPage == 1) {
              book.turn('page', 2).turn('stop').turn('page', page);
              e.preventDefault();
              return;
            } else if(currentPage == pages) {
              book.turn('page', pages - 1).turn('stop').turn('page', page);
              e.preventDefault();
              return;
            }
          }

          updateDepth(book, page);

          if(page >= 2)
            $('.flipbook .p2').addClass('fixed');
          else
            $('.flipbook .p2').removeClass('fixed');

          if(page < book.turn('pages'))
            $('.flipbook .p33').addClass('fixed');
          else
            $('.flipbook .p33').removeClass('fixed');

          Hash.go('page/' + page).update();

          // are we showing arrows?
          // if we've loaded #page/1, we need to show the right arrow
          // disable left arrow on first page
          if(page == 1) {
            $(".left-arrow img")
              .hide();

            $(".right-arrow img")
              .show();
          }

          // on all pages, but the first, make sure we show the left arrow
          else if(page > 1) {
            $(".left-arrow img")
              .show();
          }

          // on all pages, but the last, make sure we show the right arrow
          if(page < pages) {
            $(".right-arrow img")
              .show();
          }

          // are we showing full arrows or semi-circles?
          // use semi-circle right arrow on all pages, but first one
          if(page > 1 && page < pages) {
            $(".left-arrow img")
              .css("background-position", "0 0");

            $(".right-arrow img")
              .css("background-position", "50px 0");
          }
          // use full circle right arrow on first page
          else if(page == 1) {
            $(".right-arrow img")
              .css("background-position", "0 0")
          }

          // use full circle left arrow on last page
          // on the last page, don't show the right arrow
          else if(page == pages) {
            $(".right-arrow img")
              .hide();

            $(".left-arrow img")
              .css("background-position", "50px 0")
          }
        },

        turned: function(e, page, view) {
          var book = $(this),
            pages = book.turn('pages');

          updateDepth(book);

          $('#slider').slider('value', getViewNumber(book, page));

          book.turn('center');

          // only show how-to box on first run
          if(page > 3) {
            $(".howto").fadeOut();
          }
        },

        start: function(e, pageObj, view) {
          // disable page turn effects
          if(view == "tl" || view == "bl" || view == "tr" || view == "br") {
            e.preventDefault();
          }

          moveBar(true);
        },

        end: function(e, pageObj) {
          var book = $(this);

          updateDepth(book);

          setTimeout(function() {
            $('#slider').slider('value', getViewNumber(book));
          }, 1);

          moveBar(false);
        },

        missing: function(e, pages) {
          for (var i = 0; i < pages.length; i++) {
            addPage(pages[i], $(this));
          }
        }
      }
    });

    $('#slider').slider('option', 'max', numberOfViews(flipbook));
    update_dimensions();

    flipbook.addClass('animated');

    // Show the canvas
    $('#canvas').delay(500).animate({
      opacity: 1
    }, 400, function() {
      $(".first-run-loading").hide();

      var current_page = $(".flipbook").turn("page");
      if(current_page <= 3) {
        $(".howto").delay(1000).fadeIn();

        setTimeout(function() {
          $(".howto").fadeOut();
        }, 7000);
      }
    });

    // on first load, which view are we in?
    if(args.display == 'double') {
      double_view_cleanup();
    } else {
      single_view_cleanup();
    }
  }

  function single_view_cleanup() {
    $('.p2,.p33,.p34,.flipbook,.turnjs-slider')
      .addClass('single');

    $('#canvas')
      .css('overflow', 'visible');
  }

  function double_view_cleanup() {
    $('.p2,.p33,.p34,.flipbook,.turnjs-slider')
      .removeClass('single');

    $('#canvas')
      .css('overflow', 'hidden');
  }

  function updateDepth(book, newPage) {
    var page = book.turn('page'),
      pages = book.turn('pages'),
      depthWidth = 16 * Math.min(1, page * 2 / pages);

    newPage = newPage || page;

    if(newPage > 3)
      $('.flipbook .p2 .depth').css({
        width: depthWidth,
        left: 20 - depthWidth
      });
    else
      $('.flipbook .p2 .depth').css({
        width: 0
      });

    depthWidth = 16 * Math.min(1, (pages - page) * 2 / pages);

    if(newPage < pages - 3)
      $('.flipbook .p33 .depth').css({
        width: depthWidth,
        right: 20 - depthWidth
      });
    else
      $('.flipbook .p33 .depth').css({
        width: 0
      });
  }

  function loadPage(page) {
    $.ajax({
      url: 'pages/page' + page + '.html'
    }).
    done(function(pageHtml) {
      $('.flipbook .p' + page)
        .html(pageHtml);
    });
  }

  function addPage(page, book) {
    var id, pages = book.turn('pages');

    if(!book.turn('hasPage', page)) {
      var element = $('<div />', {
        'class': 'own-size',
        css: {
          width: args.width_in_single,
          height: 582
        }
      }).
      html('<div class="loading">loading</div>');

      if(book.turn('addPage', element, page)) {
        loadPage(page);
      }
    }
  }

  function numberOfViews(book) {
    return book.turn('pages') / 2 + 1;
  }

  function getViewNumber(book, page) {
    return parseInt((page || book.turn('page')) / 2 + 1, 10);
  }

  function zoomHandle(e) {
    if($('.flipbook').data().zoomIn)
      zoomOut();
    else if(e.target && $(e.target).hasClass('zoom-this')) {
      zoomThis($(e.target));
    }
  }

  function zoomThis(pic) {
    var position, translate,
      tmpContainer = $('<div />', {
        'class': 'zoom-pic'
      }),
      transitionEnd = $.cssTransitionEnd(),
      tmpPic = $('<img />'),
      zCenterX = $('#book-zoom').width() / 2,
      zCenterY = $('#book-zoom').height() / 2,
      bookPos = $('#book-zoom').offset(),
      picPos = {
        left: pic.offset().left - bookPos.left,
        top: pic.offset().top - bookPos.top
      },
      completeTransition = function() {
        $('#book-zoom').unbind(transitionEnd);

        if($('.flipbook').data().zoomIn) {
          tmpContainer.appendTo($('body'));

          $('body').css({
            'overflow': 'hidden'
          });

          tmpPic.css({
            margin: position.top + 'px ' + position.left + 'px'
          }).
          appendTo(tmpContainer).
          fadeOut(0).
          fadeIn(500);
        }
      };

    $('.flipbook').data().zoomIn = true;
    $('.flipbook').turn('disable', true);

    $(window).resize(zoomOut);

    tmpContainer.click(zoomOut);

    tmpPic.load(function() {
      var realWidth = $(this)[0].width,
        realHeight = $(this)[0].height,
        zoomFactor = realWidth / pic.width(),
        picPosition = {
          top: (picPos.top - zCenterY) * zoomFactor + zCenterY + bookPos.top,
          left: (picPos.left - zCenterX) * zoomFactor + zCenterX + bookPos.left
        };

      position = {
        top: ($(window).height() - realHeight) / 2,
        left: ($(window).width() - realWidth) / 2
      };

      translate = {
        top: position.top - picPosition.top,
        left: position.left - picPosition.left
      };

      $('.samples .bar').css({
        visibility: 'hidden'
      });
      $('#slider-bar').hide();


      $('#book-zoom').transform(
        'translate(' + translate.left + 'px, ' + translate.top + 'px)' +
        'scale(' + zoomFactor + ', ' + zoomFactor + ')');

      if(transitionEnd)
        $('#book-zoom').bind(transitionEnd, completeTransition);
      else
        setTimeout(completeTransition, 1000);

    });

    tmpPic.attr('src', pic.attr('src'));
  }

  function zoomOut() {
    var transitionEnd = $.cssTransitionEnd(),
      completeTransition = function(e) {
        $('#book-zoom').unbind(transitionEnd);
        $('.flipbook').turn('disable', false);
        $('body').css({
          'overflow': 'auto'
        });
        moveBar(false);
      };

    $('.flipbook').data().zoomIn = false;

    $(window).unbind('resize', zoomOut);

    moveBar(true);

    $('.zoom-pic').remove();
    $('#book-zoom').transform('scale(1, 1)');
    $('.samples .bar').css({
      visibility: 'visible'
    });
    $('#slider-bar').show();

    if(transitionEnd)
      $('#book-zoom').bind(transitionEnd, completeTransition);
    else
      setTimeout(completeTransition, 1000);
  }

  function moveBar(yes) {
    if(Modernizr && Modernizr.csstransforms) {
      $('#slider .ui-slider-handle').css({
        zIndex: yes ? -1 : 999
      });
    }
  }

  function isChrome() {
    return navigator.userAgent.indexOf('Chrome') != -1;
  }

  function update_dimensions() {
    if($(window).width() > args.mobile_width_cutoff) {
      args.display = 'double';
      double_view_cleanup();
    } else {
      args.display = 'single';
      single_view_cleanup();
    }

    var padding = (args.display == 'single')
      ? '0'
      : '20px';

    var slider_width = (args.display == 'single')
      ? '59px'
      : '80px';

    $('#canvas')
        .css('width', args.width + 'px');

      $('.left-arrow')
        .css('left', padding);

      $('.right-arrow')
        .css('right', padding);
  }

  function resize() {
    //mobile or desktop view?
    if($(window).width() > args.mobile_width_cutoff && args.display == 'single') {
      $('.flipbook')
        .turn('display', 'double')
        .turn('size', args.width_in_double, args.height_in_double);

      args.display = 'double';
      args.height = args.height_in_double;
      args.width = args.width_in_double;

      update_dimensions();
    } else if($(window).width() <= args.mobile_width_cutoff && args.display == 'double') { //mobile view?
      $('.flipbook')
        .turn('display', 'single')
        .turn('size', args.width_in_single, args.height_in_single);

      $('.page')
        .removeClass('even odd');

      args.display = 'single';
      args.height = args.height_in_single;
      args.width = args.width_in_single;

      update_dimensions();
    }
  }

  //do we need to regenerate the flipbook
  $(window).on('resize', function() {
    resize();
  });

  $(document).ready(function() {
    init();
  });

  function init() { 
    event_listeners();
    update_dimensions();

    // Load turn.js
    yepnope({
      test: Modernizr.csstransforms,
      yep: ['js/turn.js'],
      nope: ['js/turn.html4.js', 'css/jquery.ui.html4.css', 'css/style-html4.css'],
      both: ['css/jquery.ui.css'],
      complete: loadApp
    });

    if(Modernizr.history) {
      //console.log("html5 history detected, using pushState");
      Hash.pushState(true);
    } else {
      console.log("html5 history not detected, using pushState");
    }
  }

  function event_listeners() {
    $(".left-arrow img").unbind('click').bind('click', function() {
      $('.flipbook').turn('previous');
      return false
    });

    $(".right-arrow img").unbind('click').bind('click', function() {
      $('.flipbook').turn('next');
      return false
    });

    $(".howto").live("click", function() {
      $(".howto").fadeOut();
    });

    $('.zoomable-art').live('mouseenter', function() {
      var id = $(this).attr('data-id');
      $('#pic' + id + '-zoom').fadeIn('slow');
    });

    $('.zoomed-art').live('mouseleave', function() {
      var id = $(this).attr('data-id');
      $('#pic' + id + '-zoom').fadeOut('slow');
    });
  }
}());