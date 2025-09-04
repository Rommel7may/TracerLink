<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Notification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7f9;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 650px;
            margin: auto;
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            color: #fff;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            margin-bottom: 25px;
        }
        h2 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #fff;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .job-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 25px;
            backdrop-filter: blur(5px);
        }
        .job-info p {
            margin: 12px 0;
            line-height: 1.6;
        }
        .date-range {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 25px 0;
        }
        .date-box {
            background: rgba(255, 255, 255, 0.15);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            min-width: 120px;
            backdrop-filter: blur(5px);
        }
        .date-label {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        .date-value {
            font-size: 18px;
            font-weight: bold;
        }
        .availability-note {
            text-align: center;
            font-style: italic;
            margin: 15px 0;
            opacity: 0.9;
        }
        .apply-button {
            display: block;
            width: fit-content;
            margin: 30px auto;
            padding: 16px 40px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .apply-button:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .footer {
            font-size: 13px;
            text-align: center;
            line-height: 1.6;
            opacity: 0.8;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        .highlight {
            color: #f39c12;
            font-weight: bold;
        }
        /* Responsive */
        @media (max-width: 680px) {
            .container {
                padding: 20px;
            }
            h2 {
                font-size: 24px;
            }
            .job-info {
                padding: 15px;
            }
            .date-range {
                flex-direction: column;
                gap: 10px;
                width: 10px;
            }
            .apply-button {
                padding: 14px 30px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Job Opportunity: {{ $job->title }}</h2>
            <p class="subtitle">Apply within the specified date range to be considered</p>
        </div>

        <div class="date-range">
            <div class="date-box">
                <div class="date-label">POSTED ON</div>
                <div class="date-value">{{ $job->start_date }}</div>
            </div>
            <div class="date-box">
                <div class="date-label">APPLY UNTIL</div>
                <div class="date-value">{{ $job->application_deadline }}</div>
            </div>
        </div>

        <p class="availability-note">This position will be available for applications between <span class="highlight">{{ $job->start_date}}</span> and <span class="highlight">{{ $job->application_deadline}}</span>.</p>

        <div class="job-info">
            <p><strong>Company:</strong> {{ $job->company_name }}</p>
            @if($job->location)
            <p><strong>Location:</strong> {{ $job->location }}</p>
            @endif
            @if($job->description)
            <p><strong>Description:</strong> {{ $job->description }}</p>
            @endif
            @if($job->requirements)
            <p><strong>Requirements:</strong> {{ $job->requirements }}</p>
            @endif
            @if($job->responsibilities)
            <p><strong>Responsibilities:</strong> {{ $job->responsibilities }}</p>
            @endif
        </div>

        @if($job->apply_link)
        <a class="apply-button" href="{{ $job->apply_link }}">Apply Now</a>
        @endif

        <p class="footer">
            You are receiving this email because you are registered on <strong>Pampanga State U - LC TracerLink</strong>.<br>
            &copy; {{ date('Y') }} Pampanga State U - LC TracerLink. All rights reserved.
        </p>
    </div>
</body>
</html>