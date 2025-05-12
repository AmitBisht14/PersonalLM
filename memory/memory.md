# PersonalLM Project Memories

## [IMPORTANT] Frontend Architecture: API and Service Layer Separation

Established a critical architectural pattern for the frontend codebase:

1. **API Layer (`/src/api/`)**: 
   - All direct API calls must be placed in dedicated files within the `/src/api/` folder
   - Files should be named with the pattern `{resource}Api.ts` (e.g., [pdfApi.ts](cci:7://file:///Users/amitbisht/Projects/ProductivityTools/PersonalLM/frontend/src/api/pdfApi.ts:0:0-0:0), `promptApi.ts`)
   - Responsible for HTTP communication, error handling, and returning raw API responses
   - Each function should handle a single API endpoint

2. **Service Layer (`/src/services/`)**: 
   - Services consume the API functions and add business logic
   - Files should be named with the pattern `{resource}Service.ts`
   - Responsible for coordinating API calls, data transformation, and implementing business rules
   - Services expose a clean interface to components, hiding API implementation details

This separation of concerns improves:
- Code organization and maintainability
- Testability (API calls can be easily mocked)
- Reusability of API functions across different services
- Clarity of responsibility between HTTP communication and business logic

Example implementation:
- [pdfApi.ts](cci:7://file:///Users/amitbisht/Projects/ProductivityTools/PersonalLM/frontend/src/api/pdfApi.ts:0:0-0:0): Contains `fetchFormattedPDFContent()`, `fetchRawPDFContent()`, etc.
- [pdfService.ts](cci:7://file:///Users/amitbisht/Projects/ProductivityTools/PersonalLM/frontend/src/services/pdfService.ts:0:0-0:0): Uses these API functions and transforms responses for component consumption

Date: May 12, 2025