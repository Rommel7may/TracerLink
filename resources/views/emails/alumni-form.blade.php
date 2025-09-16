<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Form - Pampanga State University</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 font-sans">

  <div class="max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-md mt-8 mb-8">
    
    <!-- Header -->
    <div class="bg-blue-600 p-6 text-center rounded-t-xl">
      <h1 class="text-white text-2xl font-bold mb-1">PAMPANGA STATE UNIVERSITY</h1>
      <p class="text-blue-100 font-medium text-base">Alumni Tracer System</p>
    </div>

    <!-- Content -->
    <div class="p-8">
      <h2 class="text-blue-700 text-2xl font-bold mb-4 border-b-2 border-blue-200 pb-2">
        Hello {{ $student->student_name }},
      </h2>

      <p class="mb-4 text-gray-700 text-base">
        We hope this message finds you well after your graduation from Pampanga State University Lubao Campus. As a valued alumnus, your journey and achievements are important to us and inspire current students.
      </p>

      <p class="mb-4 text-gray-700 text-base">
        To help us maintain our records and strengthen our alumni network, we kindly request you to complete our Alumni Tracer Form. This information will assist us in:
      </p>

      <ul class="list-disc list-inside mb-6 text-gray-700 space-y-1">
        <li>Tracking the success of our graduates</li>
        <li>Improving our academic programs</li>
        <li>Connecting alumni with opportunities</li>
      </ul>

      <div class="text-center mb-8">
        <a href="{{ $formUrl }}" class="inline-block px-10 py-4 bg-gradient-to-b from-blue-400 to-blue-500 text-white font-bold text-lg rounded-full shadow-md border-2 border-blue-400 uppercase tracking-wide hover:from-blue-500 hover:to-blue-600 hover:shadow-lg transition transform hover:-translate-y-1">
          Complete Alumni Form
        </a>
      </div>

      <p class="mb-4 text-gray-700 text-base">
        Your participation is crucial to helping improve Pampanga State University's educational quality and strengthening our alumni community.
      </p>
    </div>

    <!-- Footer -->
    <div class="bg-gray-100 text-center text-gray-500 text-sm p-4 border-t border-gray-300">
      <p>This is an automated email from Pampanga State University's Lubao Campus Alumni Tracer System.</p>
      <p>© 2023 Pampanga State University. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
