<?php

namespace App\Services;

use Exception;
use DateTime;
use kornrunner\Keccak;

class ConcrntAuthService
{
    /**
     * Keccak256ハッシュを計算
     */
    private function getHash(string $data): string
    {
        return Keccak::hash($data, 256);
    }

    /**
     * 署名を検証（簡易版）
     */
    private function verifySignature(string $message, string $signature, string $address): bool
    {
        try {
            // 実際の実装では、Ethereum署名検証を行う
            // ここでは簡易的な実装とする
            $hash = $this->getHash($message);
            return strlen($signature) === 130; // 65バイト = 130文字（hex）
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * CCIDかどうかを判定
     */
    private function isCCID(string $address): bool
    {
        return str_starts_with($address, 'con');
    }

    /**
     * キー解決を検証
     */
    private function validateKeyResolution(array $keys, string $startKey): ?string
    {
        $rootKey = null;
        $nextKey = '';

        foreach ($keys as $keyData) {
            $key = (object) $keyData;
            
            if (empty($nextKey) && $startKey !== $key->id) {
                throw new Exception("This key-resolution does not start with {$startKey}");
            }

            if (!empty($nextKey) && $nextKey !== $key->id) {
                throw new Exception("Key {$key->id} is not a child of {$nextKey}");
            }

            $signature = hex2bin($key->enactSignature);
            if (!$this->verifySignature($key->enactDocument, bin2hex($signature), $key->parent)) {
                throw new Exception("Invalid signature for key {$key->id}");
            }

            $enact = json_decode($key->enactDocument, true);
            if (!$enact) {
                throw new Exception("Invalid enact document for key {$key->id}");
            }

            if ($this->isCCID($key->parent)) {
                if ($enact['signer'] !== $key->parent) {
                    throw new Exception("Enact signer is not matched with the parent");
                }
            } else {
                if ($enact['keyID'] !== $key->parent) {
                    throw new Exception("Enact keyID is not matched with the parent");
                }
            }

            if ($enact['target'] !== $key->id) {
                throw new Exception("KeyID in payload is not matched with the keyID");
            }

            if ($enact['parent'] !== $key->parent) {
                throw new Exception("Parent in payload is not matched with the parent");
            }

            if ($enact['root'] !== $key->root) {
                throw new Exception("Root in payload is not matched with the root");
            }

            if ($rootKey === null) {
                $rootKey = $key->root;
            } else {
                if ($rootKey !== $key->root) {
                    throw new Exception("Root is not matched with the previous key");
                }
            }

            if ($key->revokeDocument !== null) {
                throw new Exception("Key {$key->id} is revoked");
            }

            $nextKey = $key->parent;
        }

        return $rootKey;
    }

    /**
     * JWTとパスポートを検証
     */
    public function verifyJWT(string $jwtStr, string $passportStr = ''): VerifyJWTResult
    {
        $split = explode('.', $jwtStr);
        if (count($split) !== 3) {
            throw new Exception('Invalid JWT format');
        }

        // ヘッダーをデコード
        $headerBytes = base64_decode(strtr($split[0], '-_', '+/'));
        $header = json_decode($headerBytes, true);
        if (!$header) {
            throw new Exception('Invalid JWT header');
        }

        // JWTタイプをチェック
        if ($header['typ'] !== 'JWT' || $header['alg'] !== 'CONCRNT') {
            throw new Exception('Unsupported JWT type');
        }

        // ペイロードをデコード
        $payloadBytes = base64_decode(strtr($split[1], '-_', '+/'));
        $claims = json_decode($payloadBytes, true);
        if (!$claims) {
            throw new Exception('Invalid JWT payload');
        }

        // 有効期限をチェック
        if (!empty($claims['exp'])) {
            $exp = intval($claims['exp']);
            if ($exp < time()) {
                throw new Exception('JWT is already expired');
            }
        }

        // 署名をチェック
        $signatureBytes = base64_decode(strtr($split[2], '-_', '+/'));
        $principal = $claims['iss'];
        $key = $claims['iss'];
        
        if (!empty($header['kid'])) {
            $key = $header['kid'];
        }

        $message = $split[0] . '.' . $split[1];
        if (!$this->verifySignature($message, bin2hex($signatureBytes), $key)) {
            throw new Exception('Invalid JWT signature');
        }

        // CCIDの場合はここで終了
        if ($this->isCCID($key)) {
            return new VerifyJWTResult(
                $principal,
                $claims['aud'],
                $claims['sub']
            );
        }

        // パスポートが必要
        if (empty($passportStr)) {
            throw new Exception('Passport is required for non-CCID keys');
        }

        $passportJson = base64_decode($passportStr);
        $passport = json_decode($passportJson, true);
        if (!$passport) {
            throw new Exception('Invalid passport format');
        }

        $passportDoc = json_decode($passport['document'], true);
        if (!$passportDoc) {
            throw new Exception('Invalid passport document');
        }

        // パスポート署名を検証
        $passportSignature = hex2bin($passport['signature']);
        if (!$this->verifySignature($passport['document'], bin2hex($passportSignature), $passportDoc['signer'])) {
            throw new Exception('Invalid passport signature');
        }

        // キー解決を検証
        $resolved = $this->validateKeyResolution($passportDoc['keys'], $key);
        if ($resolved !== $principal) {
            throw new Exception('Resolved entity is not matched with the principal');
        }

        // アフィリエーション署名を検証
        $affiliationSignature = hex2bin($passportDoc['entity']['affiliationSignature']);
        if (!$this->verifySignature($passportDoc['entity']['affiliationDocument'], bin2hex($affiliationSignature), $principal)) {
            throw new Exception('Invalid affiliation signature');
        }

        $affiliation = json_decode($passportDoc['entity']['affiliationDocument'], true);
        if (!$affiliation) {
            throw new Exception('Invalid affiliation document');
        }

        if ($affiliation['domain'] !== $passportDoc['domain']) {
            throw new Exception('Domain is not matched with the passport');
        }

        return new VerifyJWTResult(
            $principal,
            $claims['aud'],
            $claims['sub'],
            $passportDoc['domain'],
            $passportDoc['signer'],
            new DateTime($affiliation['signedAt'])
        );
    }
}
