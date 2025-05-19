<template>
  <div class="daily-routine">
    <div class="section-header">
      <div class="icon-container">
        <font-awesome-icon :icon="['fas', 'calendar-check']" />
      </div>
      <h2 class="title">我的护肤方案</h2>
    </div>
    
    <div class="routines-container">
      <!-- Morning Routine -->
      <div class="routine-section">
        <div class="routine-header">
          <div class="routine-icon">
            <font-awesome-icon :icon="['fas', 'sun']" />
          </div>
          <h3 class="routine-title">早间护理</h3>
        </div>
        
        <div class="routine-items">
          <div 
            v-for="(item, index) in morningRoutine" 
            :key="`morning-${index}`"
            class="routine-item"
            :class="{ 'completed': item.done }"
            @click="toggleTask(morningRoutine, index)"
          >
            <div class="checkbox">
              <font-awesome-icon 
                :icon="item.done ? ['fas', 'check-circle'] : ['far', 'circle']" 
                :class="item.done ? 'checked' : ''"
              />
            </div>
            <div class="item-name">{{ item.product }}</div>
          </div>
        </div>
      </div>
      
      <!-- Evening Routine -->
      <div class="routine-section">
        <div class="routine-header">
          <div class="routine-icon">
            <font-awesome-icon :icon="['fas', 'moon']" />
          </div>
          <h3 class="routine-title">晚间护理</h3>
        </div>
        
        <div class="routine-items">
          <div 
            v-for="(item, index) in eveningRoutine" 
            :key="`evening-${index}`"
            class="routine-item"
            :class="{ 'completed': item.done }"
            @click="toggleTask(eveningRoutine, index)"
          >
            <div class="checkbox">
              <font-awesome-icon 
                :icon="item.done ? ['fas', 'check-circle'] : ['far', 'circle']" 
                :class="item.done ? 'checked' : ''"
              />
            </div>
            <div class="item-name">{{ item.product }}</div>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div v-if="recommendations && recommendations.length > 0" class="recommendations-section">
        <div class="routine-header">
          <div class="routine-icon tips-icon">
            <font-awesome-icon :icon="['fas', 'lightbulb']" />
          </div>
          <h3 class="routine-title">专业建议</h3>
        </div>
        
        <div class="recommendations-list">
          <div 
            v-for="(tip, index) in recommendations" 
            :key="`tip-${index}`"
            class="recommendation-item"
          >
            <font-awesome-icon :icon="['fas', 'check-circle']" class="tip-icon" />
            <div class="tip-content">{{ tip }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DailyRoutine',
  props: {
    morningRoutine: {
      type: Array,
      required: true
    },
    eveningRoutine: {
      type: Array,
      required: true
    },
    recommendations: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toggleTask(routine, index) {
      // Create a copy of the routine
      const updatedRoutine = [...routine];
      // Toggle the done status
      updatedRoutine[index].done = !updatedRoutine[index].done;
      
      // Emit the updated routine to parent
      if (routine === this.morningRoutine) {
        this.$emit('update:morningRoutine', updatedRoutine);
      } else {
        this.$emit('update:eveningRoutine', updatedRoutine);
      }
      
      // Emit save event
      this.$emit('save-routine');
    },
    updateRoutine(routineData) {
      // Update the local routine data with the saved plan
      if (routineData) {
        console.log('更新日常护理方案:', routineData);
        
        // Prepare new routines
        let newMorningRoutine = [];
        let newEveningRoutine = [];
        let newRecommendations = [];
        
        // Update morning routine if available
        if (routineData.routines && routineData.routines.morning) {
          newMorningRoutine = routineData.routines.morning.map(step => ({
            done: false,
            product: step
          }));
        }
        
        // Update evening routine if available
        if (routineData.routines && routineData.routines.evening) {
          newEveningRoutine = routineData.routines.evening.map(step => ({
            done: false,
            product: step
          }));
        }
        
        // Update recommendations if available
        if (routineData.recommendations) {
          newRecommendations = routineData.recommendations;
        }
        
        // Emit events to update parent component's data
        this.$emit('update:morningRoutine', newMorningRoutine);
        this.$emit('update:eveningRoutine', newEveningRoutine);
        this.$emit('update:recommendations', newRecommendations);
        
        // Emit a save event
        this.$emit('save-routine');
      }
    },
    saveRoutineToStorage() {
      // Implementation of saveRoutineToStorage method
    }
  }
}
</script>

<style scoped>
.daily-routine {
  padding: 1.5rem 1rem;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.icon-container {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #B39DDB, #9575CD);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: white;
  font-size: 0.875rem;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #444;
  margin: 0;
}

.routines-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.routine-section {
  background-color: #f9fafb;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.routine-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.routine-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.routine-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #B39DDB, #9575CD);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: white;
  font-size: 0.875rem;
}

.routine-icon.tips-icon {
  background: linear-gradient(135deg, #FFCC80, #FF9800);
}

.routine-title {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin: 0;
}

.routine-items {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.routine-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.routine-item:hover {
  background-color: #f5f5f5;
}

.routine-item.completed {
  opacity: 0.7;
}

.checkbox {
  margin-right: 0.75rem;
  color: #9c9c9c;
  font-size: 1.125rem;
}

.checkbox .checked {
  color: #9575CD;
}

.item-name {
  font-size: 0.9375rem;
  color: #444;
}

.recommendations-section {
  background-color: #fff8e1;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.recommendations-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.tip-icon {
  color: #FF9800;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  font-size: 1rem;
}

.tip-content {
  font-size: 0.9375rem;
  color: #5d4037;
  line-height: 1.5;
}
</style> 