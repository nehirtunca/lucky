# LUCKY Web Application

## Overview
LUCKY is a web application designed to help users express their feelings and receive thoughtful responses. It utilizes the Gemini API to provide personalized feedback, generates mood-specific short poems, suggests color palettes, and recommends small activities. The application also includes a support line for users who may express risky feelings.

## Features
- **User Input**: A form for users to share their feelings.
- **Gemini API Integration**: Fetches responses based on user input.
- **Poem Generation**: Creates short poems tailored to the user's mood.
- **Color Palette Suggestions**: Offers color palettes that resonate with the user's feelings.
- **Activity Recommendations**: Suggests small activities to uplift the user's mood.
- **Support Line**: Displays the 182/112 support line for users expressing risky feelings.

## Project Structure
```
lucky-app
├── src
│   ├── index.html        # Main HTML structure of the application
│   ├── style.css         # Styles for the application
│   ├── script.js         # JavaScript logic for user interaction
│   └── config.js         # Configuration settings for the Gemini API
├── assets
│   └── fonts             # Directory for font files
├── README.md             # Documentation for the project
└── package.json          # npm configuration file
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd lucky-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Open `src/index.html` in your web browser.
2. Use the form to express your feelings and explore the responses, poems, color palettes, and activities suggested by the application.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.