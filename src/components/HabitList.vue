<template>
  <div class="page-container">
    <div class="habit-list">
      <h2>Meine Gewohnheiten</h2>
      <p class="quote">{{ quote }}</p>

      <form @submit.prevent="addHabit" class="new-habit-form">
        <input v-model="newHabit.name" placeholder="Name" required />
        <input v-model="newHabit.description" placeholder="Beschreibung" required />
        <button type="submit">➕ Hinzufügen</button>
      </form>

      <ul>
        <li
            v-for="habit in habits"
            :key="habit.id"
            class="habit-item"
        >
          <div v-if="editingHabitId === habit.id">
            <input v-model="editHabit.name" placeholder="Neuer Name" />
            <input v-model="editHabit.description" placeholder="Neue Beschreibung" />
            <button @click="saveEdit(habit.id)">💾 Speichern</button>
            <button @click="cancelEdit">❌ Abbrechen</button>
          </div>
          <div v-else class="habit-header" style="display: flex; justify-content: space-between; align-items: center;">
            <strong>{{ habit.name }}</strong>
            <div>
              <button @click="startEdit(habit)">✏️ Bearbeiten</button>
              <button @click="deleteHabit(habit.id)">🗑️ Löschen</button>
            </div>
          </div>

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
      habits: [],
      newHabit: {
        name: "",
        description: ""
      },
      editingHabitId: null,
      editHabit: {
        name: "",
        description: ""
      }
    };
  },
  mounted() {
    fetch("https://daily-done-qztv.onrender.com/api/habits")
        .then(response => response.json())
        .then(data => {
          this.habits = data.map(habit => ({
            ...habit,
            progress: 50 // temporärer Wert
          }));
        })
        .catch(error => {
          console.error("Fehler beim Laden der Habits:", error);
        });
  },
  methods: {
    addHabit() {
      fetch("https://daily-done-qztv.onrender.com/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.newHabit)
      })
          .then(response => response.json())
          .then(data => {
            this.habits.push(data);
            this.newHabit.name = "";
            this.newHabit.description = "";
          })
          .catch(error => {
            console.error("Fehler beim Erstellen der Habit:", error);
          });
    },
    deleteHabit(id) {
      fetch(`https://daily-done-qztv.onrender.com/api/habits/${id}`, {
        method: "DELETE"
      })
          .then(() => {
            this.habits = this.habits.filter(habit => habit.id !== id);
          })
          .catch(error => {
            console.error("Fehler beim Löschen:", error);
          });
    },
    startEdit(habit) {
      this.editingHabitId = habit.id;
      this.editHabit = {name: habit.name, description: habit.description};
    },
    cancelEdit() {
      this.editingHabitId = null;
    },
    saveEdit(id) {
      if (!this.editHabit.name.trim() || !this.editHabit.description.trim()) {
        alert("Bitte gib Name und Beschreibung ein.");
        return;
      }

      fetch(`https://daily-done-qztv.onrender.com/api/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.editHabit)
      })
          .then(response => response.json())
          .then(updated => {
            const index = this.habits.findIndex(h => h.id === id);
            if (index !== -1) {
              this.habits[index].name = updated.name;
              this.habits[index].description = updated.description;
            }
            this.editingHabitId = null;
          })
          .catch(error => {
            console.error("Fehler beim Bearbeiten:", error);
          });
    }

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

button {
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
  margin-left: 10px;
}

button:hover {
  text-decoration: underline;
}

</style>
