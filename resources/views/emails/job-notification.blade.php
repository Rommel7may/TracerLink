<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Notification</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 font-sans">

  <div class="max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-md mt-8 mb-8">

    <!-- Header -->
    <div class="bg-blue-600 p-6 text-center rounded-t-xl">
      <h2 class="text-white text-2xl font-bold mb-1">New Job Opportunity: {{ $job->title }}</h2>
      <p class="text-blue-100 text-sm">Apply within the specified date range to be considered</p>
    </div>

    <!-- Date Range -->
    <div class="flex justify-center gap-4 p-6 flex-wrap">
      <div class="bg-blue-100 text-blue-800 p-4 rounded-lg text-center min-w-[120px]">
        <div class="text-sm opacity-80">POSTED ON</div>
        <div class="text-lg font-bold">{{ \Carbon\Carbon::parse($job->start_date)->format('F d, Y') }}</div>
      </div>
      <div class="bg-blue-100 text-blue-800 p-4 rounded-lg text-center min-w-[120px]">
        <div class="text-sm opacity-80">APPLY UNTIL</div>
        <div class="text-lg font-bold">{{ \Carbon\Carbon::parse($job->application_deadline)->format('F d, Y') }}</div>
      </div>
    </div>

    <p class="text-center italic text-gray-700 px-6 mb-6">
      This position will be available for applications between 
      <span class="text-blue-600 font-semibold">{{ \Carbon\Carbon::parse($job->start_date)->format('F d, Y') }}</span> 
      and 
      <span class="text-blue-600 font-semibold">{{ \Carbon\Carbon::parse($job->application_deadline)->format('F d, Y') }}</span>.
    </p>

    <!-- Job Info -->
    <div class="bg-blue-50 p-6 rounded-lg mx-6 mb-6">
       <p><strong>Company:</strong> {{ $job->company_name }}</p>
       
@if($job->location)
  <p><strong>Location:</strong>{{ $job->location }}</p>
@endif

@if($job->location_link)
  <p><strong>Location:</strong>
    <a href="{{ $job->location_link }}" target="_blank" class="text-blue-600 underline">
      📍 View Location on Google Maps
    </a>
  </p>
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

    <!-- Apply Button -->
    @if($job->apply_link)
    <div class="text-center mb-8">
      <a href="{{ $job->apply_link }}" class="inline-block px-10 py-4 bg-gradient-to-b from-blue-400 to-blue-500 text-white font-bold text-lg rounded-full shadow-md border-2 border-blue-400 uppercase tracking-wide hover:from-blue-500 hover:to-blue-600 hover:shadow-lg transition transform hover:-translate-y-1">
        Apply Now
      </a>
    </div>
    @endif

    <!-- Footer -->
    <div class="bg-gray-100 text-center text-gray-500 text-sm p-4 border-t border-gray-300">
      You are receiving this email because you are registered on <strong>Pampanga State U - LC TracerLink</strong>.<br>
      &copy; {{ date('Y') }} Pampanga State U - LC TracerLink. All rights reserved.
    </div>

  </div>
</body>
</html>
