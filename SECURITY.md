# Security Policy

## Supported Versions

The following versions are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Suraksha Sense, please do not disclose it publicly. Instead, contact the repository maintainers. 

### Data Privacy & Mock Data
This project was built for a hackathon. **Do not use real personal data** for testing or demonstrations. All insurance policies, premium amounts, and coverage gaps are fictional. The application follows a data-minimization approach: raw inputs are only used for classification and are never persisted to a database or disk.

### Secrets and Configuration
- **Never commit secrets**. `GEMINI_API_KEY` and `SARVAM_API_KEY` must be provided locally via a `.env` file (see `.env.example`).
- Ensure `.env` files remain in `.gitignore`.
