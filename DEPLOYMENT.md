# Deployment Instructions for Vercel

Follow these steps to deploy the Event App to Vercel:

1. **Prepare your project:**
   - Ensure all changes are committed and pushed to your GitHub repository.
   - Make sure you have a `vercel.json` file in your project root (already added in this commit).

2. **Set up Vercel:**
   - If you haven't already, sign up for a Vercel account at https://vercel.com.
   - Install the Vercel CLI by running: `npm i -g vercel`

3. **Configure environment variables:**
   - In the Vercel dashboard, go to your project settings.
   - Add the following environment variables:
     - `VITE_SUPABASE_PROJECT_URL`
     - `VITE_SUPABASE_API_KEY`
     - `VITE_MAPBOX_TOKEN`
   - Ensure these variables are set to your production values.

4. **Deploy your app:**
   - Open a terminal in your project directory.
   - Run `vercel` to start the deployment process.
   - Follow the prompts to link your project to Vercel if it's not already linked.
   - Vercel will automatically detect that it's a Vite project and set up the build configuration.

5. **Verify the deployment:**
   - Once the deployment is complete, Vercel will provide you with a URL to your deployed app.
   - Open the URL in a browser to ensure everything is working correctly.

6. **Set up automatic deployments:**
   - By default, Vercel will deploy your app automatically when you push changes to your main branch.
   - You can configure branch deployments in the Vercel dashboard if needed.

7. **Custom domain (optional):**
   - If you want to use a custom domain, you can set it up in the Vercel dashboard under the "Domains" section of your project settings.

Remember to always test your app thoroughly after deployment to ensure all features are working as expected in the production environment.