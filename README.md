# TubeFile

TubeFile is a simple yet powerful browser extension designed to quickly collect YouTube video links and export them into a clean text file, ready for use by other applications.

## Features

-   **One-Click Adding:** An "Add" button is directly integrated into the YouTube video page, next to other action buttons.
-   **Automatic Link Cleaning:** Automatically saves the "pure" video URL (`youtube.com/watch?v=...`) by removing all superfluous parameters (playlists, tracking, etc.).
-   **Simple Management Interface:** A popup accessible from your browser's toolbar allows you to view, manage, and delete links from your list.
-   **Easy Export:** Export your complete list of links with a single click to a `links.txt` file, with one link per line.

## Synergy with TubeStealer

This project was designed to work in perfect harmony with [**TubeStealer**](https://github.com/bc1pzzfnxl/TubeStealer), my other project that allows mass downloading of YouTube videos or music from a simple text file.

The workflow is very straightforward:

1.  **Collect:** Browse YouTube and use the "Add" button of the **TubeFile** extension to create your list of favorite videos.
2.  **Export:** Once your selection is complete, open the extension's popup and click "Download List" to get your `links.txt` file.
3.  **Download:** Use this `links.txt` file as input for the **TubeStealer** script to download all the content you've selected.

## Installation

To install this extension locally:

1.  Download or clone this repository to your machine.
2.  Open your browser (Google Chrome, Brave, etc.).
3.  Navigate to the extension management page (`chrome://extensions` or `brave://extensions`).
4.  Enable **"Developer mode"** (usually a toggle in the top right corner).
5.  Click the **"Load unpacked"** button.
6.  Select the folder where you downloaded the project files.
7.  The "TubeFile" extension is now installed and ready to use!

## Tech Stack

-   **JavaScript (ES6+)**
-   **HTML5 / CSS3**
-   **Chrome Extension API (Manifest V3)**

## Author

-   **@bc1pzzfnxl** ([X/Twitter](https://x.com/bc1pzzfnxl))