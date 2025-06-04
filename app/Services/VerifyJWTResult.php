<?php

namespace App\Services;

use DateTime;

class VerifyJWTResult
{
    public string $principal;
    public string $audience;
    public string $subject;
    public ?string $domain = null;
    public ?string $documentSigner = null;
    public ?DateTime $affiliationDate = null;

    public function __construct(
        string $principal,
        string $audience,
        string $subject,
        ?string $domain = null,
        ?string $documentSigner = null,
        ?DateTime $affiliationDate = null
    ) {
        $this->principal = $principal;
        $this->audience = $audience;
        $this->subject = $subject;
        $this->domain = $domain;
        $this->documentSigner = $documentSigner;
        $this->affiliationDate = $affiliationDate;
    }
}
