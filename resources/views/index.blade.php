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

    @if(!empty(Config::get('app.google_analytics.gtag')))
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{Config::get('app.google_analytics.gtag')}}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '{{Config::get('app.google_analytics.gtag')}}');
        </script>
    @endif
</head>
<body>
<div id="root" data-props='{"siteTitle": "{{Config::get('app.name')}}", "concurrentRedirectUrl": "{!!Config::get('app.concurrent_redirect_url')!!}", "adminConcrntUrl": "{!!Config::get('app.admin_concrnt_url')!!}"}'>
    {{--    @include('admin.parts.common.loading-spinner')--}}
</div>
<script src="https://cdn.geolonia.com/community-geocoder.js"></script>
<script src="{{ mix('js/app.js') }}"></script>
<link href="{{ mix('css/app.css') }}" rel="stylesheet" />
<script src="https://ajaxzip3.github.io/ajaxzip3.js" charset="UTF-8"></script>
@csrf
</body>
