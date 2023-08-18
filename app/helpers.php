<?php

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

if (! function_exists('public_path_in_x_server')) {
    /**
     * Get the path to the public folder in Xserver
     *
     * @param  string $path
     * @return string
     */
    function public_path_in_x_server($path = '')
    {
        return base_path('public_html').($path ? DIRECTORY_SEPARATOR.ltrim($path, DIRECTORY_SEPARATOR) : $path);
    }
}

if (! function_exists('fread_head')) {
    /**
     * ファイルを先頭から$lines行読み込む
     * @param  string $filename
     * @param  int    $lines
     * @return string
     */
    function fread_head($filename, $lines = 25)
    {
        $f   = fopen($filename, 'rb');
        $txt = '';
        for (; $lines > 0; --$lines) {
            $txt .= fgets($f);
        }
        // Close file and return
        fclose($f);

        return $txt;
    }
}

if (! function_exists('fread_tail')) {
    /**
     * ファイルを末尾から$lines行分読み込む
     * @see https://www.geekality.net/2011/05/28/php-tail-tackling-large-files/
     * @param  string      $filename
     * @param  int         $lines
     * @param  int         $buffer
     * @return bool|string
     */
    function fread_tail($filename, $lines = 50, $buffer = 4096)
    {
        // Open the file
        $file = fopen($filename, 'rb');

        // Jump to last character
        fseek($file, -1, SEEK_END);

        // Read it and adjust line number if necessary
        // (Otherwise the result would be wrong if file doesn't end with a blank line)
        if (fread($file, 1) !== "\n") {
            --$lines;
        }

        // Start reading
        $output = '';

        //  While we would like more
        while (ftell($file) > 0 && $lines >= 0) {
            // Figure out how far back we should jump
            $seek = min(ftell($file), $buffer);

            // Do the jump (backwards, relative to where we are)
            fseek($file, -$seek, SEEK_CUR);

            // Read a chunk and prepend it to our output
            $output = ($chunk = fread($file, $seek)).$output;

            // Jump back to where we started reading
            fseek($file, -mb_strlen($chunk, '8bit'), SEEK_CUR);

            // Decrease our line counter
            $lines -= substr_count($chunk, "\n");
        }

        // While we have too many lines
        // (Because of buffer size we might have read too many)
        while ($lines++ < 0) {
            // Find first newline and remove all text before that
            $output = substr($output, strpos($output, "\n") + 1);
        }

        // Close file and return
        fclose($file);

        return $output;
    }
}

if (! function_exists('bounden_sql')) {
    /**
     * プリペアにバインドされた値を当てはめたSQL文を返す。
     * @param  Builder|Relation $query
     * @return string
     */
    function bounden_sql($query)
    {
        return Str::replaceArray(
            '?',
            Arr::flatten($query->toBase()->bindings),
            $query->toSql()
        );
    }
}

if (! function_exists('array_in_str')) {
    /**
     * 文字列$str中に$needlesに含まれる文字列のいずれかが存在するか否かを判定する関数
     * 存在するならばtrue, 存在しないならばfalse
     *
     * @param  string       $str
     * @param  array|string $needles
     * @return bool
     */
    function array_in_str(string $str, $needles): bool
    {
        if (! is_array($needles)) {
            return strpos($str, (string) $needles) !== false;
        }
        foreach ($needles as $needle) {
            if (strpos($str, $needle) !== false) {
                return true;
            }
        }

        return false;
    }
}
if (! function_exists('tsv2collect')) {
    /**
     * @param  string                        $content
     * @param  string                        $deliminator
     * @return Illuminate\Support\Collection
     */
    function tsv2collect(string $content, $deliminator = "\t"): Illuminate\Support\Collection
    {
        return collect(explode("\n", $content))->map(
            static function (string $line) use ($deliminator) {
                return collect(explode($deliminator, $line));
            }
        );
    }
}
if (! function_exists('array_key_camel')) {
    /**
     * 配列のキーをキャメルケース化
     * @param  array $array
     * @param  bool  $isRecursive
     * @return array
     */
    function array_key_camel(array $array, bool $isRecursive = true)
    {
        $results = [];
        foreach ($array as $key => $value) {
            if (is_array($value) && $isRecursive) {
                $results[Str::camel($key)] = array_key_camel($value);
            } else {
                $results[Str::camel($key)] = $value;
            }
        }

        return $results;
    }
}
if (! function_exists('array_key_snake')) {
    /**
     * 配列のキーをスネークケース化
     * @param  array $array
     * @param  bool  $isRecursive
     * @return array
     */
    function array_key_snake(array $array, bool $isRecursive = true)
    {
        $results = [];
        foreach ($array as $key => $value) {
            if (is_array($value) && $isRecursive) {
                $results[Str::snake($key)] = array_key_snake($value);
            } else {
                $results[Str::snake($key)] = $value;
            }
        }

        return $results;
    }
}
if (! function_exists('array_key_add_prefix')) {
    /**
     * 配列のキーに接頭辞を追加
     * @param  string $prefix
     * @param  array  $array
     * @param  bool   $isRecursive
     * @return array
     */
    function array_key_add_prefix(string $prefix, array $array, bool $isRecursive = false)
    {
        $results = [];
        foreach ($array as $key => $value) {
            if (is_array($value) && $isRecursive) {
                $results[$prefix.$key] = array_key_add_prefix($prefix, $value);
            } else {
                $results[$prefix.$key] = $value;
            }
        }

        return $results;
    }
}
if (! function_exists('before_insert_required_rule')) {
    /**
     * バリデーションルールを表現する配列ないし文字列にrequiredルールを追加する.
     * nullableが定義されている場合は追加をしない
     * @param  array|string $rule
     * @return array|string
     */
    function before_insert_required_rule($rule)
    {
        /* @var string|array $rule */
        if (is_string($rule) && strpos($rule, 'nullable') === false) {
            $rule = 'required|'.$rule;
        } elseif (is_array($rule) && ! in_array('nullable', $rule, true)) {
            $rule = array_merge(['required'], $rule);
        }

        return $rule;
    }
}

if (! function_exists('loose_secure_asset')) {
    /**
     * HTTPS通信での問い合わせか、本番環境ならばhttpsなassetへのリンクを返す。
     * その逆、つまりテスト環境かつテスト環境がHTTP通信であるならばhttpなassetへのリンクを返す。
     *
     * @param  string $path
     * @return string
     */
    function loose_secure_asset($path)
    {
        if (Request::isSecure() || config('app.env') === config('app.in_production_env_name')) {
            return asset($path, true);
        }

        return asset($path, false);
    }
}

if (! function_exists('mb_wordwrap')) {
    /**
     * 日本語対応wordwrap. 指定した文字数で文字列を分割する。行の最大長を決めて整形することを目的に作成。
     * @param  string $str                 入力文字列。分割対象の文字列。
     * @param  int    $width               文字列を分割するときの文字数。新しい一行の長さ。
     * @param  string $break               分割に用いる文字。改行文字。
     * @param  string $originalDeliminator 元々分割に用いていた文字。改行文字。
     * @return string 受け取った文字列を指定した長さで分割したものを返します
     * @see wordwrap()
     */
    function mb_wordwrap($str, $width = 25, $break = "\n", $originalDeliminator = "\n")
    {
        $result = '';
        $rows   = explode($originalDeliminator, $str);
        foreach ($rows as $row) {
            $row_len              = mb_strlen($row);
            $newRowLenIsWidth     = [];
            for ($i = 0; $i <= $row_len; $i += $width) {
                $newRowLenIsWidth[] = mb_substr($row, $i, $width);
            }
            $result .= implode($break, $newRowLenIsWidth).$break;
        }

        return $result;
    }
}
