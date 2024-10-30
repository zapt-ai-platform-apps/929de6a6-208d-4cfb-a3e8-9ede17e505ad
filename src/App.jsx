import { createSignal, onMount, createEffect, Show, For } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createEvent } from './supabaseClient';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [channels, setChannels] = createSignal([]);
  const [activeChannel, setActiveChannel] = createSignal(null);
  const [messages, setMessages] = createSignal([]);
  const [newMessage, setNewMessage] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  // Check if user is signed in on mount
  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  }

  onMount(() => {
    checkUserSignedIn();

    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    }
  });

  // Fetch Channels
  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/getChannels');
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      } else {
        console.error('Error fetching channels:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  // Fetch Messages for the active channel
  const fetchMessages = async (channelId) => {
    try {
      const response = await fetch(`/api/getMessages?channelId=${channelId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Error fetching messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  // Handle sending a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage().trim() === '') return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId: activeChannel().id,
          content: newMessage(),
        }),
      });
      if (response.ok) {
        setNewMessage('');
        fetchMessages(activeChannel().id);
      } else {
        console.error('Error sending message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle signing out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  }

  // When user is authenticated, fetch channels
  createEffect(() => {
    if (user()) {
      fetchChannels();
    }
  });

  // If active channel changes, fetch its messages
  createEffect(() => {
    if (activeChannel()) {
      fetchMessages(activeChannel().id);
    }
  });

  // Poll messages every 5 seconds
  setInterval(() => {
    if (activeChannel()) {
      fetchMessages(activeChannel().id);
    }
  }, 5000);

  // Handle creating a new channel
  const [newChannelName, setNewChannelName] = createSignal('');
  const createChannel = async () => {
    if (newChannelName().trim() === '') return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/createChannel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newChannelName(),
        }),
      });
      if (response.ok) {
        setNewChannelName('');
        fetchChannels();
      } else {
        console.error('Error creating channel:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating channel:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show when={currentPage() === 'homePage'} fallback={
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline mb-6 block text-center"
            >
              Learn more about ZAPT
            </a>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
              magicLink={true}
              view="magic_link"
              showLinks={false}
              authView="magic_link"
            />
          </div>
        </div>
      }>
        <div class="h-full flex">
          {/* Sidebar */}
          <div class="w-64 bg-white rounded-lg shadow-md p-4 flex flex-col">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-purple-600">Channels</h2>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <For each={channels()}>
                {(channel) => (
                  <div
                    class={`p-2 rounded-md cursor-pointer hover:bg-purple-100 ${activeChannel() && activeChannel().id === channel.id ? 'bg-purple-200' : ''}`}
                    onClick={() => setActiveChannel(channel)}
                  >
                    #{channel.name}
                  </div>
                )}
              </For>
            </div>
            <div class="mt-4">
              <input
                type="text"
                placeholder="New channel name"
                value={newChannelName()}
                onInput={(e) => setNewChannelName(e.target.value)}
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
              />
              <button
                class="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={createChannel}
                disabled={loading()}
              >
                Create Channel
              </button>
            </div>
          </div>
          {/* Chat Area */}
          <div class="flex-1 flex flex-col p-4">
            <Show when={activeChannel()} fallback={<div class="text-center text-xl text-gray-600 mt-20">Select a channel to start chatting</div>}>
              <div class="flex-1 overflow-y-auto mb-4">
                <For each={messages()}>
                  {(message) => (
                    <div class="mb-2">
                      <span class="font-semibold">{message.username}</span>: {message.content}
                    </div>
                  )}
                </For>
              </div>
              <form onSubmit={sendMessage} class="flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage()}
                  onInput={(e) => setNewMessage(e.target.value)}
                  class="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                />
                <button
                  type="submit"
                  class="px-6 py-3 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  disabled={loading()}
                >
                  Send
                </button>
              </form>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;