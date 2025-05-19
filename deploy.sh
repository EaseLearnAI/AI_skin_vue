#!/bin/bash

# AI Skin Project Deployment Script
# This script deploys both frontend and backend to a remote Ubuntu server

# Configuration
SERVER_IP="101.42.4.184"
SERVER_USER="ubuntu"
SERVER_PWD="@Zhou1567849"
BACKEND_DIR="/home/ubuntu/AI_skin_backend"
FRONTEND_DIR="/home/ubuntu/aiskin"
BACKEND_PORT=5000
FRONTEND_PORT=8080

echo "========== Starting AI Skin Project Deployment =========="

# Create a script for server setup
cat > server_setup.sh << 'EOF'
#!/bin/bash

# Update package lists
sudo apt-get update

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install MongoDB if not already installed
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    sudo apt-get install -y mongodb
    sudo systemctl enable mongodb
    sudo systemctl start mongodb
else
    # Ensure MongoDB is running
    sudo systemctl restart mongodb
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    # Ensure nginx is running
    sudo systemctl restart nginx
fi

echo "Server setup completed!"
EOF

# Create a script for the backend configuration
cat > backend_config.sh << 'EOF'
#!/bin/bash

cd $1

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "PORT=5000" > .env
    echo "MONGODB_URI=mongodb://localhost:27017/aiskin" >> .env
    echo "JWT_SECRET=ai_skin_jwt_secret_production" >> .env
    echo "NODE_ENV=production" >> .env
fi

# Set proper permissions
chmod -R 755 .

# Start the backend using PM2
pm2 delete ai-skin-backend 2>/dev/null || true
pm2 start server.js --name ai-skin-backend

echo "Backend deployment completed!"
EOF

# Create a script for the frontend configuration
cat > frontend_config.sh << 'EOF'
#!/bin/bash

cd $1

# Install dependencies
npm install

# Create .env file for production
echo "VUE_APP_API_URL=http://101.42.4.184:5000/api" > .env.production

# Build the frontend for production
npm run build

# Set proper permissions
chmod -R 755 .

# Setup nginx for the frontend
sudo tee /etc/nginx/sites-available/aiskin.conf > /dev/null << EOT
server {
    listen 80;
    server_name 101.42.4.184;

    location / {
        root $1/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate, max-age=0";
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

# Enable the site and restart nginx
sudo ln -sf /etc/nginx/sites-available/aiskin.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# Start the frontend for development (optional)
# pm2 delete ai-skin-frontend 2>/dev/null || true
# pm2 start "npm run serve" --name ai-skin-frontend

echo "Frontend deployment completed!"
EOF

# Now transfer files to the server using sshpass
echo "Installing sshpass if not already installed (for password-based SSH)..."
sudo apt-get install -y sshpass 2>/dev/null || {
    echo "Could not install sshpass. If you're on Windows, you may need to use manual SSH commands."
}

# Function to run SSH commands
run_ssh_command() {
    sshpass -p "$SERVER_PWD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "$1"
}

# Transfer the setup scripts
echo "Transferring setup scripts..."
sshpass -p "$SERVER_PWD" scp -o StrictHostKeyChecking=no server_setup.sh backend_config.sh frontend_config.sh $SERVER_USER@$SERVER_IP:/home/$SERVER_USER/

# Run server setup
echo "Setting up server..."
run_ssh_command "chmod +x /home/$SERVER_USER/server_setup.sh && /home/$SERVER_USER/server_setup.sh"

# Create project directories
echo "Creating project directories..."
run_ssh_command "mkdir -p $BACKEND_DIR $FRONTEND_DIR"

# Transfer backend files
echo "Transferring backend files..."
sshpass -p "$SERVER_PWD" scp -o StrictHostKeyChecking=no -r AI_skin_backend/* $SERVER_USER@$SERVER_IP:$BACKEND_DIR/

# Transfer frontend files
echo "Transferring frontend files..."
sshpass -p "$SERVER_PWD" scp -o StrictHostKeyChecking=no -r aiskin/* $SERVER_USER@$SERVER_IP:$FRONTEND_DIR/

# Run backend config
echo "Configuring backend..."
run_ssh_command "chmod +x /home/$SERVER_USER/backend_config.sh && /home/$SERVER_USER/backend_config.sh $BACKEND_DIR"

# Run frontend config
echo "Configuring frontend..."
run_ssh_command "chmod +x /home/$SERVER_USER/frontend_config.sh && /home/$SERVER_USER/frontend_config.sh $FRONTEND_DIR"

# Set up automatic startup on server reboot
echo "Setting up services to start automatically on reboot..."
run_ssh_command "pm2 save && pm2 startup | tail -n 1 | bash"

# Final checks and output status
echo "Deployment completed!"
echo "Backend should be running at: http://$SERVER_IP:$BACKEND_PORT"
echo "Frontend should be accessible at: http://$SERVER_IP"
echo "To check the status of your applications, run:"
echo "ssh $SERVER_USER@$SERVER_IP 'pm2 list'"

# Cleanup
rm server_setup.sh backend_config.sh frontend_config.sh

echo "========== Deployment Finished ==========" 