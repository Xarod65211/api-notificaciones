<!doctype html>
<html lang="es">
<body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#1e293b">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
        <tr><td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px">
                <tr><td style="background:#172a46;color:#ffffff;padding:16px 24px;border-radius:12px 12px 0 0;font-size:14px">
                    {{ $n->sistema->nombre }}
                </td></tr>
                <tr><td style="padding:24px">
                    <h1 style="margin:0 0 16px;font-size:18px;color:#172a46">{{ $n->asunto }}</h1>
                    <div style="font-size:14px;line-height:1.6;white-space:pre-line">{{ $n->cuerpo }}</div>
                </td></tr>
                <tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b">
                    Aviso automático ({{ $n->evento }}). No responda a este correo.
                </td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
