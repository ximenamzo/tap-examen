<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TemporaryPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $tempPassword) {}

    public function build()
    {
        return $this->subject('Recuperación de contraseña - TAP Terminal')
            ->view('emails.temporary-password');
    }
}