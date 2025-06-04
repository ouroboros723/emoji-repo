<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Services\ConcrntAuthService;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Exception;

class ConcrntAuthController extends Controller
{
    private ConcrntAuthService $concrntAuthService;

    public function __construct(ConcrntAuthService $concrntAuthService)
    {
        $this->concrntAuthService = $concrntAuthService;
    }

    /**
     * Concrnt認証を開始
     */
    public function redirectToConcrnt()
    {
        $callbackUrl = route('admin.auth.concrnt.callback');
        $appName = config('services.concrnt.app_name', config('app.name', 'Emoji Repository'));
        $authUrl = config('services.concrnt.auth_url', 'https://concrnt.world/authorize');

        $concrntAuthUrl = $authUrl . '?' . http_build_query([
            'redirect_url' => $callbackUrl,
            'app_name' => $appName,
        ]);

        return redirect($concrntAuthUrl);
    }

    /**
     * Concrnt認証のコールバック処理
     */
    public function handleConcrntCallback(Request $request)
    {
        try {
            $jwt = $request->query('jwt');
            $passport = $request->query('passport', '');

            if (!$jwt) {
                return redirect()->route('admin.login')
                    ->withErrors(['error' => 'JWT token is missing']);
            }

            // JWTを検証
            $result = $this->concrntAuthService->verifyJWT($jwt, $passport);

            // 必要な検証項目をチェック
            if ($result->audience !== route('admin.auth.concrnt.callback')) {
                return redirect()->route('admin.login')
                    ->withErrors(['error' => 'Invalid audience']);
            }

            if ($result->subject !== 'CONCRNT_3RD_PARTY_AUTH') {
                return redirect()->route('admin.login')
                    ->withErrors(['error' => 'Invalid subject']);
            }

            // 管理者を検索または作成
            $admin = $this->findOrCreateAdmin($result);

            // ログイン
            Auth::guard('api')->login($admin);

            return redirect()->route('admin.index')
                ->with('success', 'Concrnt認証でログインしました');

        } catch (Exception $e) {
            return redirect()->route('admin.login')
                ->withErrors(['error' => 'Concrnt認証に失敗しました: ' . $e->getMessage()]);
        }
    }

    /**
     * 管理者を検索または作成
     */
    private function findOrCreateAdmin($verifyResult): Admin
    {
        // principalをメールアドレスとして使用（実際の実装では適切な変換が必要）
        $email = $verifyResult->principal . '@concrnt.local';
        
        $admin = Admin::where('email', $email)->first();

        if (!$admin) {
            // 新しい管理者を作成
            $admin = Admin::create([
                'name' => $verifyResult->principal,
                'email' => $email,
                'password' => Hash::make(uniqid()), // ランダムパスワード
            ]);
        }

        return $admin;
    }

    /**
     * Concrnt認証でログアウト
     */
    public function logout(Request $request)
    {
        Auth::guard('api')->logout();
        
        return redirect()->route('admin.login')
            ->with('success', 'ログアウトしました');
    }
}
