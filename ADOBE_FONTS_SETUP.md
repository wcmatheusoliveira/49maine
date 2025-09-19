# Adobe Fonts Setup - Adventures Unlimited

## Steps to Enable Adventures Unlimited Font

1. **Create Adobe Fonts Account** (if you don't have one)
   - Go to https://fonts.adobe.com/
   - Sign in with your Adobe ID

2. **Add Adventures Unlimited to Your Web Project**
   - Visit: https://fonts.adobe.com/fonts/adventures-unlimited
   - Click "Add to Web Project"
   - Create a new web project or add to existing one
   - Name it something like "49Maine"

3. **Get Your Web Project ID**
   - Go to your Web Projects: https://fonts.adobe.com/my_fonts#web_projects-section
   - Click on your project
   - Copy the Project ID from the embed code (it looks like: `abc123d.css`)

4. **Update the Layout File**
   - Replace `YOURPROJECTID` in `/src/app/layout.tsx` line 47 with your actual Adobe Fonts project ID
   - Example: `https://use.typekit.net/abc123d.css`

5. **Use the Font in Your Components**
   The font is now available as `font-adventures` class in Tailwind CSS.

   Example usage:
   ```jsx
   <h1 className="font-adventures">Your text here</h1>
   ```

## Font Weights Available
Adventures Unlimited typically comes with these weights:
- Regular (400)
- Bold (700)

## CSS Class Name
The font is registered in Adobe Fonts as: `adventures-unlimited`

## Fallback
If the font doesn't load, it will fall back to the default serif font.

## Testing
After setup, you should see the Adventures Unlimited font applied to any element with the `font-adventures` class.