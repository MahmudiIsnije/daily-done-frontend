<template>
  <div class="page-container">
    <h1 class="headline">🌟 Daily Done 🏆</h1>
    <div class="main-grid">

      <div class="left-side">
        <h2>Meine Gewohnheiten</h2>
        <p class="quote">{{ quote }}</p>

        <form @submit.prevent="addHabit" class="new-habit-form">
          <input v-model="newHabit.name" placeholder="Name" required />
          <input v-model="newHabit.description" placeholder="Beschreibung" required />
          <button type="submit">➕ Hinzufügen</button>
        </form>

        <ul>
          <li v-for="habit in habits" :key="habit.id" class="habit-item">
            <div v-if="editingHabitId === habit.id">
              <input v-model="editHabit.name" placeholder="Neuer Name" />
              <input v-model="editHabit.description" placeholder="Neue Beschreibung" />
              <button @click="saveEdit(habit.id)">💾 Speichern</button>
              <button @click="cancelEdit">❌ Abbrechen</button>
            </div>
            <div v-else class="habit-header">
              <div>
                <strong>{{ habit.name }}</strong><br />
                <small>{{ habit.description }}</small>
              </div>
              <div>
                <button @click="startEdit(habit)">✏️</button>
                <button @click="deleteHabit(habit.id)">🗑️</button>
                <button @click="checkHabitToday(habit.id)">✅</button>
                <span v-if="checkedToday.includes(habit.id)">✅ Heute erledigt</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: habit.progress + '%' }"></div>
            </div>
          </li>
        </ul>
      </div>


      <div class="right-side">
        <h2>📅 Kalender</h2>
        <v-calendar is-expanded :attributes="calendarAttributes" />

        <div v-if="completedHabitsToday.length > 0" style="margin-top: 30px;">
          <h3 style="color: green;">✅ Erledigt heute</h3>
          <ul>
            <li v-for="habit in completedHabitsToday" :key="habit.id">
              {{ habit.name }}
            </li>
          </ul>
        </div>
      </div>

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
      },
      checkedToday: [],
      calendarAttributes: [],
      completedHabitsToday: []
    };
  },


  mounted() {
    this.loadHabits();
    const API = process.env.VUE_APP_API_URL;
    fetch(`${API}/habits/checks/month/2025-06`)
        .then(response => response.json())
        .then(data => {
          this.calendarAttributes = data.map(check => {
            const habitName = check.habit?.name || "Unbekannt";
            const isToday = new Date(check.date).toDateString() === new Date().toDateString();

            if (isToday && check.habit?.id) {
              this.checkedToday.push(check.habit.id);
            }

            return {
              key: check.id,
              dates: new Date(check.date),
              highlight: {
                backgroundColor: '#52B2CF',
                borderRadius: '50%'
              },
              popover: {
                label: habitName
              }
            };
          });
        });
  },


  methods: {
    addHabit() {
      const API = import.meta.env.VITE_API_URL;
      if (!this.newHabit.name.trim() || !this.newHabit.description.trim()) {
        alert("Bitte gib einen Namen und eine Beschreibung ein.");
        return;
      }

      console.log("📦 Wird gesendet:", this.newHabit);

      fetch(`${API}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.newHabit)
      })
          .then(response => {
            if (!response.ok) throw new Error("Fehler beim Erstellen des Habits");
            return response.json();
          })
          .then(data => {
            if (!data || !data.id) {
              alert("FEHLER: Der Server hat keine gültige ID zurückgegeben.");
              console.error("Fehlerhafte Antwort vom Server:", data);
              return;
            }

            this.habits.push({
              ...data,
              progress: 50
            });
            this.newHabit.name = "";
            this.newHabit.description = "";
          })
          .catch(error => {
            console.error("Fehler beim Erstellen der Habit:", error);
          });
    },

    deleteHabit(id) {
      const API = import.meta.env.VITE_API_URL;
      fetch(`${API}/habits/${id}`, {
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
      this.editHabit = {
        name: habit.name,
        description: habit.description
      };
    },
    cancelEdit() {
      this.loadHabits();
      this.editingHabitId = null;
    },
    saveEdit(id) {
      const habitData = {
        name: this.editHabit.name,
        description: this.editHabit.description
      };

      if (!habitData.name.trim() || !habitData.description.trim()) {
        alert("Bitte gib Name und Beschreibung ein.");
        return;
      }

      const API = import.meta.env.VITE_API_URL;
      fetch(`${API}/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(habitData)
      })
          .then(response => {
            if (!response.ok) {
              throw new Error("Serverantwort war nicht OK");
            }
            return response.json();
          })
          .then(updated => {
            if (!updated || !updated.name) {
              console.error("Ungültige Antwort vom Server:", updated);
              alert("Fehler beim Speichern.");
              return;
            }

            const index = this.habits.findIndex(h => h.id === id);
            if (index !== -1) {
              this.habits[index] = {
                ...this.habits[index],
                ...updated,
                progress: this.habits[index].progress // progress behalten
              };
            }

            this.editingHabitId = null;
          })
          .catch(error => {
            console.error("Fehler beim Bearbeiten:", error);
            alert("Fehler beim Speichern. Schau in die Konsole.");
          });
    },
    checkHabitToday(id) {
      const API = import.meta.env.VITE_API_URL;
      fetch(`${API}/habits/${id}/check`, {
        method: "POST"
      })
          .then(response => {
            if (response.status === 409) {
              alert("Heute bereits abgehakt!");
              return;
            }
            if (!response.ok) {
              throw new Error("Fehler beim Abhaken");
            }

            this.checkedToday.push(id);

            const habit = this.habits.find(h => h.id === id);

            if (habit) {
              if (!this.completedHabitsToday.find(h => h.id === habit.id)) {
                this.completedHabitsToday = [...this.completedHabitsToday, habit];
                console.log("✅ Abgehakt:", habit.name);
                console.log("📋 Erledigt-Liste:", this.completedHabitsToday);
              }

              if (habit.progress < 100) {
                habit.progress = Math.min(habit.progress + 10, 100);
              }
            }

          })
          .catch(error => {
            console.error("Fehler beim Abhaken:", error);
          });
    },


    loadHabits() {
      const API = import.meta.env.VITE_API_URL;
      fetch(`${API}/habits`)          .then(response => response.json())
          .then(data => {
            this.habits = data
                .filter(habit => habit.id && habit.id > 0)
                .map(habit => ({
                  ...habit,
                  progress: 50
                }));
          })
          .catch(error => {
            console.error("Fehler beim Laden der Habits:", error);
          });
    }
  }
};
</script>

<style scoped>

.page-container {
  padding: 20px;
  background-color: #f0f4f8;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}


.headline {
  text-align: center;
  font-size: 48px; /* vorher war 36px – jetzt größer */
  margin-bottom: 30px;
  color: #1995ba;
  font-weight: 700;
}

.main-grid {
  display: flex;
  gap: 40px;
  justify-content: space-between;
  align-items: flex-start;
}

.left-side {
  width: 55%;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.right-side {
  width: 40%;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.habit-item {
  margin-bottom: 20px;
  padding: 16px;
  border-left: 6px solid #7EC4CF;
  border-radius: 10px;
  background: #fafafa;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-bar {
  height: 10px;
  background: #eee;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #52B2CF;
  transition: width 0.3s ease;
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
span {
  margin-left: 10px;
  color: green;
  font-weight: bold;
}


</style>
