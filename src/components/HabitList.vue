<template>
  <div class="page-container">
    <div class="habit-list">
      <h2>Meine Gewohnheiten</h2>
      <p class="quote">{{ quote }}</p>
      <ul>
        <li
            v-for="habit in habits"
            :key="habit.id"
            class="habit-item"
        >
          {{ habit.name }}
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: habit.progress + '%' }"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "HabitList",
  data() {
    return {
      quote: "✨ Kleine Schritte führen zu großen Erfolgen!",
      habits: []
    };
  },
  mounted() {
    fetch("https://daily-done-qztv.onrender.com")
        .then(response => response.json())
        .then(data => {
          this.habits = data;
        })
        .catch(error => {
          console.error("Fehler beim Laden der Habits:", error);
        });
  }
};
</script>

<style scoped>

.page-container {
  min-height: 100vh;
  background-color: #D1CFE2;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
}


.habit-list {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: system-ui, sans-serif;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  text-align: center;
  color: #A0CED9;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
  animation: glow 3s ease-in-out infinite alternate;
}

.quote {
  text-align: center;
  font-size: 15px;
  color: #666;
  margin-bottom: 30px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.habit-item {
  background-color: #ffffff;
  color: #333;
  margin-bottom: 20px;
  padding: 18px 22px;
  border-radius: 12px;
  font-size: 17px;
  border-left: 6px solid #7EC4CF;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.habit-item:hover {
  background-color: #f1f1f1;
  transform: scale(1.02);
  cursor: pointer;
}

.progress-bar {
  background-color: #eee;
  height: 10px;
  border-radius: 6px;
  margin-top: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #52B2CF;
  transition: width 0.5s ease;
}
</style>
