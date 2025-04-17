# ReColl - Resource Collection App

A modern web application for organizing and managing digital resources, built with React, Supabase, and Tailwind CSS.

![ReColl App](https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800)

## Features

- 📱 **Responsive Design**: Beautiful and functional across all devices
- 🎥 **YouTube Integration**: Watch videos directly within the app
- 🏷️ **Smart Tagging**: Organize resources with customizable tags
- 🔍 **Instant Search**: Quick access to your resources
- 📁 **File Management**: Upload and manage files securely
- 🔐 **User Authentication**: Secure access to your personal collection
- 🎨 **Modern UI**: Clean and intuitive interface with glass morphism design
- ⚡ **Real-time Updates**: Instant reflection of changes

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Database**: PostgreSQL (via Supabase)
- **Icons**: Lucide React
- **Media Player**: React Player
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/recoll.git
   cd recoll
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application requires the following Supabase tables:

- `resources`: Stores all user resources
  - `id`: UUID (Primary Key)
  - `title`: Text
  - `tags`: Text Array
  - `type`: Text
  - `url`: Text
  - `preview`: JSONB
  - `created_at`: Timestamp
  - `user_id`: UUID (Foreign Key)

Row Level Security (RLS) policies are implemented to ensure users can only access their own resources.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in to access your personal collection
2. **Add Resources**: Click the "+" button to add new resources
   - Upload files
   - Add web links
   - Add YouTube videos
3. **Organize**: Add tags to categorize your resources
4. **Search**: Use the search bar to find resources by title or tags
5. **Filter**: Filter resources by type or tags
6. **Preview**: Watch YouTube videos directly in the app
7. **Manage**: Edit or delete resources as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Lucide](https://lucide.dev/) for the beautiful icons
- [React Player](https://github.com/CookPete/react-player) for media playback
