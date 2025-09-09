# Kasam Healthcare - React Application

A modern, responsive homeopathic healthcare website built with React, featuring comprehensive natural healing services, patient authentication, and appointment booking system for Dr. Jignesh Parmar's clinics in Ahmedabad.

## 🏥 Features

### Core Pages

- **Home Page**: Hero section, features overview, homeopathic services preview, patient reviews, and call-to-action
- **About Us**: Dr. Jignesh Parmar's story, mission & vision, 15+ years experience, and clinic timeline
- **Services**: Comprehensive homeopathic treatments with detailed descriptions and specialties
- **Contact**: 3 clinic locations with Google Maps, appointment booking form, and contact information
- **Login/Register**: Patient authentication system
- **Dashboard**: Patient portal with appointments, medical history, and profile management

### Key Features

- 📱 **Fully Responsive Design** - Works perfectly on all devices
- 🎨 **Modern Healthcare Theme** - Professional blue and green color scheme
- 🚀 **Fast Performance** - Built with Vite for optimal loading speeds
- ♿ **Accessible** - WCAG compliant with proper semantic HTML
- 📧 **Appointment Booking** - Interactive booking system with real time slots
- 🔍 **SEO Optimized** - Proper meta tags and semantic structure
- 🗺️ **Google Maps Integration** - Interactive maps for all 3 clinic locations
- ⭐ **Patient Reviews** - Real patient testimonials and ratings

### 🏥 Healthcare Features

- **Homeopathic Treatments**: Specialized natural healing services
- **Multiple Locations**: 3 clinics across Ahmedabad (Ghodasar, Jasodanagar, Ellis Bridge)
- **Expert Care**: Dr. Jignesh Parmar with 15+ years of experience
- **Patient Portal**: Dashboard with appointments, medical history, and profile
- **Protected Routes**: Authentication-based access control
- **Real Contact Info**: Actual phone numbers, email, and addresses

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS3 with CSS Variables
- **Fonts**: Google Fonts (Inter & Ubuntu)
- **State Management**: React Context API
- **Authentication**: Custom Auth Context with cookie persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kasam-healthcare-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔐 Authentication System

### Demo Credentials

- **Patient Account**:
  - Email: `patient@example.com`
  - Password: `password123`
- **Admin Account**:
  - Email: `admin@kasamhealthcare.com`
  - Password: `admin123`

### Features

- **Login/Register Forms**: Clean tabbed interface for patient registration
- **Session Persistence**: Uses cookies to maintain login state
- **Protected Routes**: Dashboard and other sensitive pages require authentication
- **User Roles**: Patient and Admin role support
- **Profile Management**: Users can update their profile information
- **Logout Functionality**: Secure logout with session cleanup

## 📞 Contact Information

### Real Contact Details

- **Phone Numbers**: +91 98984 40880, +91 79 2970 0880, +91 90671 45149
- **Email**: drjhp@yahoo.com
- **WhatsApp**: +91 98984 40880
- **Consultation Fee**: ₹1000

### Clinic Locations

- **Ghodasar**: R/1, Annapurna Society, Cadila Road, Ghodasar, Ahmedabad - 380050
- **Jasodanagar**: 46, Heemapark Society, Jasodanagar Cross Road, Ahmedabad - 380026
- **Ellis Bridge**: B/5, Mahakant Complex, Ellis Bridge, Ahmedabad - 380006

## 📁 Project Structure

```
kasam-healthcare-react/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx & Header.css
│   │   ├── Footer.jsx & Footer.css
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── Home.jsx & Home.css
│   │   ├── About.jsx & About.css
│   │   ├── Services.jsx & Services.css
│   │   ├── Contact.jsx & Contact.css
│   │   ├── Login.jsx & Login.css
│   │   └── Dashboard.jsx & Dashboard.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#4175FC` - Main brand color
- **Primary Hover**: `#084AF3` - Interactive states
- **Secondary Green**: `#03E78B` - Accent color
- **Accent Green**: `#49E670` - Success states
- **Dark**: `#101218` - Text and headers
- **Text**: `#494B51` - Body text
- **Light Background**: `#F3F5F5` - Page background
- **White**: `#FFFFFF` - Card backgrounds

### Typography
- **Headings**: Inter font family
- **Body Text**: Ubuntu font family
- **Responsive**: Scales appropriately on all devices

## 📱 Responsive Breakpoints

- **Desktop**: 1240px and above
- **Tablet**: 768px - 1239px
- **Mobile**: 544px - 767px
- **Small Mobile**: Below 544px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Components

### Authentication System
- **AuthContext**: Manages user state, login, register, logout
- **ProtectedRoute**: Guards routes that require authentication
- **Login Page**: Tabbed interface for login and registration

### Patient Portal

- **Dashboard**: Overview of appointments, medical history, profile
- **User Management**: Profile updates and account settings
- **Appointment Management**: View and manage medical appointments

### Homeopathic Services

- **Treatment Specialties**: Gynaecological, Dermatological, Orthopedic, Pediatric problems
- **Natural Healing**: Safe homeopathic remedies without side effects
- **Expert Care**: Experienced homeopathic doctor with 15+ years of experience

## 🚀 Deployment

The application can be deployed to any static hosting service:

- **Vercel**: `npm run build` then deploy `dist` folder
- **Netlify**: Connect repository and set build command to `npm run build`
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **AWS S3**: Upload `dist` folder contents to S3 bucket

## 🔒 Security Features

- **Session Management**: Secure cookie-based authentication
- **Protected Routes**: Client-side route protection
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: Proper data handling and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email drjhp@yahoo.com or create an issue in the repository.

---

**Built with ❤️ for better healthcare accessibility and natural homeopathic healing**
