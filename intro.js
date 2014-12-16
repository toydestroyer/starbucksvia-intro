//= require raf
//= require preloadjs-0.4.1.min
//= require TweenMax.min
//= require jquery.superscrollorama
//= require jquery.modal
//= require jquery.placeholder
//= require_self

;(function($) {
  'use strict';

  var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints || navigator.maxTouchPoints;
  var isScrollerOff = isTouch || $('html').hasClass('lt-ie9') || !$('html').hasClass('csscalc');

  if (isScrollerOff) {
  // if (true) {
    $('input').placeholder();
    var startAction = function() {
      $('#action').show();
    };
  } else {

    var seqStart = (function() {
      var exec = false;
      return function(i) {
        if (exec) return;
        $("#seq").children().eq(i++).addClass("hidden");
        $("#seq").children().eq(i).removeClass("hidden");
        if (i < 23) {
          window.requestAnimationFrame(function() {
            seqStart(i);
          });
        } else {
          exec = true;
        }
      }
    })();

    /* load image for seq */
    (function() {

      function zeroPadder(str) {
        if(String(str).length === 1) {
            str = '0' + String(str);
        } else {
            str = String(str);
        }
        return str;
      }

      var totalFrames = 23,
          startFrame = 1,
          preffix = "http://423ffea0fcee8400e7e6-77492e98afcc308b236d945d306a01e0.r0.cf3.rackcdn.com/frame",
          suffix = ".png",
          manifest = [];

      for (var i = startFrame; i < totalFrames; i++) {
        var index = zeroPadder(i);
        var el = $('<img class="hidden" src="' + preffix + index + suffix + '" alt="">');
        el.appendTo($("#seq"));
        manifest.push({ 'src': el.attr("src"), 'id': el });
      }

      var el = $('<img class="hidden" src="http://423ffea0fcee8400e7e6-77492e98afcc308b236d945d306a01e0.r0.cf3.rackcdn.com/final-frame.png" alt="">')
      el.appendTo($("#seq"));
      manifest.push({ 'src': el.attr("src"), 'id': el });

      var preload = new createjs.LoadQueue(false);
      preload.addEventListener("complete", handleComplete);
      preload.loadManifest(manifest);

      function handleComplete() {
        $('#seq-wrapper .loader').fadeOut(200, function() {
          $('#seq-wrapper .scroll-down').fadeIn(200);
        });
      }
    })(); /* /seq */

    var $wHeight = (function() {
      var height = 630;
      var wHeight = $(window).height();
      if (wHeight > height) height = wHeight;
      return height;
    })();

    setTimeout(function() { $('html, body').scrollTop(0); }, 100);
    $('body').addClass('scroller-on');

    // if ($('#action').css('top') == 'null') {
    //   alert('safari issue');
    // }

    var scrollorama = $.superscrollorama();

    $(window).resize(function () {
      // recalculate $(window).height()
      scrollorama.triggerCheckAnim();
    });

    var tl1 = new TimelineLite({onStart: function() {
      $('#seq-wrapper .helpers').fadeOut(200);
    }});

    tl1.append(
        [
          TweenLite.to( $('#to-go .are-you'), 1, {css: {opacity: 0, marginLeft: -300} }),
          TweenLite.to( $('#to-go .to'),      1, {css: {opacity: 0, marginLeft: 0}}),
          TweenLite.to( $('#to-go .go'),      1, {css: {opacity: 0, marginLeft: 0}})
        ]
      ).append(
        [
          TweenLite.from( $('#what-is-your-name .what-is'),    1, {css: {opacity: 0, marginLeft: -256}}),
          TweenLite.from( $('#what-is-your-name .your'),    1, {css: {opacity: 0, marginLeft: -256}}),
          TweenLite.from( $('#what-is-your-name .name'),  1, {css: {opacity: 0, marginLeft: -256}}),
          TweenLite.from( $('#set-name-wrapper'), 1, {css: {opacity: 0, display: 'none', marginLeft: -0}, onComplete: function() { $('#set-name-input').focus(); }}),
          TweenLite.to( $('#set-name-wrapper'), 1, {delay: .5, css: {zIndex: 1}})
        ]
      );

    scrollorama.pin($("#init"), 500, {
      anim: tl1,
      pushFollowers: false
    });

    var startAction = function() {
      $('#freshly-brewed .wrap').height($wHeight);
      $('#action').show();

      tl1.append(
          [
            TweenLite.set( $('#set-name-wrapper'), { css: {zIndex: 0} } ),
            TweenLite.to( $('#set-name-wrapper'), 1, {css: {opacity: 0, display: 'none', marginLeft: -0}}),
            TweenLite.to( $('#what-is-your-name .what-is'),    1, {css: {opacity: 0, marginLeft: -256}}),
            TweenLite.to( $('#what-is-your-name .your'),    1, {css: {opacity: 0, marginLeft: -256}, onComplete: function(){
              seqStart(0);
            }}),
            TweenLite.to( $('#what-is-your-name .name'),  1, {css: {opacity: 0, marginLeft: -256}})
          ]
        ).to(window, ($wHeight - 200) / 200, { tmp: 1 });

      scrollorama.updatePin($("#init"), ($wHeight + 500), { anim: tl1 });

      var tl2 = (new TimelineLite()).append(
          [
            TweenLite.from($('#freshly-brewed .for-you'), .5, { css: {  marginLeft: '-=250', opacity: 0 } }),
            TweenLite.from($('#freshly-brewed .to-go, #freshly-brewed .s-above'), .5, { css: {  marginLeft: '+=250', opacity: 0 } }),
            TweenLite.from($('#freshly-brewed .are-ready'), .4, { css: {  marginLeft: '+=300', opacity: 0 } }),
            (new TimelineLite())
              .from($('#freshly-brewed .bag'), .8, { css: { marginTop: '+=500' } })
              .to($('#freshly-brewed .bag'), .1, { css: { marginTop: '-=20' } })
              .to($('#freshly-brewed .bag'), .1, { css: { marginTop: '+=20' } }),
            TweenLite.from($('#freshly-brewed .stick'), .1, {delay: .5, css: { opacity: 0 } }),
            TweenLite.fromTo($('#freshly-brewed .stick'), 1.5, {css: { marginTop: "-=500" } }, {delay: .5,  css: { marginTop: "256px" } })
          ]
        ).append([
          TweenLite.to($('#freshly-brewed .stick'), .1, { css: { opacity: 0 } }),
          TweenLite.to($('#freshly-brewed .for-you'), .5, { css: {  marginTop: '-=250', opacity: 0 } }),
          TweenLite.to($('#freshly-brewed .freshly-brewed'), .5, { css: {  marginTop: '-=250', opacity: 0 } }),
          TweenLite.to($('#freshly-brewed .to-go, #freshly-brewed .s-above'), .5, { css: {  marginTop: '-=250', opacity: 0 } }),
          TweenLite.to($('#freshly-brewed .are-ready'), .5, { css: {  marginTop: '-=250', opacity: 0 } }),
          TweenLite.to($('#freshly-brewed .bag'), .4, { delay: .1, css: { marginTop: '-=256' } })
        ]).append([
          (new TimelineLite()).append([
            TweenLite.fromTo($('#freshly-brewed .on-the-way'), 1.5, { css: { marginLeft: -300, marginTop: -53 } }, { css: { marginLeft: '100%', marginTop: -53 } })
          ])
        ]);

      scrollorama.pin($('#freshly-brewed'), (1250 + $wHeight), { pushFollowers: false });

      scrollorama.pin($('#x-ray'), 500, { pushFollowers: false, anim: (new TimelineLite({})).append(
          [
            TweenLite.to($('#x-ray, #x-ray .stick'), 1, { css: { backgroundAttachment: 'scroll' } }),
            TweenLite.from($('#x-ray .x-bag-left'), .5, { css: { marginLeft: '-=500' } }),
            TweenLite.from($('#x-ray .x-bag-left'), .1, { css: { opacity: 0 } }),
            TweenLite.from($('#x-ray .x-bag-right'), .5, { css: { marginLeft: '+=500' } }),
            TweenLite.from($('#x-ray .x-bag-right'), .1, { css: { opacity: 0 } }),
            (new TimelineLite({delay: .5}))
              .to($('#x-ray .stick'), .1, { css: { rotation: 10 } })
              .to($('#x-ray .stick'), .1, { css: { rotation: 0 } })
              .to($('#x-ray .stick'), .1, { css: { rotation: -10 } })
              .to($('#x-ray .stick'), .1, { css: { rotation: 0 } })
              .to($('#x-ray .stick'), .1, { css: { rotation: 0 } })
          ]
        ) });

      scrollorama.addTween(($wHeight*2+400), tl2, 2000); /* position #freshly-brewed -100px */

      var tl3 = (new TimelineLite())
        .append([
          (new TimelineLite({delay: .5})).append([
            TweenLite.to($('#at-home-at-work .at-home'), 1, { css: { marginLeft: '-=500', opacity: 0 } }),
            TweenLite.to($('#at-home-at-work .at-work'), 1, { css: { marginLeft: '+=500', opacity: 0 } })
          ]),
          TweenLite.from($('#handy .handy'), 1, { css: { marginTop: '-=300', opacity: 0 } })
        ]).append([
          TweenLite.from($('#handy .pack, #handy .cm11'), .5, { css: { marginTop: '+=300', opacity: 0 } })
        ]).append([
          TweenLite.to($('#handy .handy, #handy .pack, #handy .cm11'), 1, { delay: 1, css: { marginTop: '-=500', opacity: 0 } })
        ]).append([
          TweenLite.from($('#x12 .x12'), 1, { css: { marginLeft: '-=500', opacity: 0 } }),
          TweenLite.from($('#x12 .package'), 1, { css: { marginLeft: '+=500', opacity: 0 } })
        ]).append([
          TweenLite.to($('#x12 .x12, #x12 .package'), 1, { delay: 1, css: { marginTop: '-=500', opacity: 0 } })
        ]).append([
          (new TimelineLite())
            .staggerFrom([$('#your-favorite .learn-more'), $('#your-favorite .your'), $('#your-favorite .favorite'), $('#your-favorite .blends'), $('#your-favorite .special'), $('#your-favorite .roast'), $('#your-favorite .starbucks')].reverse(), 2, { css: { marginTop: "-=50px", opacity: 0, display: "none" } }, .1)
        ]);

      scrollorama.addTween(($wHeight*4+2250), tl3, 1200); //

      var tl4 = (new TimelineLite())
        .staggerFrom($('#sticks .stagger'), 1, { css: { marginTop: "+=50px", opacity: 0 } }, .1);

      var tl5 = (new TimelineLite())
        .from($('#always-with-you .stagger, #is-ready .logo'), 1, { css: { marginTop: "-=50px", opacity: 0 } })
        .append([
          (new TimelineLite({delay: .5}))
            .staggerTo($('#always-with-you .stagger'), 1, { css: { marginLeft: "-=500px", opacity: 0 }}, .2)
        ])
        .staggerFrom($('#is-ready .stagger'), 1, { css: { marginTop: '-=50px', opacity: 0 } }, .2)
        .from($('#is-ready .get-it'), 1, { css: { scale: 2, opacity: 0 } });

      scrollorama.addTween(($wHeight*4+2250 + 1000), tl4, 200); //

      scrollorama.addTween(($wHeight*5+2250 + 1200 + 524), tl5, 1000); //

      scrollorama.pin($('#sticks'), 1200 + $wHeight, { pushFollowers: false });
      scrollorama.pin($('#features'), 1200 + $wHeight + 524, { pushFollowers: false });
      scrollorama.pin($('#outro'), 1000, { pushFollowers: false });

    } /* / startAction */

  }

  /* get firstname from storage */
  var firstname = store.get("firstname");
  if (firstname != "undefined") {
    $("#set-name .firstname").val(firstname);
  }

  $("#set-name .firstname").on("change keyup", function() {
    if(!$(this).val().length) {
      $("#set-name .ok").attr("disabled", "disabled");
    } else {
      $("#set-name .ok").removeAttr("disabled");
    }
  }).trigger('change');

  $("#set-name").one("submit", function(e) {
    e.preventDefault();
    startAction();
    var firstname = $("#set-name .firstname").val();
    store.set("firstname", firstname);
    $(".firstname-placeholder").text(firstname);
    $("#subscribe-form input[name='firstname']").val(firstname);
    $("#set-name .ok").addClass("submitted").attr("disabled");
    $("#set-name fieldset").fadeOut(200, function() {
      $("#set-name .thank-you").fadeIn(200);
    });
  });

  $('#subscribe-form').on('submit', function(e) {
    e.preventDefault();
    var firstname = $('#subscribe-form input[name="firstname"]');
    var lastname = $('#subscribe-form input[name="lastname"]');
    var email = $('#subscribe-form input[name="email"]');
    var phone = $('#subscribe-form input[name="phone"]');
    var complete = true;
    if (!firstname.val()) { firstname.addClass('invalid'); complete = false; } else { firstname.removeClass('invalid'); }
    if (!(/\S+@\S+/).test(email.val())) { email.addClass('invalid'); complete = false; } else { email.removeClass('invalid'); }
    if (complete) {
      $('#get-it .step1').addClass('locked');
      var url = $(this).attr('action');
      var data = $(this).serialize();
      $.post(url, data, function(d) {
        $('#get-it .step1').removeClass('locked');
        if (d.success) {
          $('#get-it .step1').hide();
          $('#get-it .step2 .no-thanks').on('click', function(e) {
            store.set('skip', true);
            e.preventDefault();
            $('#get-it .step2').hide();
            $('#get-it .headline').html('Подарочный купон на дегустационный набор <span class="orange">Starbucks VIA<sup>&reg;</sup>!</span>');
            $('#get-it .step3e .first-and-lastname').html(firstname.val() + " " + lastname.val());
            $('#get-it .step3e .email').text(email.val());
            $('#get-it .step3e').show();
            $('#footer').addClass('expanded');
            $.modal.resize();
          });
          // if(store.get('skip')) {
            // $('#get-it .step2 .no-thanks').trigger('click');
          // } else {
            $('#get-it .step1').hide();
            $('#get-it .headline').html('Будьте в курсе наших новостей. Подпишитесь на <span class="orange">Starbucks</span> ВКонтакте');
            $('#get-it .step2').show();

            /* load VK wigets */
            $.getScript('//vk.com/js/api/openapi.js?105', function() {
                VK.Widgets.Subscribe("vk_subscribe", {mode: 1}, -54906556);
                VK.Observer.subscribe('widgets.subscribed', function() {
                  $('#get-it .step2 .no-thanks').trigger('click');
                });
              });
            /* load Twitter wigets */
            // !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
            /* load Facebook wigets */
            // (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
            $.modal.resize();
          // }
        } else {
          if (d.errors.firstname) { firstname.addClass('invalid'); complete = false; } else { firstname.removeClass('invalid'); }
          if (d.errors.email) { email.addClass('invalid'); complete = false; } else { email.removeClass('invalid'); }
        }
      });
    }
  });

  $('#vk-oauth-go').on('click', function(e) {
    e.preventDefault();

    store.remove('vk');
    store.remove('success');

    $('#get-it .step1').addClass('locked');
    var vkOAuthWindow = window.open('/oauth');
    var vaOAuthInterval = setInterval(function() {
      if (!vkOAuthWindow.closed) return;
      clearInterval(vaOAuthInterval);
      $('#get-it .step1').removeClass('locked');
      if (store.get('success')) {
        $('#get-it .step1').hide();
        var vk = store.get('vk');
        $('#get-it .step2 .no-thanks').on('click', function(e) {
          e.preventDefault();
          $('#get-it .step2').hide();
          $('#get-it .headline').html('Подарочный купон дегустационный набор <span class="orange">Starbucks VIA<sup>&reg;</sup>!</span>');
          $('#get-it .step3 .first-and-lastname').html(vk.firstname + " " + vk.lastname);
          $('#get-it .step3 .number-fallback').text(vk.number);
          $('#get-it .step3 .complete .email').text(vk.email);
          $('#get-it .step3 .print').attr('href', vk.printPath);
          $('#get-it .step3 .qr').append('<img src="data:image/png;base64,' + vk.qr64 + '" width="200" height="200" alt="' + vk.number + '" title="' + vk.number + '">');
          $('#get-it .step3').show();
          $.modal.resize();
          $('#footer').addClass('expanded');
        });
        if(vk.isSubscribed) {
          $('#get-it .step2 .no-thanks').trigger('click');
        } else {
          $('#get-it .headline').html('Будьте в курсе наших новостей. Подпишитесь на <span class="orange">Starbucks</span> ВКонтакте');
          $('#get-it .step2').show();
          /* load VK wigets */
          $.getScript('//vk.com/js/api/openapi.js?105', function() {
              VK.Widgets.Subscribe("vk_subscribe", {mode: 1}, -54906556);
              VK.Observer.subscribe('widgets.subscribed', function() {
                $('#get-it .step2 .no-thanks').trigger('click');
              });
            });
          /* load Twitter wigets */
          // !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
          /* load Facebook wigets */
          // (function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
          $.modal.resize();
        }
      } else {
        alert('Не удалось авторизоваться через ВКонтакте.\nПопробуйте позднее, либо заполните форму.');
      }
    }, 1000);
  });

})(jQuery);
