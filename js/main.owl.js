$(function() {

  var prev = new Vue({
    el: '#V_imgs_prev',
    data: {
      images: [{
        image_url: 'images/1.jpg',
        description: '图片1'
      }, {
        image_url: 'images/2.jpg',
        description: '图片2'
      }, {
        image_url: 'images/3.jpg',
        description: '图片3'
      }, {
        image_url: 'images/4.png',
        description: '图片4'
      }]
    },
    mounted: function() {
      var vm = this;

      var owlBgimg = $("#J_owl_imgs");
      owlBgimg.owlCarousel({
        items: 1,
        autoWidth:true,
        center: true
      });

      // 缩放图片：双击缩放，单击关闭，手指可缩放、移动
      for(var i=0, l = vm.images.length; i<l; i++) {
        var id = '#J_imgzooming_'+i;
        var zooming = new zoomImg(id);
        zooming.picInit();
      }

    }
  });


});