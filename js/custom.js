var slideNavigation = {
    conf: {
        body:             '.body',
        introSlide:       'welcome',
        navigation:       '.navigation',
        navigationAnchor: '.js-navigation__anchor',
        slideContainer:   '.js-container',
        slideWrapper:     '.js-slide__wrapper',
        horizontalSlide:  '.js-slide'
    },

    selections: {
        $body:             $('.body'),
        $horizontalSlide:  $('.js-slide'),
        $navigationAnchor: $('.js-navigation__anchor'),
        $slideContainer:   $('.js-container'),
        $slideWrapper:     $('.js-slide__wrapper')
    },

    settings: {
        isDev:            false,
        lastScrollTop:    0,
        veilSlides:       true,
        slidesCount:      $('.container').length,
        slideScrollSpeed: 600
    },

    activateNextSlide: function(direction) {
        var $activeSlide      = this.currentActiveSlide(),
            $nextActiveSlide  = direction === 'down' ? $activeSlide.next() : $activeSlide.prev();
            anchor            = $nextActiveSlide.data('anchor');

            this.removeCurrentActiveSlide();
            this.setActiveNavItem(anchor);
            $nextActiveSlide.addClass('active');
    },

    appendVeilToBody: function() {
        if (this.settings.veilSlides) {
            var upperVeil = "<div class='slide-veil slide-veil--up'></div>",
                lowerVeil = "<div class='slide-veil slide-veil--down'></div>";

            $('body').append(lowerVeil).prepend(upperVeil);
        }
    },

    checkActiveSlide: function() {
        var direction        = this.determineScrollDir(),
            slideHeight      = this.calcSlideHeight(), // Use slide height and set the next slide to active when at halfway point
            transitionPoint  = slideHeight/2,
            depth            = this.calcNextSlideDepth(direction);

        if (direction === 'down') {
            if ( depth >= transitionPoint) {
                this.activateNextSlide(direction);
                this.updateHash();
            }
        } else if (direction === 'up') {
            if ( depth <= -transitionPoint) {
                this.activateNextSlide(direction);
                this.updateHash();
            }
        }
    },

    calcNextSlideDepth: function(dir) {
        var scrollTop           = $(window).scrollTop(),
            elementOffset       = this.currentActiveSlide().offset().top,
            distance            = -(elementOffset - scrollTop);

            this.settings.isDev === true && console.log('Distance: ', distance);

            return distance;
    },

    calcSlideHeight: function() {
        return window.innerHeight;
    },

    createHorizontalSlide: function() {
        var self = this;

        this.selections.$slideContainer.each(function(i,v) {
            var slidesLength = $(this).find('.js-slide').length;
                $this = $(this);

            if (slidesLength > 0) {
                var slideWidthPerc = 100/slidesLength + '%',
                    slidesContainerPerc = 100 * slidesLength + '%';

                $this.find('.js-slide').css('width', slideWidthPerc)
                    .addClass('sn-slides')
                    .wrapAll('<div class="slidesWrapper" style="width:' + slidesContainerPerc + ';"></div>');

                $('.slidesWrapper').wrap('<div class="horizontal-slides"></div>');

                self.createHorizontalNav($this);
                self.setInitActiveHorzSlide(); // Set the active slide within this container
            }
        });
    },

    createHorizontalNav: function($el) {
        $el.find('.horizontal-slides').append('<div class="horizontal-nav"><a data-horz-nav="prev" class="horz-nav__btn horz-nav--prev" href="#">Prev</a> <a data-horz-nav="next" class="horz-nav__btn horz-nav--next" href="#">Next</a></div>');
    },

    createNavigation: function() {
        var list     = '<ul class="navigation__items"></ul>',
            wrapper  = '<div class="navigation"></div>',
            $list    = $(list);

        var keys = this.selections.$slideContainer.map(function(i, val) {
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

    hideVeil: function(delay) {
        var timeout = delay ? delay : 700;

        setTimeout(function(){ $('body').removeClass('veil-up veil-down'); }, timeout);
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

    scrollToIntroSlide: function(anchor) {
        // Only scroll to intro slide if page isn't being shared
        if (!window.location.hash) {
            this.scrollToSlide('[data-anchor="' + anchor + '"]');
        }
    },

    scrollToSlide: function(el, cb) {
        var self = this;

        $("html, body").animate({ scrollTop: $(el).offset().top }, self.settings.slideScrollSpeed, function() {
            if(cb && typeof cb == "function") {
                cb();
            }
        });
    },

    scrollToSlideOnLoad: function() {
        if (!!window.location.hash) {
            var hash = window.location.hash,
                anchor = hash.substring(1);

            this.scrollToSlide('[data-anchor="' + anchor + '"]');
        }
    },

    setActiveNavItem: function(anchor) {
        $('.js-navigation__anchor').removeClass('active');
        $('[data-nav-anchor="' + anchor + '"]').addClass('active');
    },

    setFirstSlideActive: function() {
        this.selections.$slideContainer.first().addClass('active');
    },

    setInitActiveHorzSlide: function() {
        $('.container .slide:first-child').addClass('active');
    },

    setSlideHeight: function() {
        var self = this;

        this.selections.$slideContainer.each(function(index,val) {
            $(val).css('height', self.calcSlideHeight());
            $(val).find('.slide__align').css('height', self.calcSlideHeight());
        });
    },

    setSlideId: function() {
        $('.container').each(function(i,v){
            var $this = $(this);

            $this.data('slideId', i);
        });
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

    showVeil: function(isDown) {
        isDown ? $('body').addClass('veil-down') : $('body').addClass('veil-up');
    },

    transitionHorzSlide: function($el, distance) {
        $el.css('transform', 'translateX(' + distance + 'px)');
    },

    updateHash: function() {
        var $activeSlide = this.currentActiveSlide(),
            hash = $activeSlide.data('anchor');

            window.location.hash = hash;
    },

    updateActiveSlideOnclick: function(anchor) {
        this.selections.$navigationAnchor.removeClass('active');
        $('[data-nav-anchor="' + anchor + '"]').addClass('active');

        this.scrollToSlide('[data-anchor="' + anchor + '"]', this.hideVeil);
    },

    wrapElement: function($el, wrapStr) {
        $el.wrap(wrapStr);
    },

    bind: function() {
        var self = this;

        $('body').on('click', self.conf.navigationAnchor, function() {
            var $this  = $(this);
                anchor = $this.data('navAnchor'),
                nextSlideIndex = $('[data-anchor="' + anchor + '"]').index(),
                currentSlideIndex = $('.js-container.active').index();
                isDown = nextSlideIndex > currentSlideIndex ? true : false;

            self.showVeil(isDown);

            self.updateActiveSlideOnclick(anchor);
        });

        $('body').on('click', '.horz-nav--prev, .horz-nav--next', function(e) {
            e.preventDefault();
            var $slides = $(this).parents('.horizontal-slides').find('.slidesWrapper'),
                $currentActive = $slides.children('.active'),
                currentIndex = $currentActive.index(), // one-based index
                length = $slides.children('.slide').length;
                direction = $(this).data('horzNav'),
                distance = direction === "prev" ? -($(window).width() * (currentIndex - 1)) : -($(window).width() * (currentIndex + 1));

            if ( (direction === "prev" && currentIndex !== 0 ) || (direction == "next" && (currentIndex + 1)/length !== 1) ) {
                self.transitionHorzSlide($slides, distance);
                direction === "prev" ? $currentActive.prev().addClass('active') : $currentActive.next().addClass('active');
                $currentActive.removeClass('active');
            }
        });

        $(window).on('scroll', self.throttle(function () {
            self.checkActiveSlide();
            self.determineScrollDir();
        }, 100));

        $(window).resize(self.throttle(function(event) {
            self.setSlideHeight()
        }, 100));
    },

    init: function() {
        this.bind();
        this.createNavigation();
        this.positionNavigation();
        this.wrapElement(this.selections.$slideWrapper, '<div class="slide__align"></div>');
        this.setSlideHeight();
        this.setFirstSlideActive();
        this.createHorizontalSlide();
        this.setSlideId();
        this.scrollToSlideOnLoad();
        this.scrollToIntroSlide(this.conf.introSlide);
        this.appendVeilToBody();
    }
};

(function($) {
    slideNavigation.init();
}(jQuery));
