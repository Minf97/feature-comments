# 💬 Feature Comments

A modern, feature-rich comment display system built with Next.js, featuring e-commerce platform design style with comprehensive functionality and multi-scenario applications.

## ✨ Features

- 🎨 **Modern UI Design** - Clean and intuitive interface with shadcn/ui components
- 🌓 **Dark/Light Mode** - Seamless theme switching with next-themes
- 📱 **Responsive Design** - Perfect adaptation for mobile and desktop devices
- ⭐ **Rating System** - 5-star rating display and interaction
- 🖼️ **Image Support** - Multi-image upload with lightbox preview
- 💬 **Hierarchical Replies** - Nested comment system with threading
- 🏷️ **Smart Badges** - Featured comments and verified purchase indicators
- 👍 **Interactive Actions** - Like, helpful, reply, and share functionality
- 🔍 **Search & Filter** - Real-time search and intelligent filtering
- 📊 **Sort Options** - Multiple sorting methods (helpful, recent, rating)
- 🚩 **Report System** - Content moderation and reporting features

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for utility-first CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) for modern React components
- **Icons**: [Lucide React](https://lucide.dev/) for consistent SVG icons
- **Themes**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) for toast messages
- **Image Gallery**: [yet-another-react-lightbox](https://yet-another-react-lightbox.com/) for image preview
- **Development**: [code-inspector-plugin](https://github.com/zh-lx/code-inspector) for debugging support

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/feature-comments.git
cd feature-comments
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Demo Scenarios

The project showcases four main scenarios:

1. **Multi-Features** - Comprehensive comment functionality display
2. **Reply System** - Hierarchical conversation threading  
3. **Image Comments** - Visual feedback with image galleries
4. **Product Cards** - E-commerce integration examples

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # Run TypeScript type checking
npm run clean        # Clean build cache
npm run analyze      # Analyze bundle size
```

## 🚀 Deployment

This project includes automated CI/CD pipeline for deployment to Vercel:

- **Automatic Deployment**: Push to `main` branch triggers production deployment
- **Quality Checks**: ESLint and TypeScript validation on every push
- **Preview Deployments**: Pull requests generate preview environments

## 📂 Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── comments/          # Comment-related components
│   ├── product/           # Product card components
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
├── data/                  # Mock data and JSON files
└── lib/                   # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built with ❤️ using Next.js and modern web technologies.
