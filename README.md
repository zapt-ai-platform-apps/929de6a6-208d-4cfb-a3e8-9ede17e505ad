# Musico

Musico is a web application designed to bring musicians together, providing real-time communication and collaboration tools. It's similar to Discord but tailored specifically for musicians to chat, share ideas, and collaborate on projects.

## User Journeys

### 1. Sign Up and Sign In

1. **Visit Musico Website**: Navigate to the Musico web application.
2. **Sign In with ZAPT**: Click on the "Sign in with ZAPT" text above the authentication component.
3. **Authentication**: Use your preferred method (Email, Google, Facebook, or Apple) to sign in or create a new account.
4. **Access Home Page**: Upon successful authentication, you are redirected to the home page where you can see available channels.

### 2. Join or Create a Channel

1. **View Channels**: On the left sidebar, view a list of existing channels dedicated to various music genres or topics.
2. **Join a Channel**: Click on a channel to join the conversation.
3. **Create a New Channel**: If you don't find a suitable channel, enter a new channel name and click "Create Channel" to start a new one.

### 3. Chat with Other Musicians

1. **View Messages**: Upon entering a channel, view the conversation history.
2. **Send a Message**: Type your message in the input box at the bottom of the chat and press "Send" or hit Enter.
3. **Real-Time Updates**: See messages from other users appear in real-time without needing to refresh the page.

### 4. Sign Out

1. **Sign Out**: Click on the "Sign Out" button to securely log out of your account.

## Features

- **Real-Time Chat**: Engage in live conversations with musicians around the world.
- **Channel Management**: Join existing channels or create new ones based on your interests.
- **User Authentication**: Secure sign-in using ZAPT with options for Google, Facebook, Apple, or Email.
- **Responsive Design**: Enjoy a seamless experience across all devices, including desktops, tablets, and mobile phones.
- **Error Tracking with Sentry**: All errors are logged to Sentry for better monitoring and debugging.

## External Services Used

- **ZAPT**: Used for user authentication and event handling.
- **Supabase**: Utilized for authentication services.
- **Sentry**: Implemented for error tracking and logging.
- **Neon Database**: Employed for storing application data, including channels and messages.
- **Progressier**: Used for adding Progressive Web App (PWA) support to the application.

## Setup Instructions

### Environment Variables

Ensure you have a `.env` file at the root of your project with the following variables:

```env
VITE_PUBLIC_APP_ID=your_zapt_app_id
VITE_PUBLIC_SENTRY_DSN=your_sentry_dsn
VITE_PUBLIC_APP_ENV=development
NEON_DB_URL=your_neon_db_url
```

- Replace `your_zapt_app_id` with your ZAPT Application ID.
- Replace `your_sentry_dsn` with your Sentry DSN.
- Replace `your_neon_db_url` with your Neon Database URL.

### Install Dependencies

```bash
npm install
```

### Database Migration

Before running the app, ensure your database is up to date by running:

```bash
npm run db:push
```

This command will create the necessary tables (`channels` and `messages`) in your Neon Database.

**Note**: If you encounter an error like `NeonDbError: relation "channels" does not exist`, it means the database tables have not been created. Running the above command should resolve the issue.

### Run the App Locally

```bash
npm run dev
```

### Build the App

If you wish to build the app for production:

```bash
npm run build
```

## Deployment

When deploying to Vercel or any other platform, make sure to set the environment variables in the deployment settings:

- `VITE_PUBLIC_APP_ID`
- `VITE_PUBLIC_SENTRY_DSN`
- `VITE_PUBLIC_APP_ENV`
- `NEON_DB_URL`

Ensure that `NEON_DB_URL` is available during the build process to prevent build errors related to database connections.

### Important

- **Database Initialization**: Always ensure that the database tables are created by running `npm run db:push` whenever you set up the project on a new environment.
- **Environment Variables**: Double-check that all environment variables are correctly set in both your local `.env` file and your deployment platform.
