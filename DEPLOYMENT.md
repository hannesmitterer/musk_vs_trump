# Deployment Configuration

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages.

### Automatic Deployment
- The frontend automatically deploys when changes are pushed to the `main` branch
- GitHub Actions workflow is configured in `.github/workflows/deploy.yml`
- The deployed site will be available at: `https://[username].github.io/[repository-name]`

### Manual Deployment Steps

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Configure API URL**:
   For production deployment, update the API URL in `frontend/app.js`:
   ```javascript
   // Change from:
   apiUrl: 'http://localhost:5000/api/graph'
   
   // To your production API:
   apiUrl: 'https://your-backend-domain.com/api/graph'
   ```

3. **Deploy Backend**:
   Deploy your Flask backend to a hosting service:
   - Heroku: `git push heroku main`
   - AWS/GCP: Follow platform-specific deployment guides
   - Render/Railway: Connect repository for auto-deployment

### Local Testing

Test the production build locally:

```bash
# Serve frontend locally
cd frontend
python3 -m http.server 8000

# Or use any other static file server
npx serve .
```

### Environment Configuration

The application supports different configurations:

**Development** (`localhost`):
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:8080`

**Production** (GitHub Pages):
- Frontend: `https://[username].github.io/[repository-name]`
- Backend: Configure your production API URL

### CORS Configuration

Ensure your production backend allows requests from your GitHub Pages domain:

```python
# In your Flask app
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'http://localhost:8080',  # Development
    'https://[username].github.io'  # Production
])
```

### Performance Considerations

- All dependencies are loaded from CDN for faster loading
- Static assets are optimized for GitHub Pages
- Responsive design works across all devices
- Graph visualizations are optimized for performance

### Troubleshooting

**Common Issues**:
1. **404 on GitHub Pages**: Check that the workflow completed successfully
2. **CORS Errors**: Verify backend CORS configuration
3. **API Connection**: Update API URLs for production environment
4. **Missing Dependencies**: Ensure CDN links are accessible

**Monitoring**:
- Check GitHub Actions tab for deployment status
- Use browser developer tools to debug client-side issues
- Monitor backend logs for API-related problems