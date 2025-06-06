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

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('/manifest.json') }}"/>

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#000000"/>
    <meta name="msapplication-TileColor" content="#000000"/>
    <meta name="msapplication-TileImage" content="{{ asset('/icons/icon-144x144.png') }}"/>

    <!-- Additional PWA Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/icons/icon-32x32.png') }}"/>
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('/icons/icon-16x16.png') }}"/>
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/icons/icon-180x180.png') }}"/>
    <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('/icons/icon-152x152.png') }}"/>
    <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('/icons/icon-144x144.png') }}"/>
    <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('/icons/icon-120x120.png') }}"/>
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('/icons/icon-114x114.png') }}"/>
    <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('/icons/icon-76x76.png') }}"/>
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('/icons/icon-72x72.png') }}"/>
    <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('/icons/icon-60x60.png') }}"/>
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('/icons/icon-57x57.png') }}"/>

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

<!-- PWA Service Worker Registration -->
{{--<script>--}}
{{--if ('serviceWorker' in navigator) {--}}
{{--    window.addEventListener('load', function() {--}}
{{--        navigator.serviceWorker.register('/sw.js')--}}
{{--            .then(function(registration) {--}}
{{--                console.log('ServiceWorker registration successful with scope: ', registration.scope);--}}

{{--                // アップデートチェック--}}
{{--                registration.addEventListener('updatefound', () => {--}}
{{--                    const newWorker = registration.installing;--}}
{{--                    newWorker.addEventListener('statechange', () => {--}}
{{--                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {--}}
{{--                            // 新しいコンテンツが利用可能--}}
{{--                            if (confirm('新しいバージョンが利用可能です。更新しますか？')) {--}}
{{--                                window.location.reload();--}}
{{--                            }--}}
{{--                        }--}}
{{--                    });--}}
{{--                });--}}
{{--            })--}}
{{--            .catch(function(err) {--}}
{{--                console.log('ServiceWorker registration failed: ', err);--}}
{{--            });--}}
{{--    });--}}
{{--}--}}

{{--// PWA インストールプロンプト--}}
{{--let deferredPrompt;--}}
{{--window.addEventListener('beforeinstallprompt', (e) => {--}}
{{--    console.log('PWA install prompt triggered');--}}
{{--    e.preventDefault();--}}
{{--    deferredPrompt = e;--}}

{{--    // インストールボタンを表示する場合はここで実装--}}
{{--    // showInstallButton();--}}
{{--});--}}

{{--// PWA インストール関数（必要に応じて呼び出し）--}}
{{--function installPWA() {--}}
{{--    if (deferredPrompt) {--}}
{{--        deferredPrompt.prompt();--}}
{{--        deferredPrompt.userChoice.then((choiceResult) => {--}}
{{--            if (choiceResult.outcome === 'accepted') {--}}
{{--                console.log('User accepted the PWA install prompt');--}}
{{--            } else {--}}
{{--                console.log('User dismissed the PWA install prompt');--}}
{{--            }--}}
{{--            deferredPrompt = null;--}}
{{--        });--}}
{{--    }--}}
{{--}--}}

{{--// PWA がインストールされた時の処理--}}
{{--window.addEventListener('appinstalled', (evt) => {--}}
{{--    console.log('PWA was installed');--}}
{{--});--}}
</script>

@csrf
</body>
