
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


## index-owl.carousel ##

使用```owl.carousel```实现slider查看图片

### 主要实现方式 ###

slider功能：```owl.carousel```

缩放功能：```hammer.js```, ```hammer-zoomImg.js```


### 缺点 ###
缩放平移无限制界限，图片平移后容易相互交叉
IOS上图片过多时，预览大图会自动刷新页面，无法预览
