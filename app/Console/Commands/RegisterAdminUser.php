<?php

namespace App\Console\Commands;

use App\Models\Admin;
use http\Exception\RuntimeException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class RegisterAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:add-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '管理者アカウントを追加します。';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $name = $this->ask('管理者名');
        $email = $this->ask('管理者メールアドレス');
        $password = $this->secret('管理者パスワード');
        $passwordAgain = $this->secret('管理者パスワード(再入力)');

        if($password !== $passwordAgain) {
            $this->error('パスワードが一致しません。やり直してください。');
            return -1;
        }

        if(Admin::whereEmail($email)->exists()) {
            $this->error('このメールアドレスは既に登録されています。');
            return -1;
        }

        $result = Admin::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        if($result instanceof Admin) {
            $this->info("管理者 $name を登録しました。");
            return 0;
        }
        throw new RuntimeException('管理者の登録に失敗しました。');
    }
}
