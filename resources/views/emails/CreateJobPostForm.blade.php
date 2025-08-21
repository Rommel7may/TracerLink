<!DOCTYPE html>
<html>
<head>
    <title>Create a New Job Post</title>
</head>
<body>
    <p>Hello {{ $alumni->given_name }},</p>

<p>We invite you to create a new job post for unemployed alumni.</p>

<p>
    <a href="{{ route('job-form.show', $alumni->id) }}" target="_blank" 
       style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Create Job Post
    </a>
</p>

<p>Thank you for supporting our alumni community!</p>

</body>
</html>
