#!/bin/bash
# AI Skin 自动部署脚本
# 用法：bash deploy_auto.sh

PASSWORD='Zhou1567849'

# 前端构建
cd /home/ubuntu/AI_skin_vue/aiskin || exit 1
npm run build || exit 1

# 拷贝前端dist到生产目录

echo $PASSWORD | sudo -S mkdir -p /home/ubuntu/aiskin/dist

echo $PASSWORD | sudo -S cp -r /home/ubuntu/AI_skin_vue/aiskin/dist/* /home/ubuntu/aiskin/dist/

# 重启nginx

echo $PASSWORD | sudo -S systemctl restart nginx

# 重启后端
pm2 restart ai-skin-backend

echo '✅ 自动部署完成！前端和后端已全部重启。' 