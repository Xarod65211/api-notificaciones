<?php

namespace App\Mail;

use App\Models\Notificacion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class CorreoNotificacion extends Mailable
{
    public function __construct(public Notificacion $notificacion) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->notificacion->asunto);
    }

    public function content(): Content
    {
        return new Content(view: 'correo.notificacion', with: ['n' => $this->notificacion->loadMissing('sistema')]);
    }
}
