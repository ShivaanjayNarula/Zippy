# Zippy - Comprehensive API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Server API](#server-api)
3. [Client Components](#client-components)
4. [Custom Hooks](#custom-hooks)
5. [Utility Functions](#utility-functions)
6. [UI Components](#ui-components)
7. [Context Providers](#context-providers)
8. [Usage Examples](#usage-examples)
9. [Setup and Installation](#setup-and-installation)

## Overview

Zippy is a peer-to-peer file sharing application that enables direct file transfers between users on the same network using WebRTC technology. It consists of a Node.js/Socket.IO server for signaling and a Next.js React client application.

### Key Features
- ✅ Peer-to-peer file sharing via WebRTC
- ✅ Real-time messaging
- ✅ Room-based connections
- ✅ File upload/download with progress tracking
- ✅ QR code sharing
- ✅ Modern UI with dark/light theme support
- ✅ No file size limits (browser-dependent)

---

## Server API

### Base URL
- Development: `http://localhost:8000`
- Production: `process.env.PORT` or port 8000

### HTTP Endpoints

#### `GET /`
Returns a simple health check message.

**Response:**
```
"hello from server"
```

### Socket.IO Events

The server uses Socket.IO for real-time communication and WebRTC signaling.

#### Client → Server Events

##### `joinRoom`
Join a specific room for group communication.

**Parameters:**
- `roomNumber` (number): The room ID to join

**Example:**
```javascript
socket.emit("joinRoom", 12345);
```

**Server Response:**
```javascript
socket.emit("ack", "You have joined room 12345");
```

##### `message`
Send a message to all users in the same room.

**Parameters:**
- `messageContent` (any): The message content to broadcast

**Example:**
```javascript
socket.emit("message", "Hello everyone!");
```

**Server Response:**
Broadcasts to all room members:
```javascript
socket.emit("roomMsg", messageContent);
```

##### `details`
Register user details mapping socket ID to unique ID.

**Parameters:**
- `userData` (object):
  - `socketId` (string): Socket connection ID
  - `uniqueId` (string): Unique user identifier

**Example:**
```javascript
socket.emit("details", {
  socketId: socket.id,
  uniqueId: "abc123xyz"
});
```

##### `send-signal`
Send WebRTC signaling data to initiate a peer connection.

**Parameters:**
- `signalData` (object):
  - `from` (string): Sender's unique ID
  - `to` (string): Recipient's unique ID
  - `signalData` (object): WebRTC signal data

**Example:**
```javascript
socket.emit("send-signal", {
  from: "user123",
  to: "user456", 
  signalData: offer
});
```

**Server Response:**
Forwards to target user:
```javascript
socket.emit("signaling", {
  from: "user123",
  signalData: offer,
  to: "user456"
});
```

##### `accept-signal`
Accept an incoming WebRTC connection.

**Parameters:**
- `signalData` (object):
  - `to` (string): Target user's unique ID
  - `signalData` (object): WebRTC answer data

**Example:**
```javascript
socket.emit("accept-signal", {
  to: "user123",
  signalData: answer
});
```

**Server Response:**
```javascript
socket.emit("callAccepted", {
  signalData: answer,
  to: "user123"
});
```

#### Server → Client Events

##### `ack`
Acknowledgment message for successful room join.

##### `roomMsg`
Message broadcast to all room members.

##### `signaling`
WebRTC signaling data from another peer.

##### `callAccepted`
Confirmation that WebRTC connection was accepted.

---

## Client Components

### Core Components

#### `ShareCard`
Main component for peer-to-peer file sharing interface.

**Props:** None (uses internal state and context)

**Features:**
- Display user's unique token
- Connect to other peers via token
- File upload/download interface
- Connection status management
- WebRTC peer connection handling

**Usage:**
```tsx
import ShareCard from './ShareCard';

function App() {
  return <ShareCard />;
}
```

**Internal State:**
- `partnerId`: Target peer's unique ID
- `currentConnection`: Connection status
- `fileUpload`: Selected files for upload
- `downloadFile`: Received file data
- `fileUploadProgress`: Upload progress percentage
- `fileDownloadProgress`: Download progress percentage

#### `Chat`
Real-time messaging component for connected peers.

**Props:** None (uses socket context)

**Features:**
- Send/receive messages via WebRTC data channels
- Message history display
- Keyboard shortcuts (Ctrl+K to focus, Enter to send)

**Usage:**
```tsx
import Chat from './Chat';

function App() {
  return (
    <div>
      <ShareCard />
      <Chat />
    </div>
  );
}
```

**Keyboard Shortcuts:**
- `Ctrl/Cmd + K`: Focus message input
- `Enter`: Send message

#### `FileUpload`
Component for displaying file upload interface with progress.

**Props:**
```typescript
interface FileUploadProps {
  fileName: string;           // Name of the file to upload
  fileProgress: number;       // Upload progress (0-100)
  handleClick: () => void;    // Upload handler function
  showProgress: boolean;      // Whether to show progress bar
}
```

**Usage:**
```tsx
<FileUpload
  fileName="document.pdf"
  fileProgress={75}
  handleClick={() => uploadFile()}
  showProgress={true}
/>
```

#### `FileDownload`
Component for downloading received files.

**Props:**
```typescript
interface FileDownloadProps {
  fileReceivingStatus: boolean;  // Whether file is being received
  fileName: string;              // Name of the file
  fileProgress: number;          // Download progress (0-100)
  fileRawData: Blob;            // File blob data
}
```

**Usage:**
```tsx
<FileDownload
  fileName="image.jpg"
  fileProgress={90}
  fileReceivingStatus={true}
  fileRawData={fileBlob}
/>
```

#### `ShareLink`
Dialog component for sharing connection links via QR code.

**Props:**
```typescript
interface ShareLinkProps {
  userCode: string;  // User's unique connection code
}
```

**Features:**
- QR code generation
- Shareable URL creation
- Copy to clipboard functionality

**Usage:**
```tsx
<ShareLink userCode="abc123xyz" />
```

### Navigation Components

#### `Navbar`
Application navigation header.

**Features:**
- Theme toggle button
- Branding/logo display

#### `Footer`
Application footer with additional information.

#### `ThemeButton`
Button component for toggling dark/light theme.

**Usage:**
```tsx
import { ThemeButton } from './ThemeButton';

<ThemeButton />
```

---

## Custom Hooks

### `useSocket`
Hook for accessing Socket.IO connection and peer state.

**Returns:**
```typescript
interface SocketHook {
  socket: Socket;           // Socket.IO client instance
  userId: string;           // User's unique ID (10-char nanoid)
  SocketId: any;           // Socket connection ID
  setSocketId: Function;    // Socket ID setter
  peerState: Peer;         // WebRTC peer instance
  setpeerState: Function;   // Peer state setter
}
```

**Usage:**
```tsx
import { useSocket } from './SP';

function MyComponent() {
  const { socket, userId, peerState } = useSocket();
  
  useEffect(() => {
    socket.emit('joinRoom', 12345);
  }, [socket]);
  
  return <div>User ID: {userId}</div>;
}
```

### `useToast`
Hook for managing toast notifications.

**Returns:**
```typescript
interface ToastHook {
  toasts: ToasterToast[];              // Array of active toasts
  toast: (props: Toast) => ToastAPI;   // Function to create toast
  dismiss: (toastId?: string) => void; // Function to dismiss toast
}
```

**Usage:**
```tsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Success!",
      description: "File uploaded successfully",
      variant: "default"
    });
  };
  
  return <button onClick={showSuccess}>Show Toast</button>;
}
```

**Toast Types:**
- `default`: Standard notification
- `destructive`: Error/warning notification

---

## Utility Functions

### `cn` (Class Name Utility)
Utility for merging Tailwind CSS classes.

**Parameters:**
- `...inputs` (ClassValue[]): Class names to merge

**Returns:** `string` - Merged class names

**Usage:**
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  "conditional-class"
)} />
```

### `truncateString`
Truncates long strings with ellipsis in the middle.

**Parameters:**
- `input` (string): String to truncate

**Returns:** `string` - Truncated string

**Usage:**
```tsx
import { truncateString } from './f';

const longFileName = "very-long-filename-here.txt";
const short = truncateString(longFileName);
// Result: "very-long-filename-he...txt"
```

**Behavior:**
- Strings ≤ 30 chars: returned unchanged
- Strings > 30 chars: first 27 chars + "..." + last 3 chars

---

## UI Components

### Form Components

#### `Button`
Customizable button component with variants.

**Props:**
```typescript
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

**Usage:**
```tsx
<Button variant="outline" size="sm" onClick={() => {}}>
  Click me
</Button>
```

#### `Input`
Styled input component.

**Props:**
```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
<Input
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### `Label`
Form label component.

**Props:**
```typescript
interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
<Label htmlFor="input-id">Field Label</Label>
<Input id="input-id" />
```

#### `Progress`
Progress bar component.

**Props:**
```typescript
interface ProgressProps {
  value: number;        // Progress value (0-100)
  className?: string;
}
```

**Usage:**
```tsx
<Progress value={75} className="h-2" />
```

### Layout Components

#### `Card`
Container component with header, content, and footer sections.

**Subcomponents:**
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### `Dialog`
Modal dialog component.

**Subcomponents:**
- `DialogTrigger`: Element that opens dialog
- `DialogContent`: Main dialog content
- `DialogHeader`: Dialog header
- `DialogTitle`: Dialog title
- `DialogDescription`: Dialog description

**Usage:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Visual Effects Components

#### `TypewriterEffectSmooth`
Animated typewriter text effect.

**Props:**
```typescript
interface Word {
  text: string;
  className?: string;
}

interface TypewriterProps {
  words: Word[];
  className?: string;
}
```

**Usage:**
```tsx
const words = [
  { text: "Hello" },
  { text: "World", className: "text-blue-500" }
];

<TypewriterEffectSmooth words={words} />
```

#### `SparklesCore`
Animated particle background effect.

**Props:**
```typescript
interface SparklesProps {
  id: string;
  background: string;
  minSize: number;
  maxSize: number;
  particleDensity: number;
  className?: string;
  particleColor: string;
}
```

**Usage:**
```tsx
<SparklesCore
  id="sparkles"
  background="transparent"
  minSize={0.6}
  maxSize={1.4}
  particleDensity={100}
  particleColor="#FFFFFF"
/>
```

#### `BackgroundBeams`
Animated background beam effects.

**Usage:**
```tsx
<BackgroundBeams className="hidden md:block" />
```

### Button Variants

#### `EyeCatchingButton_v1`
Animated shimmer button component.

**Usage:**
```tsx
<EyeCatchingButton_v1 onClick={() => {}}>
  Shimmer Button
</EyeCatchingButton_v1>
```

---

## Context Providers

### `SP` (Socket Provider)
Provides Socket.IO connection and peer state management.

**Features:**
- Socket.IO client initialization
- Unique user ID generation (nanoid)
- WebRTC peer state management

**Usage:**
```tsx
import { SP } from './SP';

function App() {
  return (
    <SP>
      <YourComponents />
    </SP>
  );
}
```

**Environment Variables:**
- `NEXT_PUBLIC_SOCKET_SERVER_URL`: Socket.IO server URL

### `ThemeProvider`
Provides dark/light theme management.

**Usage:**
```tsx
import { ThemeProvider } from './ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <YourComponents />
    </ThemeProvider>
  );
}
```

---

## Usage Examples

### Complete File Sharing Flow

```tsx
import { SP } from './SP';
import ShareCard from './ShareCard';
import Chat from './Chat';

function FileSharingApp() {
  return (
    <SP>
      <div className="container mx-auto p-4">
        <ShareCard />
        <Chat />
      </div>
    </SP>
  );
}
```

### Custom WebRTC Integration

```tsx
import { useSocket } from './SP';
import { useEffect, useState } from 'react';

function CustomPeerConnection() {
  const { socket, userId, peerState } = useSocket();
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    if (peerState) {
      peerState.on('connect', () => {
        setConnected(true);
        console.log('Peer connected!');
      });
      
      peerState.on('data', (data) => {
        console.log('Received data:', data);
      });
    }
  }, [peerState]);
  
  const sendData = (data) => {
    if (peerState && connected) {
      peerState.send(JSON.stringify(data));
    }
  };
  
  return (
    <div>
      <p>Connection Status: {connected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={() => sendData({ message: 'Hello!' })}>
        Send Data
      </button>
    </div>
  );
}
```

### File Upload with Progress

```tsx
import { useState } from 'react';
import FileUpload from './FU';

function FileUploadExample() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async () => {
    setUploading(true);
    // Your upload logic here
    // Update progress as needed
  };
  
  return (
    <FileUpload
      fileName={file?.name || ''}
      fileProgress={progress}
      handleClick={handleUpload}
      showProgress={uploading}
    />
  );
}
```

### Toast Notifications

```tsx
import { useToast } from '@/hooks/use-toast';

function NotificationExample() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Success!",
      description: "Operation completed successfully",
    });
  };
  
  const showError = () => {
    toast({
      title: "Error!",
      description: "Something went wrong",
      variant: "destructive",
    });
  };
  
  return (
    <div>
      <button onClick={showSuccess}>Success Toast</button>
      <button onClick={showError}>Error Toast</button>
    </div>
  );
}
```

---

## Setup and Installation

### Server Setup

1. **Install dependencies:**
```bash
cd Server
npm install
```

2. **Environment variables:**
Create `.env` file:
```env
PORT=8000
NODE_ENV=development
URL=https://your-frontend-url.com
```

3. **Start server:**
```bash
npm start
```

### Client Setup

1. **Install dependencies:**
```bash
cd Client
npm install
```

2. **Environment variables:**
Create `.env.local` file:
```env
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:8000
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

### Docker Deployment

**Server Dockerfile is available:**
```bash
cd Server
docker build -t zippy-server .
docker run -p 8000:8000 zippy-server
```

### Dependencies

**Server:**
- `express`: Web framework
- `socket.io`: Real-time communication
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

**Client:**
- `next`: React framework
- `socket.io-client`: Socket.IO client
- `simple-peer`: WebRTC peer connections
- `@radix-ui/*`: UI components
- `tailwindcss`: CSS framework
- `framer-motion`: Animation library

---

## Security Considerations

1. **CORS Configuration:** Server restricts origins to specified domains
2. **TURN Servers:** Configured for NAT traversal in WebRTC connections  
3. **Input Validation:** Validate all user inputs and file types
4. **File Size Limits:** Consider implementing file size restrictions
5. **Rate Limiting:** Implement rate limiting for Socket.IO events

## Browser Compatibility

- **Chrome/Chromium:** Full support
- **Firefox:** Full support  
- **Safari:** Full support (iOS 11+)
- **Edge:** Full support

## Limitations

- Requires same network for optimal P2P performance
- File size limited by browser memory constraints
- Connection relies on STUN/TURN servers for NAT traversal
- No persistent file storage (direct peer transfer only)

---

*This documentation covers all public APIs, components, and functions in the Zippy application. For additional implementation details, refer to the source code or create GitHub issues for specific questions.*