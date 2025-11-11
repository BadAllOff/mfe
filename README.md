# Microfrontend App

Access via https://d30l8vjkicldr6.cloudfront.net/
This repository contains a microfrontend application structured into multiple packages. Each package represents a different part of the application, such as authentication, container, dashboard, and marketing.

## Project Structure

- **auth**: Handles authentication-related functionalities.
- **container**: The main application container that integrates other microfrontends.
- **dashboard**: Provides dashboard functionalities.
- **marketing**: Contains marketing-related components and pages.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**
   ```bash
   cd microfrontendApp/mfp
   ```

3. **Install dependencies for each package**
   ```bash
   cd packages/container
   npm install
   ```
   Repeat for other packages as needed.

4. **Run the application**
   ```bash
   npm start
   ```
   This will start the development server.

## Deployment

The application is set up to deploy using GitHub Actions. Ensure that all necessary secrets are configured in the repository settings.

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
