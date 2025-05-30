## Backlog
### Configure Prompts
- Create a "Configure Prompts" Button on top which will provide an option to configure prompts.
- This will be a new UI on which will be rendered when the user will click on the above button.
- This UI will have 2 sections, on left we will display list of prompts, and on right we will display the selected prompt.
- On right side we will have an option to edit the prompt.
- We will have an option to add new prompt.
- We will have an option to delete the prompt.
- ✅ Identify where we can store the prompt. (Completed on 02/05/2025)
- ✅ Create backend API for managing prompts. (Completed on 02/05/2025)

### Option to generate content based on above configured prompt
- We will have an option to generate content based on above configured prompt.
- We will have an option to save the generated content + Print.
- This generated content will be shown in the centre of the screen.

--
## 02/05/2025
- ✅ Created backend API for managing prompts with the following endpoints:
  - POST `/api/v1/prompts` - Create or update a prompt
  - GET `/api/v1/prompts/{name}` - Retrieve a specific prompt by name
  - GET `/api/v1/prompts` - List all available prompts
- ✅ Implemented storage for prompts as a JSON array in a single file
- ✅ Added validation for prompt names and content

## 01/05/2025
- We will have an option to generate content based on above configured prompt.