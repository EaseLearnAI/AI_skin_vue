# AI Skin Project Deployment Guide

This document provides instructions for deploying the AI Skin project to your Ubuntu server.

## Prerequisites

- Ubuntu server (tested on Ubuntu 20.04 LTS)
- SSH access to the server
- Git Bash or similar terminal on Windows

## Deployment Steps

### 1. Clone the Repository

First, ensure you have the complete project on your local machine.

### 2. Deploy with the Script

The project includes an automated deployment script that will:
- Install all required dependencies (Node.js, MongoDB, PM2, Nginx)
- Deploy both frontend and backend applications
- Configure the server to run the applications
- Set up Nginx as a reverse proxy

To deploy:

1. Open Git Bash or terminal
2. Navigate to the project root directory
3. Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will ask for your password when needed and handle the entire deployment process.

### 3. Verify Deployment

After the script completes:
- Frontend should be accessible at: http://101.42.4.184
- Backend API should be running at: http://101.42.4.184:5000

To check the status of your applications on the server:

```bash
ssh ubuntu@101.42.4.184 'pm2 list'
```

### 4. Troubleshooting

If you encounter issues:

#### Frontend Issues
- Check Nginx configuration: `sudo nano /etc/nginx/sites-available/aiskin.conf`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check PM2 logs: `pm2 logs ai-skin-frontend`

#### Backend Issues
- Check MongoDB status: `sudo systemctl status mongodb`
- Check PM2 logs: `pm2 logs ai-skin-backend`
- Verify .env configuration: `nano /home/ubuntu/AI_skin_backend/.env`

## Manual Deployment (if needed)

If the script fails, you can follow these manual steps:

### Backend Manual Deployment
```bash
# SSH to your server
ssh ubuntu@101.42.4.184

# Update packages
sudo apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb
sudo systemctl enable mongodb
sudo systemctl start mongodb

# Install PM2
sudo npm install -g pm2

# Create directory for backend
mkdir -p /home/ubuntu/AI_skin_backend

# Copy backend files (from your local machine)
# scp -r AI_skin_backend/* ubuntu@101.42.4.184:/home/ubuntu/AI_skin_backend/

# Configure and start backend
cd /home/ubuntu/AI_skin_backend
npm install
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/aiskin" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "NODE_ENV=production" >> .env
pm2 start server.js --name ai-skin-backend
```

### Frontend Manual Deployment
```bash
# Install Nginx
sudo apt-get install -y nginx

# Create directory for frontend
mkdir -p /home/ubuntu/aiskin

# Copy frontend files (from your local machine)
# scp -r aiskin/* ubuntu@101.42.4.184:/home/ubuntu/aiskin/

# Configure and build frontend
cd /home/ubuntu/aiskin
npm install
echo "VUE_APP_API_URL=http://101.42.4.184:5000/api" > .env.production
npm run build

# Configure Nginx
sudo tee /etc/nginx/sites-available/aiskin.conf > /dev/null << EOT
server {
    listen 80;
    server_name 101.42.4.184;

    location / {
        root /home/ubuntu/aiskin/dist;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOT

# Enable site and restart Nginx
sudo ln -sf /etc/nginx/sites-available/aiskin.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
``` 