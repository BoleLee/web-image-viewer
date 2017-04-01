/**
  * 此代码修改自：https://github.com/luzuoquan/hammer-pinch
  * @BoleLee(964624188@qq.com) 
  * 2017-04-01
  */

(function(){
  var zoomImg = function(id){
    this._id = document.querySelector(id);
    this.mc = new Hammer.Manager(this._id);
    this.translateX = 0;
    this.translateY = 0;
    this.scale = 1;
    this.firstTouch = true; //用户第一次触摸
    this._relateX = (document.body.clientWidth - this._id.offsetWidth)/2;
    this._relateY = (document.body.clientHeight - this._id.offsetHeight)/2;
    this._oldX = 0;
    this._oldY = 0;
    this._oldScale = 1;
    this.MaxScale = 2.0;
    this.MinScale = 1.0;
  };
  zoomImg.prototype = {
    constructor: zoomImg,
    picAnimate: function(){
      return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {  
        setTimeout(callback, 1000 / 60);  
      }; 
    },
    _setPosition: function(){
      var that = this;

      that._selfPosition({
        translateX: 0,
        translateY: 0,
        scale: that.scale
      });
    },
    _selfPosition: function(pos){
      var that = this;

      // TODO 限制平移界限
      // if(pos.scale <= 1 || Math.abs(pos.translateX) > Math.abs(that._relateX) ) {
      //   pos.translateX = that._oldX;
      // }
      // if(pos.scale <= 1 || Math.abs(pos.translateY) > Math.abs(that._relateY) ) {
      //   pos.translateY = that._oldY;
      // }

      // 限制缩放界限
      if(pos.scale > that.MaxScale ) {
        pos.scale = that.MaxScale;
      }
      if(pos.scale < that.MinScale) {
        pos.scale = that.MinScale;
      }

      var _pos = function(){
        var _style = [
          'translate3d(' + pos.translateX + 'px,' + pos.translateY + 'px,0)',
          'scale(' + pos.scale + ',' + pos.scale + ')'
        ]
        _style = _style.join(' ');
        that._id.style.transform = _style;
        that._id.innerHTML = _style;
      };
      that._picAnimate(_pos);
    },
    _picAnimate: function(fn){
      return this.picAnimate()(fn);
    },
    picInit: function(){
      var that = this;
      that.mc.on("hammer.input", function(ev){
        if(ev.isFinal) {
          that._oldX = that.translateX;
          that._oldY = that.translateY;
          that._oldScale = that.scale;
          // that._relateX = (document.body.clientWidth - this._id.offsetWidth)/2 * that._oldScale;
          // that._relateY = (document.body.clientHeight - this._id.offsetHeight)/2 * that._oldScale;
        }
      });
      that.mc.add( new Hammer.Pan({
        direction: Hammer.DIRECTION_ALL,
        threshold: 0, 
        pointers: 0
      }));
      that.mc.add(new Hammer.Pinch({
        threshold: 0
      })).recognizeWith(that.mc.get('pan'));

      // ! add doubletap before singletap, or doubletap will never be fired!
      // issue see: https://github.com/hammerjs/hammer.js/issues/912
      that.mc.add( new Hammer.Tap({ 
        event: 'doubletap', 
        taps: 2
      }) );
      that.mc.add( new Hammer.Tap({
        event: 'singletap'
      }) );
      that.mc.get('doubletap').recognizeWith('singletap');
      that.mc.get('singletap').requireFailure('doubletap');


      that.mc.on('panstart panmove', _onPan);
      that.mc.on('pinchstart pinchmove', _onPinch);
      that.mc.on('doubletap', _onDoubleTap);
      // that.mc.on('singletap', _onSingleTap);

      that._setPosition();

      function _onPan(ev){
        if(that.firstTouch) {
          that._oldX = 0;
          that._oldY = 0;
          that.firstTouch = false;
        };

        that.translateX = that._oldX + ev.deltaX;
        that.translateY = that._oldY + ev.deltaY;

        var _position = {
          translateX: that.translateX,
          translateY: that.translateY,
          scale: that.scale
        };
        
        that._selfPosition(_position);
      };

      function _onPinch(ev) {

        that.scale = that._oldScale * ev.scale;

        that._selfPosition({
          translateX: that.translateX,
          translateY: that.translateY,
          scale: that.scale
        });
      };

      function _onSingleTap(ev) {
        MaskHelper.beforeClose('mask-open');
        $(".J_zoom").hide();
      };

      function _onDoubleTap(ev) {

        if(that.firstTouch) {
          that._oldX = 0;
          that._oldY = 0;
          that.firstTouch = false;
        };

        if(that.scale > 1) {
          that.scale = 1;
        } else {
          that.scale = that.MaxScale;
        }

        that._selfPosition({
          translateX: that.translateX,
          translateY: that.translateY,
          scale: that.scale
        });

      };

    }
  };
  window.zoomImg = zoomImg;
})()
