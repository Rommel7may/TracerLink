<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Alumni Update Form</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
    <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <tr>
            <td style="background-color: #800000; padding: 20px; text-align: center;">
                <!-- DHVSU Inline SVG Logo -->
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" stroke="#FFD700" stroke-width="4" fill="#800000" />
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FFD700"
                          font-size="20" font-family="Georgia, serif" font-weight="bold">
                        DHVSU
                    </text>
                </svg>

                <h2 style="color: #FFD700; margin: 10px 0 0;">Don Honorio Ventura State University</h2>
                <p style="color: #f3f3f3; margin: 0;">Alumni Tracer System</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <h3 style="color: #800000;">Hello {{ $student->student_number }},</h3>

                <p>We kindly ask you to update your alumni information using the button below:</p>

                <p style="text-align: center; margin: 30px 0;">
                    <a href="{{ $formUrl }}" style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #FFD700;
                        color: #800000;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    ">Update My Alumni Record</a>
                </p>

                <p>Thank you for helping us keep DHVSU’s alumni records accurate and meaningful.</p>

                <p style="color: #999;">This is an automated email sent by DHVSU Alumni Tracer System.</p>
            </td>
        </tr>
    </table>
</body>
</html>
