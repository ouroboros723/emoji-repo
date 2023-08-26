<?php

namespace App\Console\Commands;

use App\Models\Admin;
use RuntimeException;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;

class DeleteAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:delete-user {--id=}';

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
        try {
            $result = Admin::findOrFail($this->option('id'));
        } catch (ModelNotFoundException $e) {
            $this->error('指定されたユーザーが見つかりませんでした。');
        }

        if(($result ?? null) instanceof Admin) {
            if(($this->ask("管理者 $result->name を削除してもよろしいですか？(Y/n)") === 'Y') && $result->delete()) {
                $this->info("管理者 $result->name を削除しました。");
                return 0;
            } else {
                $this->info('中止しました。');
                return 0;
            }
        }
        throw new RuntimeException('管理者の削除に失敗しました。');
    }
}
