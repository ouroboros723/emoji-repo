<?php

namespace App\Http\Controllers;

use App\Http\Controllers\ApiResponseTrait;
use App\Http\Controllers\Controller;

/**
 * This class should be parent class for other API controllers
 * Class AppBaseController
 */
class BaseController extends Controller
{
    use ApiResponseTrait;
}
