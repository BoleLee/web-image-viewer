
demo目标：slider左右切换图片预览，图片可缩放，放大情况下可平移查看，底部显示图片标题，总体效果如微信图片查看器

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

js改写：使大图预览的区域宽高为屏幕宽高，改写标记：```// @modified ```

方案： ```jQuery + UI + Hammer + PinchZoom, ``` 详细代码可查阅 ```amazeui-gallery.js```

### 当前遇到问题 ###

示例中下面一排图片，查看大图一直是通过a标签的方式，而不是amazeui写的purview的效果，而审查元素可以看到其html代码是生成了的；我把代码搬到```CodePen```上，结果是都能正常使用预览大图的交互，不知原因是什么，怎么解决？
[CodePen Demo代码](https://codepen.io/gracelee/pen/yMWavv)
[CodePen Demo效果: Debug Mode](http://s.codepen.io/gracelee/debug/yMWavv/dXAqBbdeZzbk)



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

