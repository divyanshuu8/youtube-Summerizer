# YouTube Summarizer

YouTube Summarizer is a web application that extracts transcripts from YouTube videos and provides concise summaries. By leveraging the YouTube Transcript API, this system makes it easier to grasp the key points of a video without watching it entirely.

## Features

- **Transcript Extraction**: Fetches transcripts from YouTube videos using the YouTube Transcript API.
- **Text Summarization**: Processes the transcript to generate concise summaries.
- **Frontend Interface**: React-based user interface for easy interaction.
- **Backend API**: FastAPI framework to handle transcript fetching and summarization logic.
- **User-Friendly Design**: Simple and intuitive interface for better usability.

## Technologies Used

- **Programming Language**: Python
- **Frontend**: React
- **Backend**: FastAPI
- **API**: YouTube Transcript API

## Installation

### Prerequisites
- Python 3.8 or later
- Node.js and npm
- pip (Python package manager)

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/divyanshuu8/youtube-Summerizer.git
    cd youtube-summarizer
    ```

2. **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3. **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

4. **Access the Application**:
   - Backend will run at `http://127.0.0.1:8000`
   - Frontend will run at `http://localhost:3000`

## Usage

1. Open the frontend application in your browser.
2. Enter the YouTube video URL in the input field.
3. Click on the **Summarize** button to fetch the transcript and view the summary.

## File Structure

```
youtube-summarizer/
│
├── backend/               # Backend code with FastAPI
│   ├── services/          # YouTube Transcript and summarization logic
│   ├── routes/            # API routes
│   └── main.py            # Entry point for FastAPI server
│
├── frontend/              # Frontend code with React
│   ├── src/               # React components and assets
│   └── public/            # Static files
│
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
└── package.json           # Frontend dependencies
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request with a detailed explanation of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For questions or feedback, please reach out to [Divyanshu Singh](mailto:singhdivyanshu975@gmail.com).

---

Feel free to customize and enhance the YouTube Summarizer system for your needs!
