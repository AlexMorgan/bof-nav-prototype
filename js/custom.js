var slideNavigation = {
    conf: {
        slideWrapper: '.js-slide__wrapper'
    },

    selectors: {
        $slide: $('.js-container')
    },

    settings: {
        isDev: true,
        lastScrollTop: 0
    },

    activateNextSlide: function() {
        var $activeSlide = this.currentActiveSlide(),
            $nextActiveSlide = $activeSlide.next();

            this.removeCurrentActiveSlide();
            $nextActiveSlide.addClass('active');
    },

    activatePrevSlide: function() {
        var $activeSlide = this.currentActiveSlide(),
            $prevActiveSlide = $activeSlide.prev();

            // Dont remove active class on first slide on scroll up
            $activeSlide.data('slideId') !== 0 && this.removeCurrentActiveSlide();
            $prevActiveSlide.addClass('active');
    },

    checkForActiveSlide: function() {
        var direction = this.determineScrollDir();

        if (direction === 'down') {
            if ( this.calcNextSlideDepth(direction) <= 0 ) {
                this.activateNextSlide();
            }
        } else if (direction === 'up') {
            if ( this.calcPrevSlideDepth(direction) >= 0 ) {
                this.activatePrevSlide();
            }
        }
    },

    calcNextSlideDepth: function(dir) {
        var scrollTop     = $(window).scrollTop(),
            elementOffset = dir === "down" ? $('.container.active').next().offset().top : elementOffset = $('.container.active').offset().top,
            distance      = (elementOffset - scrollTop);

            this.settings.isDev === true && console.log('Distance: ', distance);

            return distance;
    },

    calcPrevSlideDepth: function() {
        var scrollTop     = $(window).scrollTop(),
            elementOffset = $('.container.active').offset().top,
            distance      = (elementOffset - scrollTop);

            this.settings.isDev === true && console.log('Distance: ', distance);

            return distance;
    },

    calcSlideHeight: function() {
        return window.innerHeight;
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

    logMsg: function(msg) {
        console.log(msg);
    },

    currentActiveSlide: function() {
        return $activeSlide = $('.container.active');
    },

    removeCurrentActiveSlide: function() {
        var $activeSlide = this.currentActiveSlide();

        $activeSlide.removeClass('active');
    },

    setFirstSlideActive: function() {
        this.selectors.$slide.first().addClass('active');
    },


    setSlideHeight: function() {
        var self = this;

        this.selectors.$slide.each(function(index,val) {
            $(val).css('height', self.calcSlideHeight());
            $(val).children('.slide__align').css('height', self.calcSlideHeight());
        });
    },

    setSlideId: function() {
        $('.container').each(function(i,v){
            $(this).data('slideId', i);
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

    wrapElement: function(el, wrapStr) {
        $( el).wrap(wrapStr);
    },

    bind: function() {
        var self = this;

        $(window).on('scroll', self.throttle(function () {
            self.checkForActiveSlide();
            self.determineScrollDir();
        }, 100));

        $(window).resize(self.throttle(function(event) {
            self.setSlideHeight()
        }, 500));
    },

    init: function() {
        this.bind();
        this.wrapElement(this.conf.slideWrapper, '<div class="slide__align"></div>');
        this.setSlideHeight();
        this.setFirstSlideActive();
        this.setSlideId();
    }
};

(function($) {
    slideNavigation.init();
}(jQuery));
