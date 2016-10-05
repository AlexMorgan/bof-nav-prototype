var slideNavigation = {
    conf: {
        introSlide: 'welcome',
        navigation: '.navigation',
        slideContainer: '.js-container',
        slideWrapper: '.js-slide__wrapper'
    },

    selections: {
        $navigationAnchor: $('.js-navigation__anchor'),
        $slide: $('.js-container')
    },

    settings: {
        isDev: false,
        lastScrollTop: 0,
    },

    activateNextSlide: function() {
        var $activeSlide = this.currentActiveSlide(),
            $nextActiveSlide = $activeSlide.next(),
            anchor = $nextActiveSlide.data('anchor');

            this.removeCurrentActiveSlide();
            this.setActiveNavItem(anchor);
            $nextActiveSlide.addClass('active');
    },

    activatePrevSlide: function() {
        var $activeSlide = this.currentActiveSlide(),
            $prevActiveSlide = $activeSlide.prev();
            anchor = $prevActiveSlide.data('anchor');

            // Dont remove active class on first slide on scroll up
            $activeSlide.data('slideId') !== 0 && this.removeCurrentActiveSlide();
            $activeSlide.data('slideId') !== 0 && this.setActiveNavItem(anchor);
            $prevActiveSlide.addClass('active');
    },

    checkActiveSlide: function() {
        var direction = this.determineScrollDir();

        if (direction === 'down') {
            if ( this.calcNextSlideDepth(direction) <= 0 ) {
                this.activateNextSlide();
                this.updateHash();
            }
        } else if (direction === 'up') {
            if ( this.calcNextSlideDepth(direction) >= 0 ) {
                this.activatePrevSlide();
                this.updateHash();
            }
        }
    },

    calcNextSlideDepth: function(dir) {
        var scrollTop     = $(window).scrollTop(),
            elementOffset = dir === "down" ? $(this.conf.slideContainer + '.active').next().offset().top : elementOffset = $(this.conf.slideContainer + '.active').offset().top,
            distance      = (elementOffset - scrollTop);

            this.settings.isDev === true && console.log('Distance: ', distance);

            return distance;
    },

    calcSlideHeight: function() {
        return window.innerHeight;
    },

    createNavigation: function() {
        var list = '<ul class="navigation__items"></ul>',
            wrapper = '<div class="navigation"></div>',
            $list = $(list);

        var keys = this.selections.$slide.map(function(i, val) {
            return $(this).data('anchor');
        });

        for (i=0; i < keys.length; i++) {
            var listItem = '<li data-nav-anchor="' + keys[i] + '" class="js-navigation__anchor navigation__anchor"><a class="anchor__link" href="#' + keys[i] + '"><span class="anchor__item"></span></a><div class="tooltip tooltip--left">' + keys[i] + '</div></li>';
            $list.append(listItem);
        }

        $('.main-content').append($list);

        $('.js-navigation__anchor').first().addClass('active');

        this.wrapElement($list, wrapper);
    },

    currentActiveSlide: function() {
        return $activeSlide = $(this.conf.slideContainer + '.active');
    },

    determineScrollDir: function() {
        var st = $(window).scrollTop(),
            direction;

        if (st > this.settings.lastScrollTop){
            direction = 'down';
        } else {
           direction = "up"
        }

        this.settings.lastScrollTop = st;
        return direction;
    },

    get: function() {
        var map = {};
        location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, k, v){
            map[k] = v;
        });
        return map;
    },

    logMsg: function(msg) {
        console.log(msg);
    },

    positionNavigation: function() {
        // Calculate height of navigation item, divide it by 2 and then add that style to the .navigation element
        var height = $(this.conf.navigation).innerHeight()/2;

        $(this.conf.navigation).css('marginTop', -height);
    },

    removeCurrentActiveSlide: function() {
        var $activeSlide = this.currentActiveSlide();

        $activeSlide.removeClass('active');
    },

    scrollToSlide: function(el) {
        $("html, body").animate({ scrollTop: $(el).offset().top }, 500);
    },

    setActiveNavItem: function(anchor) {
        $('.js-navigation__anchor').removeClass('active');
        $('[data-nav-anchor="' + anchor + '"]').addClass('active');
    },

    setFirstSlideActive: function() {
        this.selections.$slide.first().addClass('active');
    },


    setSlideHeight: function() {
        var self = this;

        this.selections.$slide.each(function(index,val) {
            $(val).css('height', self.calcSlideHeight());
            $(val).children('.slide__align').css('height', self.calcSlideHeight());
        });
    },

    setSlideId: function() {
        $('.container').each(function(i,v){
            var $this = $(this);

            $this.data('slideId', i);
        });
    },

    scrollToIntroSlide: function(anchor) {
        // Only scroll to intro slide if page isn't being shared
        if (!window.location.hash) {
            this.scrollToSlide('[data-anchor="' + anchor + '"]');
        }
    },

    scrollToSlideOnLoad: function() {
        if (!!window.location.hash) {
            var hash = window.location.hash,
                anchor = hash.substring(1);

            this.scrollToSlide('[data-anchor="' + anchor + '"]');
        }
    },

    throttle: function(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last,
          deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    },

    updateHash: function() {
        var $activeSlide = this.currentActiveSlide(),
            hash = $activeSlide.data('anchor');

            window.location.hash = hash;
    },

    wrapElement: function($el, wrapStr) {
        $el.wrap(wrapStr);
    },

    bind: function() {
        var self = this;

        $('body').on('click','.js-navigation__anchor', function() {
            var anchor = $(this).data('navAnchor');
            console.log(anchor);

            $('.js-navigation__anchor').removeClass('active');
            $('[data-nav-anchor="' + anchor + '"]').addClass('active');

            self.scrollToSlide('[data-anchor="' + anchor + '"]');
        });

        $(window).on('scroll', self.throttle(function () {
            self.checkActiveSlide();
            self.determineScrollDir();
        }, 50));

        $(window).resize(self.throttle(function(event) {
            self.setSlideHeight()
        }, 100));
    },

    init: function() {
        this.bind();
        this.createNavigation();
        this.positionNavigation();
        this.wrapElement($(this.conf.slideWrapper), '<div class="slide__align"></div>');
        this.setSlideHeight();
        this.setFirstSlideActive();
        this.setSlideId();
        this.scrollToSlideOnLoad();
        this.scrollToIntroSlide(this.conf.introSlide);
    }
};

(function($) {
    slideNavigation.init();
}(jQuery));
