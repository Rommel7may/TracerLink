// import Echo from 'laravel-echo';

// export const echo = new Echo({
//   broadcaster: 'reverb',
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
//   wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
//   wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
//   forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
//   enabledTransports: ['ws', 'wss'],
// });



import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: any;
    }
}

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: '3900e6a61c2e51652417',
    cluster: 'ap1',
    forceTLS: true,
});
