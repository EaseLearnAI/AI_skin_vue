<template>
  <div class="settings-menu">
    <h3 class="settings-title">设置</h3>
    <div class="settings-list">
      <div 
        v-for="(item, index) in menuItems" 
        :key="index"
        class="setting-item"
        @click="handleItemClick(item)"
      >
        <div class="setting-icon" :class="item.iconClass">
          <font-awesome-icon :icon="item.icon" />
        </div>
        <div class="setting-content">
          <div class="setting-name">{{ item.name }}</div>
          <div class="setting-description">{{ item.description }}</div>
        </div>
        <div class="setting-action">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsMenu',
  data() {
    return {
      menuItems: [
        {
          name: '历史记录',
          description: '查看护肤分析历史',
          icon: ['fas', 'history'],
          iconClass: 'icon-primary',
          action: 'history'
        },
        {
          name: '我的收藏',
          description: '管理收藏的产品和方案',
          icon: ['fas', 'bookmark'],
          iconClass: 'icon-secondary',
          action: 'favorites'
        },
        {
          name: '消息通知',
          description: '管理推送通知设置',
          icon: ['fas', 'bell'],
          iconClass: 'icon-blue',
          action: 'notifications'
        },
        {
          name: '主题设置',
          description: '个性化界面主题',
          icon: ['fas', 'palette'],
          iconClass: 'icon-purple',
          action: 'theme'
        },
        {
          name: '隐私设置',
          description: '数据隐私与安全',
          icon: ['fas', 'shield-alt'],
          iconClass: 'icon-green',
          action: 'privacy'
        },
        {
          name: '帮助与反馈',
          description: '常见问题与意见反馈',
          icon: ['fas', 'question-circle'],
          iconClass: 'icon-orange',
          action: 'feedback'
        },
        {
          name: '关于我们',
          description: '版本信息与团队介绍',
          icon: ['fas', 'info-circle'],
          iconClass: 'icon-cyan',
          action: 'about'
        },
        {
          name: '退出登录',
          description: '安全退出当前账户',
          icon: ['fas', 'sign-out-alt'],
          iconClass: 'icon-red',
          action: 'logout'
        }
      ]
    }
  },
  methods: {
    handleItemClick(item) {
      this.$emit('menu-click', item.action)
    }
  }
}
</script>

<style scoped>
.settings-menu {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 1rem;
  overflow: hidden;
}

.settings-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.3);
}

.setting-item:hover {
  background: rgba(14, 165, 233, 0.05);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.setting-item:active {
  transform: translateX(2px) scale(0.98);
}

.setting-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.125rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.icon-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.icon-secondary {
  background: linear-gradient(135deg, #ec4899, #db2777);
}

.icon-blue {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.icon-purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.icon-green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.icon-orange {
  background: linear-gradient(135deg, #fb923c, #ea580c);
}

.icon-cyan {
  background: linear-gradient(135deg, #22d3ee, #0891b2);
}

.icon-red {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.setting-content {
  flex: 1;
  min-width: 0;
}

.setting-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.setting-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.setting-action {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

/* 特殊样式 */
.setting-item:last-child {
  margin-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
}

.setting-item:last-child:hover {
  background: rgba(239, 68, 68, 0.05);
}

@media (max-width: 480px) {
  .settings-menu {
    margin: 1rem 0.5rem;
    padding: 1rem;
  }
  
  .setting-item {
    padding: 0.75rem;
  }
  
  .setting-icon {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    margin-right: 0.75rem;
  }
  
  .setting-name {
    font-size: 0.9375rem;
  }
  
  .setting-description {
    font-size: 0.8125rem;
  }
}

@media (max-width: 360px) {
  .setting-icon {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
  
  .setting-name {
    font-size: 0.875rem;
  }
  
  .setting-description {
    font-size: 0.75rem;
  }
}
</style> 