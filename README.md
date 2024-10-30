# Musico

Musico is a Discord-like app designed specifically for musicians to collaborate, chat, and share their music with each other.

## User Journeys

### 1. Sign Up and Sign In

1. **Visit Musico Website**: Navigate to the Musico web application.
2. **Sign In with ZAPT**: Click on the "Sign in with ZAPT" button.
3. **Authentication**: Use your preferred method (Email, Google, Facebook, or Apple) to sign in or create a new account.
4. **Access Home Page**: Upon successful authentication, you are redirected to the home page where you can see available channels.

### 2. Join or Create a Channel

1. **View Channels**: On the left sidebar, view a list of existing channels dedicated to various music genres or topics.
2. **Join a Channel**: Click on a channel to join the conversation.
3. **Create a New Channel**: If you don't find a suitable channel, click on "Create Channel" to start a new one.
   - **Enter Channel Name**: Provide a unique name for your channel.
   - **Create**: Click "Create" to add the channel to the list.

### 3. Chat with Other Musicians

1. **View Messages**: Upon entering a channel, view the conversation history.
2. **Send a Message**: Type your message in the input box at the bottom of the chat and press "Send" or hit Enter.
3. **Share Music Links**: Paste links to your music or share audio files (supported in future updates).
4. **Real-Time Updates**: See messages from other users appear in real-time without needing to refresh the page.

### 4. Sign Out

1. **Access Profile Menu**: Click on your avatar or username at the top-right corner.
2. **Sign Out**: Click on the "Sign Out" option to securely log out of your account.

## Features

- **Real-Time Chat**: Engage in live conversations with musicians around the world.
- **Channel Management**: Join existing channels or create new ones based on your interests.
- **User Authentication**: Secure sign-in using ZAPT with options for Google, Facebook, Apple, or Email.
- **Responsive Design**: Enjoy a seamless experience across all devices, including desktops, tablets, and mobile phones.

## External Services Used

- **ZAPT**: Used for user authentication and event handling.
- **Supabase**: Utilized for authentication services.
- **Sentry**: Implemented for error tracking and logging.
- **Neon Database**: Employed for storing application data, including channels and messages.
