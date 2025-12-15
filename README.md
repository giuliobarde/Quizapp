# Quiz App

A modern, interactive quiz application built with Next.js, TypeScript, and CSS Modules.

## Features

- 📝 Multiple choice questions from JSON file
- ⏭️ Skip questions functionality
- 📊 Detailed results with score percentage
- 🔍 Review all answers after completion
- 📱 Responsive design for all devices
- 🎨 Beautiful, modern UI with smooth animations

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Questions

Edit the `data/quiz.json` file to add or modify quiz questions. Each question should follow this format:

```json
{
  "id": 1,
  "question": "Your question here?",
  "options": [
    { "id": "a", "text": "Option A" },
    { "id": "b", "text": "Option B" },
    { "id": "c", "text": "Option C" },
    { "id": "d", "text": "Option D" }
  ],
  "correctAnswer": "a"
}
```

- `id`: Unique identifier for the question
- `question`: The question text
- `options`: Array of answer options, each with an `id` (a, b, c, d) and `text`
- `correctAnswer`: The `id` of the correct answer option

## Project Structure

```
Quizapp/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main quiz page
│   └── globals.css         # Global styles
├── components/
│   ├── QuizComponent.tsx   # Quiz question component
│   ├── QuizComponent.module.css
│   ├── ResultsComponent.tsx # Results page component
│   └── ResultsComponent.module.css
├── data/
│   └── quiz.json          # Quiz questions data
├── package.json
├── tsconfig.json
└── next.config.js
```

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules

