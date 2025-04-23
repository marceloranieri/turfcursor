# Turf App Documentation

This directory contains comprehensive documentation for the Turf application.

## Available Documentation

### Daily Topics System
- [Daily Topics System Overview](DAILY_TOPICS_SYSTEM.md) - Complete guide to the daily topic rotation system
- [Edge Function Deployment](EDGE_FUNCTION_DEPLOYMENT.md) - Instructions for deploying the Edge Function
- [Deployment Guide](DEPLOY_GUIDE.md) - Step-by-step deployment instructions
- [Manual Testing Guide](MANUAL_TESTING.md) - How to manually test the daily topics system

## Quick Start

The Turf Daily Topics System automatically rotates 5 unique debate topics every 24 hours. To get started:

1. **Set up the database**:
   ```sql
   -- Run in Supabase SQL Editor
   -- From lib/database/migrations/daily_topics_schema.sql
   ```

2. **Deploy the Edge Function**:
   ```bash
   npm run deploy:function
   ```

3. **Set up GitHub Actions**:
   - Add required secrets to your repository
   - GitHub Actions will handle daily topic rotation

4. **Access the admin panel**:
   - Visit `/admin/topics` in your application
   - Only users with debate maestro role can access it

5. **Manually test the system**:
   ```bash
   # Test with npm script
   npm run refresh:topics
   
   # Or directly with curl
   curl -X POST https://<project-ref>.functions.supabase.co/refreshTopics \
     -H "Authorization: Bearer <service-role-key>" \
     -H "Content-Type: application/json"
   ```

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  GitHub Actions │───▶│  Edge Function  │───▶│    Database     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                            │
         │                                            │
         │                                            ▼
         │                                    ┌─────────────────┐
         │                                    │                 │
         └───────────────────────────────────▶│  Frontend App   │
                                              │                 │
                                              └─────────────────┘
```

## Contributing

When contributing to the Daily Topics System, please follow these guidelines:

1. Update documentation when making changes
2. Test all changes thoroughly before submitting
3. Follow existing coding patterns and styles

## Support

If you encounter issues with the Daily Topics System:

1. Check the [Deployment Guide](DEPLOY_GUIDE.md) for troubleshooting steps
2. Review the [Manual Testing Guide](MANUAL_TESTING.md) for debugging
3. Review Edge Function logs in Supabase Dashboard
4. Check GitHub Actions workflow logs 