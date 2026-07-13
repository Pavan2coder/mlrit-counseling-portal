# Changelog

## [Unreleased]

### Added
- Google OAuth integration with account picker
- Email domain validation (@mlrit.ac.in only)
- Support for Google Auth users in profile
- Beautiful interactive Google sign-in button
- Account selection prompt for multiple Google accounts

### Changed
- Removed loading toasts for cleaner UX
- Updated home page subtitle to "Student Counseling Portal"
- Backend port changed from 8000 to 5000
- Improved error messages for authentication

### Fixed
- Profile fetch logic for Google OAuth users
- CORS configuration for multiple origins
- Google OAuth duplicate key bug
- Vercel reload 404 errors
