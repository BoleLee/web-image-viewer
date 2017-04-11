
目标：slider左右切换图片预览，图片可缩放，放大情况下可平移查看，底部显示图片标题，总体效果如微信图片查看器

## 运行查看效果 ##
这是一个静态页面, 借助```browser-sync```在手机上查看即可

```
browser-sync start --server --files "css/*.css, js/*.js, *.html"
```

sass实时编译命令如下，也可借助```koala```等工具
```
sass --watch scss:css

```

## index.html ##

### 实现方式 ###

```amazeui Web组件 gallery(图片画廊)```
代码由amazeui定制所得，这里重命名为：```amazeui-gallery.js, amaze-ui/amazeui-gallery.scss```，由于定制的css可能少了需要的其他模块的代码，此处直接引用了整个amazeui的css代码，定制方法见[amazeui官网说明](http://amazeui.org/customize)。

此处字体图标路径做了修改，具体路径可通过自定义的sass变量```$icon-font-url```指定，此处设置为: '../fonts/amaze-ui/'。

js改写：改写标记：```// @modified ```
  1. zoom image container: 使大图预览的区域宽高为屏幕宽高
  2. big images src: get big images src from data-rel or lazyload images or src
  3. reset image: reset image scale and offset when slide activate
  4. actions toolbar: let actions toolbar always display
  5. big image extra text: get some extra info to display when preview a big image
  6. // TODO 图片切换滑动边界保护（图片放大状态可移动时）

  - 第1点：使大图预览的区域宽高为屏幕宽高
  - 第2点：当图片较多时，可能希望使用[lazyload](https://github.com/verlok/lazyload)或[jquery lazyload](https://github.com/tuupola/jquery_lazyload)来实现图片懒加载，则查看大图时应从```data-original```上获取图片路径；
  - 第3点：当放大查看某张图片，继而继续查看其他图片，再回到刚才被放大的图片时，将其zoom状态重置为初始状态
  - 第4点：查看大图状态下，会在有返回按钮和文字的视图与圆点导航的视图间切换，去掉这个，使一直在有返回按钮和文字的状态；
  - 第5点：查看大图时，除了显示图片标题外，可能还想显示其他文字内容，使用：```<img src="/to/image_path" alt="image_title" data-extra-info="其他文字内容">```
  - 第6点：当放大图片时，滑动查看图片边界时，容易被认为是滑动切换上下张，待改进，效果如微信图片查看

css改写：
  1. js改写第5点，查看大图时文字样式调整；
  2. 查看大图时，图片宽度若小于屏幕宽度，则使其铺满屏幕宽度；
  3. js改写第4点的css辅助，只改此css也可达到目的


实现方案： ```jQuery + Amaze UI + Hammer + PinchZoom, ``` 详细代码可查阅 ```amazeui-gallery.js```

amazeui.gallery.js图解：

![amazeui.gallery.js图解](/images/amazeui.gallery.js-map.png)


### 遇到的问题 ###

示例中下面一排图片，查看大图一直是通过a标签的方式，而不是amazeui写的purview的效果，而审查元素可以看到其html代码是生成了的；我把代码搬到```CodePen```上，结果是都能正常使用预览大图的交互，不知原因是什么，怎么解决？
[CodePen Demo代码](https://codepen.io/gracelee/pen/yMWavv)
[CodePen Demo效果: Debug Mode](http://s.codepen.io/gracelee/debug/yMWavv/dXAqBbdeZzbk)

更新：2017-04-07
将amazeui.gallery代码放到最后加载，发现效果就正常了；
猜测原因：图片的数据由js或html模板(如rails erb, laravel blade)渲染的话，需要保证等到数据渲染完毕后，再运行gallery的代码；
由于gallery执行时不需要执行某一句js代码，没有办法通过调整该代码何时执行来达到目标，不知道有没有能不能将查看大图这个功能给暴露出来，需要时执行

[问题链接](https://github.com/amazeui/amazeui/issues/958)



## index.owl.carousel.html ##

使用```owl.carousel```实现slider查看图片

### 主要实现方式 ###

slider功能：```owl.carousel```

缩放功能：```hammer.js```, ```hammer-zoomImg.js```


### 缺点 ###
缩放平移无限制界限，图片平移后容易相互交叉
IOS上图片过多时，预览大图会自动刷新页面，无法预览



## index.pinchzoom.html ##

受```amazeui gallery```启发，感觉可以根据自己的需要，直接用```pinchzoom```和slider组合来实现图片查看器效果，尝试了```owl.carousel+zoompinch```, 目前未成功，遇到问题：当加上pinchzoom的代码，图片就看不到了，而直接写一张图片测试，是可以的，不知道```pinchzoom```是跟```owl.carousel```有什么矛盾？

