  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alumni Form - Pampanga State University</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; color: #202124;">
    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px; border: 1px solid #dadce0; border-radius: 8px;">
            
            <!-- Gmail-style Header -->
            <tr>
              <td bgcolor="#f5f5f5" style="padding: 16px 32px; border-bottom: 1px solid #e0e0e0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="40" valign="middle" style="padding-right: 12px;">
                      <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #1746a2; color: white; text-align: center; line-height: 40px; font-weight: bold;">P</div>
                    </td>
                    <td valign="middle">
                      <div style="font-size: 14px; font-weight: 500; color: #202124;">Pampanga State University Lubao Campus</div>
                      <div style="font-size: 12px; color: #5f6368;">to {{ $student->student_name }}</div>
                    </td>
                    <td width="100" valign="middle" align="right" style="font-size: 12px; color: #5f6368;">
                  <!-- <p id="clock"></p> -->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Content Area -->
            <tr>
              <td style="padding: 24px 32px 32px 32px;">
                <!-- Subject Line -->
                <div style="font-size: 22px; color: #202124; margin-bottom: 24px;">Alumni Tracer System - Action Required</div>
                
                <!-- Greeting -->
                <p style="font-size: 15px; line-height: 1.5; color: #202124; margin: 0 0 16px 0;">Hello {{ $student->student_name }},</p>

                <!-- Main Content -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                  <tr>
                    <td>
                      <p style="font-size: 15px; line-height: 1.5; color: #202124; margin: 0 0 16px 0;">
                        We hope this message finds you well after your graduation from Pampanga State University Lubao Campus. As a valued alumnus, your journey and achievements are important to us and inspire current students.
                      </p>

                      <p style="font-size: 15px; line-height: 1.5; color: #202124; margin: 0 0 16px 0;">
                        To help us maintain our records and strengthen our alumni network, we kindly request you to complete our Alumni Tracer Form. This information will assist us in:
                      </p>

                      <ul style="font-size: 15px; line-height: 1.5; color: #202124; margin: 0 0 24px 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Tracking the success of our graduates</li>
                        <li style="margin-bottom: 8px;">Improving our academic programs</li>
                        <li style="margin-bottom: 8px;">Connecting alumni with opportunities</li>
                      </ul>

                      <p style="font-size: 15px; line-height: 1.5; color: #202124; margin: 0 0 24px 0;">
                        Your participation is crucial to helping improve Pampanga State University's educational quality and strengthening our alumni community.
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="padding: 16px 0 8px 0;">
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td align="center" bgcolor="#1a73e8" style="border-radius: 4px;">
                                  <a href="{{ $formUrl }}" target="_blank" style="font-size: 15px; font-weight: 500; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block;">
                                    Complete Alumni Form
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Secondary Info -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top: 1px solid #dadce0; padding-top: 16px;">
                      <p style="font-size: 12px; line-height: 1.4; color: #5f6368; margin: 0 0 4px 0;">Pampanga State University - Lubao Campus</p>
                      <p style="font-size: 12px; line-height: 1.4; color: #5f6368; margin: 0;">&copy; {{ date('Y') }} Pampanga State U - LC TracerLink. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
