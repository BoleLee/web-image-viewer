
demo内容：slider查看图片，图片可缩放、平移

## 运行 ##
这是一个静态页面, 借助```browser-sync```在手机上查看即可

```
browser-sync start --server --files "css/*.css, js/*.js, *.html"
```

sass实时编译命令如下，也可借助```koala```等工具
```
sass --watch scss:css

```

## 主要实现方式 ##

slider功能：```owl.carousel```

缩放功能：```hammer.js```, ```hammer-zoomImg.js```


## TODO ##
缩放平移未限制界限，改进中...

