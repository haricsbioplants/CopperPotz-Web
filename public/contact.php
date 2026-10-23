
<?php
header('Content-Type: application/json; charset=utf-8');

function respond(int $status, string $message, bool $success = false): void
{
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
}

$type = $_POST['form_type'] ?? '';

if (!in_array($type, ['contact', 'reservation'], true)) {
    respond(400, 'Invalid form submission.');
}

// Honeypot spam protection
if (!empty($_POST['website'])) {
    respond(200, 'Submission received.', true);
}

$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');

if (
    $name === '' ||
    strlen($name) > 120 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($email) > 254 ||
    preg_match('/[\r\n]/', $email) ||
    $phone === '' ||
    strlen($phone) > 40
) {
    respond(400, 'Please check your name, email and phone number.');
}

try {
    // Private configuration and PHPMailer are outside public/
    $config = require dirname(__DIR__) . '/smtp-config.php';
    require_once dirname(__DIR__) . '/vendor/autoload.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    $isReservation = $type === 'reservation';

    $mail->isSMTP();
    $mail->Host       = $config['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['username'];
    $mail->Password   = $config['password'];
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($config['from_email'], 'Copper Potz Website');
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);

    $title = $isReservation
        ? 'New Table Reservation'
        : 'New Contact Enquiry';

    $mail->Subject = $isReservation
        ? 'Copper Potz | New Table Reservation'
        : 'Copper Potz | New Contact Enquiry';

    $intro = $isReservation
        ? 'A customer has submitted a table reservation request. Please review the details below.'
        : 'A customer has contacted Copper Potz through the website. Here are the enquiry details.';

    $labels = [
        'name'             => 'Customer Name',
        'email'            => 'Email Address',
        'phone'            => 'Phone Number',
        'message'          => 'Message',
        'date'             => 'Reservation Date',
        'time'             => 'Reservation Time',
        'guests'           => 'Number of Guests',
        'occasion'         => 'Occasion',
        'special_requests' => 'Special Requests'
    ];

    $rows = [];
    $plainRows = [];

    foreach ($_POST as $key => $value) {
        if (in_array($key, ['form_type', 'website'], true)) {
            continue;
        }

        if (!is_string($value)) {
            continue;
        }

        $value = trim($value);

        if ($value === '') {
            continue;
        }

        // Prevent excessively large submitted fields.
        if (strlen($value) > 5000) {
            $value = substr($value, 0, 5000);
        }

        $label = $labels[$key] ??
            ucfirst(str_replace('_', ' ', $key));

        $safeLabel = htmlspecialchars(
            $label,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );

        $safeValue = nl2br(htmlspecialchars(
            $value,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        ));

        $rows[] = '
        <tr>
          <td style="padding:13px 15px;color:#657168;
                     font-size:13px;border-bottom:1px solid #e8e9e2;
                     width:38%;vertical-align:top;">
            ' . $safeLabel . '
          </td>
          <td style="padding:13px 15px;color:#263e2e;
                     font-size:14px;font-weight:600;
                     border-bottom:1px solid #e8e9e2;
                     overflow-wrap:anywhere;">
            ' . $safeValue . '
          </td>
        </tr>';

        $plainRows[] = $label . ': ' . $value;
    }

    $safeTitle = htmlspecialchars(
        $title,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

    $safeIntro = htmlspecialchars(
        $intro,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

    $mail->Body = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
    </head>
    <body style="margin:0;padding:0;background:#f4f2eb;
                 font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0"
             cellpadding="0" style="background:#f4f2eb;">
        <tr>
          <td align="center" style="padding:30px 12px;">
            <table role="presentation" width="600" cellspacing="0"
                   cellpadding="0"
                   style="width:100%;max-width:600px;background:#fff;
                          border-radius:12px;overflow:hidden;">

              <tr>
                <td style="background:#263e2e;padding:30px 20px;
                           text-align:center;border-bottom:5px solid #b7864c;">
                  <div style="font-family:Georgia,serif;font-size:30px;
                              font-weight:bold;color:#f8f5ed;">
                    Copper Potz
                  </div>
                  <div style="margin-top:8px;font-size:11px;
                              letter-spacing:3px;color:#d8b477;">
                    RESTAURANT &amp; DINING
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 26px 12px;">
                  <div style="font-family:Georgia,serif;font-size:24px;
                              line-height:1.4;color:#263e2e;font-weight:bold;">
                    ' . $safeTitle . '
                  </div>
                  <div style="font-size:14px;line-height:1.7;
                              color:#667168;margin-top:12px;">
                    ' . $safeIntro . '
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:14px 26px 28px;">
                  <table role="presentation" width="100%" cellspacing="0"
                         cellpadding="0"
                         style="border:1px solid #e8e9e2;border-radius:8px;">
                    <tr>
                      <td colspan="2"
                          style="background:#f8f5ed;padding:14px 15px;
                                 color:#263e2e;font-size:13px;
                                 font-weight:bold;letter-spacing:1px;">
                        SUBMISSION DETAILS
                      </td>
                    </tr>
                    ' . implode("\n", $rows) . '
                  </table>

                  <div style="margin-top:24px;padding:18px;
                              background:#f8f5ed;border-left:4px solid #b7864c;
                              color:#657168;font-size:12px;line-height:1.7;">
                    This is an automated notification from the Copper Potz
                    website. Reply to this email to respond to the customer.
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background:#263e2e;padding:22px 20px;
                           text-align:center;color:#e9e5d8;">
                  <div style="font-family:Georgia,serif;font-size:19px;
                              color:#fff;font-weight:bold;">
                    Copper Potz
                  </div>
                  <div style="font-size:12px;line-height:1.8;
                              margin-top:8px;color:#e1d7c5;">
                    Thank you for being part of our dining experience.
                  </div>
                  <div style="height:1px;background:#526253;margin:16px 0;"></div>
                  <div style="font-size:11px;color:#d8b477;">
                    AUTOMATED WEBSITE NOTIFICATION
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>';

    $mail->AltBody = $title . "\n\n"
        . $intro . "\n\n"
        . implode("\n", $plainRows)
        . "\n\nCopper Potz - Website Notification";

    $mail->send();

    respond(200, 'Your request was sent successfully.', true);

} catch (Throwable $e) {
    // Details go to the server log, not to the public response.
    error_log('Copper Potz email error: ' . $e->getMessage());

    respond(
        500,
        'We could not send your request. Please try again later.'
    );
}
