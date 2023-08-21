<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ホーム画面に表示されるアプリアイコン -->
{{--    <link rel="apple-touch-icon" href="/img/common/logo-icon.svg"/>--}}
    <!-- アドレスバー等のブラウザのUIを非表示 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- default（Safariと同じ） / black（黒） / black-translucent（ステータスバーをコンテンツに含める） -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- ホーム画面に表示されるアプリ名 -->
    <meta name="apple-mobile-web-app-title" content="カクテル注文"/>

    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="white"/>
    <meta name="apple-mobile-web-app-title" content="bagelee"/>
    <link rel="apple-touch-icon" href="{{asset('/img/common/app-icon.png')}}" sizes="144x144"/>
{{--    <link rel="manifest" href="/js/manifest.json"/>--}}
</head>
<body>
<div id="root" data-props='{"siteTitle": "{{Config::get('app.name')}}"}'>
    {{--    @include('admin.parts.common.loading-spinner')--}}
</div>
<script src="https://cdn.geolonia.com/community-geocoder.js"></script>
<script src="{{ mix('admin-js/app.js') }}"></script>
<link href="{{ mix('admin-css/app.css') }}" rel="stylesheet" />
<script src="https://ajaxzip3.github.io/ajaxzip3.js" charset="UTF-8"></script>
@csrf
</body>
