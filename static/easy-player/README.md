# easy-player

> 集 rtmp, hls, websocket 于一身的`网页直播/点播`播放器, 使用简单, 功能强大, 下面这张图在一个网页上演示了 rtmp流, hls流, websocket流的播放效果

![](http://ww1.sinaimg.cn/large/79414a05gy1fmpjkmmm57j20cz0lutjj.jpg)

## HTML 集成示例

```html
<!DOCTYPE HTML>
<html>
    <head>
        <title>easy-player</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" name="viewport">
    <body>      
        <easy-player video-url="rtmp://live.hkstv.hk.lxdns.com/live/hks" live="true"></easy-player>
        <easy-player video-url="http://www.easydss.com:10088/videos/demo/video.m3u8" live="false"></easy-player>
        <easy-player video-url="ws://121.40.210.97:3000/play?stream=rtsp://admin:zljk@12345@221.226.23.58:5504/Streaming/Channels/102"></easy-player>
    <script type="text/javascript" src="easy-player-element.min.js"></script></body>
</html>
```

## 配置属性

- `video-url` 视频流地址 String default ''
- `video-title` 视频右上角显示的标题 String default ''
- `snap-url` 视频封面图片 String default ''
- `auto-play` 自动播放 Boolean default true
- `live` 是否直播, 标识要不要显示进度条 Boolean default false
- `alt` 视频流地址没有指定情况下, 视频所在区域显示的文字, 相当于 html img 标签的 alt 属性 String default '无信号'
- `muted` 是否静音 Boolean default false
- `aspect` 视频显示区域的宽高比 String default '16:9'
- `loading` 指示加载状态, 支持 sync 修饰符
- `fluent` 流畅模式, Boolean default true

## 事件回调

- `message` 触发通知消息, 参数: { type: '', message: ''}
- `ended` 播放结束, 参数: 无
- `timeupdate` 进度更新, 参数: 当前时间进度
- `pause` 暂停, 参数: 当前时间进度
- `play` 播放, 参数: 当前时间进度

## 编译步骤

``` bash
# 安装依赖库
npm install easy-player

# 以开发模式运行
npm run start

# 编译发布包
npm run build
```