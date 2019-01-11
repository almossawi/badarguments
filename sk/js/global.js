(function() {
    'use strict';

    var global = {
        isDouble: true
    };

    $('.loading')
        .show();

    if(getURLParameter('view') == undefined || getURLParameter('view') == 'flipbook') {
        $('.page-break')
            .remove();

        $('.container')
            .css('height', '600px');

        var e = "<a href='/sk/?view=flipbook' id='view_as_flipbook' "
            + "class='selected'>Zobraziť ako knihu</a> <a href='/sk/?view=allpages' "
            + "id='view_all_pages'>Zobraziť všetky strany</a>";

        $('#zoom_info')
            .html(e);

        yepnope({
            test: Modernizr.csstransforms,
            yep: ['../js/turn.min.js'],
            nope: ['../js/turn.html4.min.js'],
            both: ['../js/scissor.min.js', '../css/double-page.css'],
            complete: loadApp
        });

        $('div.right')
            .css('border-left', '0')
            .css('background-position', '1px top');

        $('img.right')
            .css('border-left-color', '#000000');

        $('#cover')
            .attr('class', 'cover');
    } else {
        var e = "<a href='/sk/?view=flipbook' id='view_as_flipbook'>Zobraziť ako knihu</a> "
            + "<a href='/sk/?view=allpages' id='view_all_pages' "
            + "class='selected'>Zobraziť všetky strany</a>";

        $('#zoom_info')
            .html(e);

        $('#cover')
            .attr('class', 'left');

        $('#blank_page')
            .remove();

        $('div.right')
            .css('border-left', '1px solid #87827b')
            .css('background-position', 'left top');

        $('img.right')
            .css('border-left-color', '#87827b');

        $('.right .page_number')
            .css('right', '83px');

        $('div.right, div.left')
            .css('float', 'left')
            .css('margin-bottom', '15px');

        $('img.left, img.right')
            .css('margin-bottom', '15px');

        $('.flipbook')
            .delay(400)
            .animate({
                opacity: 1
            }, 300, function() {
                $('.loading').hide()
            });
    }

    assignEventListeners();

    $('#slider-range-min')
        .slider({
            range: 'min',
            value: 2,
            min: 1,
            max: 20,
            slide: function(e, t) {
                $('#amount').html('$' + t.value);
                $('#amount_in_cents').val(t.value * 100)
            }
        });

    $('#amount')
        .html('$' + $('#slider-range-min')
        .slider('value'));

    if(window.location.hash) {
        $.colorbox({
            inline: true,
            href: '#inline_content',
            width: '880px'
        });

        setTimeout(function() {
            $.colorbox.resize();
        }, 500);
    } else {
        $('.inline').colorbox({
            inline: true,
            width: '880px'
        });
    }

    function loadApp() {
        var e = $('.flipbook');
        if (e.width() == 0 || e.height() == 0) {
            setTimeout(loadApp, 10);
            return
        }

        $('.flipbook .double')
            .scissor();

        //mobile or desktop view?
        if($(window).width() > 1450) {
            $('.flipbook').turn({
                elevation: 50,
                gradients: true,
                duration: 300,
                acceleration: true,
                autoCenter: true,
                height: 600,
                width: 1328,
                display: 'double'
            });

            global.isDouble = true;
        } else { //mobile view?
            $('.flipbook').turn({
                elevation: 50,
                gradients: true,
                duration: 300,
                acceleration: true,
                autoCenter: true,
                height: 600,
                width: 664,
                display: 'single'
            });

            global.isDouble = false;
        }
        
        $(window).bind('keydown', function(e) {
            if (e.keyCode == 37) {
                $('.flipbook').turn('previous');
            } else if (e.keyCode == 39) {
                $('.flipbook').turn('next');
            }
        });

        $('.flipbook')
            .delay(1e3)
            .animate({
               opacity: 1
            }, 300, function() {
                $('.loading')
                    .hide();

                $('.right-arrow')
                    .css('display', 'block');

                var e = $('.flipbook')
                    .turn('page');

                if (e == 1) {
                    $('.howto')
                        .delay(1e3)
                        .fadeIn();

                    setTimeout(function() {
                        $('.howto')
                            .fadeOut();
                    }, 7e3);
                }

                var turnto = Number(getURLParameter('page')) + 6;
                if (!isNaN(turnto) && turnto > 6 && turnto <= 62) {
                $('.flipbook').turn('page', turnto);
            }
        })
    }

    function assignEventListeners() {
        $('#press a img').on('mouseenter', function() {
            $(this).css('opacity', '0.9');
        });

        $('#press a img').on('mouseout', function() {
            $(this).css('opacity', '0.5');
        });

        $('.flipbook').bind('start', function(e, t, n) {
            if (n == 'tl' || n == 'bl' || n == 'tr' || n == 'br') {
                e.preventDefault();
            }
        });

        $('.flipbook').bind('first', function(e) {
            $('.left-arrow img')
                .css('display', 'none');

            $('.right-arrow img')
                .css('background-position', '0 0');
        });

        $('.flipbook').bind('last', function(e) {
            $('.right-arrow img')
                .css('display', 'none');
        });

        $('.flipbook').bind('start', function(e, t, n) {
            var r = $('.flipbook')
                .turn('page');

            if (r > 1) {
                $('.right-arrow img')
                    .css('background-position', '50px 0');

                $('#toolong')
                    .fadeOut();
            } else {
                $('#toolong')
                    .fadeIn();

                $('.right-arrow img')
                    .css('background-position', '0 0');
            }
        });

        //do we need to regenerate the flipbook
        $(window).on('resize', function() {
            //mobile or desktop view?
            if($(window).width() > 1450 && !global.isDouble) {
                $('.flipbook')
                    .turn('display', 'double')
                    .turn('size', 1328, 600);

                global.isDouble = true;
            } else if($(window).width() <= 1450 && global.isDouble) { //mobile view?
                $('.flipbook')
                    .turn('display', 'single')
                    .turn('size', 664, 600);

                global.isDouble = false;
            }
        });

        $('.flipbook').bind('turned', function(e, t, n) {
            $('.howto').fadeOut();
            var r = $('.flipbook')
                .turn('page');

            if (r > 1) {
                $('.left-arrow img')
                    .css('display', 'block');
            }

            if (r + 1 < $('.flipbook').turn('pages')) {
                $('.right-arrow img')
                    .css('display', 'block');
            }
        });

        $('.left-arrow img').on('click', function() {
            $('.flipbook')
                .turn('previous');

            return false;
        });

        $('.right-arrow img').on('click', function() {
            $('.flipbook')
                .turn('next');

            return false;
        });

        $('button').live('click', function() {
            $('iframe')
                .css('z-index', '9999999999999');
        });

        $('.howto').live('click', function() {
            $('.howto')
                .fadeOut();
        });

        $('a.internal').live('click', function(e) {
            var t = $(this);

            $('html, body')
                .stop()
                .animate({
                scrollTop: $(t.attr('href')).offset().top
            }, 800, 'easeInOutExpo');

            e.preventDefault();
        })
    }

    function reverse(e) {
        var t = '';

        for (var n = e.length - 1; n >= 0; n--) {
            t += e[n]
        }

        return t;
    }

    function getURLParameter(e) {
        return decodeURIComponent(((
            new RegExp('[?|&]' + e + '=' + '([^&;]+?)(&|#|;|$)')).exec(location.search) 
                || [, ''])[1].replace(/\+/g, '%20')) || null
    }
}());