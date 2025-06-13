<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1 class="app-title">Daily Done 🎯</h1>
      <p class="app-subtitle">Erreiche deine Ziele, Schritt für Schritt</p>
    </header>

    <div class="main-layout">
      <!-- Sidebar mit Kategorien -->
      <aside class="sidebar">
        <h3 class="sidebar-title">Kategorien</h3>

        <div class="category-list">
          <button
              @click="selectedCategory = null"
              :class="['category-item', { active: selectedCategory === null }]"
          >
            <div class="category-icon-wrapper">
              <div class="category-icon all-icon">📋</div>
            </div>
            <div class="category-info">
              <span class="category-name">Alle Habits</span>
              <span class="category-count">{{ habits.length }}</span>
            </div>
          </button>

          <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="['category-item', { active: selectedCategory === category.id }]"
          >
            <div class="category-icon-wrapper" :style="{ backgroundColor: category.color }">
              <div class="category-icon">{{ category.icon }}</div>
            </div>
            <div class="category-info">
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ getHabitsByCategory(category.id).length }}</span>
            </div>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="content-area">
        <div class="content-grid">

          <!-- Habits Section -->
          <section class="habits-section">
            <div class="section-header">
              <h2 class="section-title">
                {{ selectedCategory ? getCategoryName(selectedCategory) : 'Alle Habits' }}
              </h2>
              <p class="motivational-quote">{{ quote }}</p>
            </div>

            <!-- New Habit Form -->
            <div class="new-habit-card">
              <h3 class="card-title">Neues Habit hinzufügen</h3>
              <form @submit.prevent="addHabit" class="habit-form">
                <div class="form-row">
                  <input
                      v-model="newHabit.name"
                      placeholder="Habit Name"
                      required
                      class="form-input"
                  />
                  <input
                      v-model="newHabit.description"
                      placeholder="Beschreibung"
                      required
                      class="form-input"
                  />
                </div>
                <div class="form-row">
                  <select v-model="newHabit.categoryId" required class="form-select">
                    <option value="">Kategorie wählen</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.icon }} {{ category.name }}
                    </option>
                  </select>
                  <button type="submit" class="submit-btn">
                    <span class="btn-icon">+</span>
                    Hinzufügen
                  </button>
                </div>
              </form>
            </div>

            <!-- Habits List -->
            <div class="habits-grid">
              <div v-for="habit in filteredHabits" :key="habit.id" class="habit-card">

                <!-- Edit Mode -->
                <div v-if="editingHabitId === habit.id" class="edit-form">
                  <input v-model="editHabit.name" placeholder="Neuer Name" class="edit-input" />
                  <input v-model="editHabit.description" placeholder="Neue Beschreibung" class="edit-input" />
                  <select v-model="editHabit.categoryId" class="edit-select">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.icon }} {{ category.name }}
                    </option>
                  </select>
                  <div class="edit-actions">
                    <button @click="saveEdit(habit.id)" class="save-btn">Speichern</button>
                    <button @click="cancelEdit" class="cancel-btn">Abbrechen</button>
                  </div>
                </div>

                <!-- Display Mode -->
                <div v-else class="habit-content">
                  <div class="habit-header">
                    <div class="habit-category" :style="{ backgroundColor: habit.category?.color }">
                      {{ habit.category?.icon }}
                    </div>
                    <div class="habit-info">
                      <h4 class="habit-name">{{ habit.name }}</h4>
                      <p class="habit-description">{{ habit.description }}</p>
                      <div class="habit-tags">
                        <span class="category-tag">{{ habit.category?.name }}</span>
                        <!-- Streak-Badges -->
                        <div class="streak-badges">
                          <span v-if="getHabitStreak(habit.id).currentStreak > 0" class="streak-badge current">
                            🔥 {{ getHabitStreak(habit.id).currentStreak }} Tage
                          </span>
                          <span v-if="getHabitStreak(habit.id).bestStreak > 0" class="streak-badge best">
                            🏆 Rekord: {{ getHabitStreak(habit.id).bestStreak }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="habit-status">
                      <div v-if="checkedToday.includes(habit.id)" class="status-completed">
                        ✓ Erledigt
                      </div>
                    </div>
                  </div>

                  <div class="progress-section">
                    <div class="progress-bar">
                      <div
                          class="progress-fill"
                          :style="{
                          width: habit.progress + '%',
                          backgroundColor: habit.category?.color || '#6366f1'
                        }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ habit.progress }}%</span>
                  </div>

                  <div class="habit-actions">
                    <button @click="checkHabitToday(habit.id)" class="action-btn check-btn">
                      ✓ Abhaken
                    </button>
                    <button @click="startEdit(habit)" class="action-btn edit-btn">
                      ✏️ Bearbeiten
                    </button>
                    <button @click="deleteHabit(habit.id)" class="action-btn delete-btn">
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Calendar Section -->
          <section class="calendar-section">
            <div class="calendar-card">
              <h3 class="card-title">Aktivitäts-Kalender</h3>
              <v-calendar is-expanded :attributes="calendarAttributes" />

              <div v-if="completedHabitsToday.length > 0" class="completed-today">
                <h4 class="completed-title">Heute erledigt</h4>
                <div class="completed-list">
                  <div v-for="habit in completedHabitsToday" :key="habit.id" class="completed-item">
                    <div class="completed-icon" :style="{ backgroundColor: habit.category?.color }">
                      {{ habit.category?.icon }}
                    </div>
                    <span class="completed-name">{{ habit.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "HabitList",
  data() {
    return {
      quote: "Kleine Schritte führen zu großen Erfolgen",
      habits: [],
      categories: [],
      selectedCategory: null,
      newHabit: {
        name: "",
        description: "",
        categoryId: ""
      },
      editingHabitId: null,
      editHabit: {
        name: "",
        description: "",
        categoryId: ""
      },
      checkedToday: [],
      calendarAttributes: [],
      completedHabitsToday: [],
      habitStreaks: {} // Neu für Streak-Daten
    };
  },

  computed: {
    filteredHabits() {
      if (this.selectedCategory === null) {
        return this.habits;
      }
      return this.habits.filter(habit => habit.category?.id === this.selectedCategory);
    }
  },

  mounted() {
    this.loadCategories();
    this.loadHabits();
    this.loadCalendarData();
    this.loadStreakData(); // Neu für Streaks
  },

  methods: {
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unbekannt';
    },

    loadCategories() {
      const API = "http://localhost:8080/api";
      fetch(`${API}/categories`)
          .then(response => response.json())
          .then(data => {
            this.categories = data;
          })
          .catch(error => {
            console.error("Fehler beim Laden der Kategorien:", error);
          });
    },

    getHabitsByCategory(categoryId) {
      return this.habits.filter(habit => habit.category?.id === categoryId);
    },

    loadCalendarData() {
      const API = "http://localhost:8080/api";
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
                  backgroundColor: check.habit?.category?.color || '#6366f1',
                  borderRadius: '50%'
                },
                popover: {
                  label: habitName
                }
              };
            });
          });
    },

    addHabit() {
      const API = "http://localhost:8080/api";
      if (!this.newHabit.name.trim() || !this.newHabit.description.trim() || !this.newHabit.categoryId) {
        alert("Bitte fülle alle Felder aus.");
        return;
      }

      const habitData = {
        name: this.newHabit.name,
        description: this.newHabit.description,
        category: { id: this.newHabit.categoryId }
      };

      fetch(`${API}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(habitData)
      })
          .then(response => {
            if (!response.ok) throw new Error("Fehler beim Erstellen des Habits");
            return response.json();
          })
          .then(data => {
            this.habits.push({
              ...data,
              progress: 50
            });
            this.newHabit = { name: "", description: "", categoryId: "" };
            this.loadStreakData(); // Streaks nach hinzufügen aktualisieren
          })
          .catch(error => {
            console.error("Fehler beim Erstellen der Habit:", error);
          });
    },

    startEdit(habit) {
      this.editingHabitId = habit.id;
      this.editHabit = {
        name: habit.name,
        description: habit.description,
        categoryId: habit.category?.id || ""
      };
    },

    saveEdit(id) {
      const habitData = {
        name: this.editHabit.name,
        description: this.editHabit.description,
        category: { id: this.editHabit.categoryId }
      };

      if (!habitData.name.trim() || !habitData.description.trim() || !habitData.category.id) {
        alert("Bitte fülle alle Felder aus.");
        return;
      }

      const API = "http://localhost:8080/api";
      fetch(`${API}/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(habitData)
      })
          .then(response => {
            if (!response.ok) throw new Error("Serverantwort war nicht OK");
            return response.json();
          })
          .then(updated => {
            const index = this.habits.findIndex(h => h.id === id);
            if (index !== -1) {
              this.habits[index] = {
                ...this.habits[index],
                ...updated,
                progress: this.habits[index].progress
              };
            }
            this.editingHabitId = null;
          })
          .catch(error => {
            console.error("Fehler beim Bearbeiten:", error);
          });
    },

    deleteHabit(id) {
      const API = "http://localhost:8080/api";
      fetch(`${API}/habits/${id}`, {
        method: "DELETE"
      })
          .then(() => {
            this.habits = this.habits.filter(habit => habit.id !== id);
            this.loadStreakData(); // Streaks nach löschen aktualisieren
          })
          .catch(error => {
            console.error("Fehler beim Löschen:", error);
          });
    },

    cancelEdit() {
      this.loadHabits();
      this.editingHabitId = null;
    },

    checkHabitToday(id) {
      const API = "http://localhost:8080/api";
      fetch(`${API}/habits/${id}/check`, {
        method: "POST"
      })
          .then(response => {
            if (response.status === 409) {
              alert("Heute bereits abgehakt!");
              return;
            }
            if (!response.ok) throw new Error("Fehler beim Abhaken");

            this.checkedToday.push(id);
            const habit = this.habits.find(h => h.id === id);

            if (habit) {
              if (!this.completedHabitsToday.find(h => h.id === habit.id)) {
                this.completedHabitsToday = [...this.completedHabitsToday, habit];
              }
              if (habit.progress < 100) {
                habit.progress = Math.min(habit.progress + 10, 100);
              }
            }

            // Streak-Daten nach dem Abhaken aktualisieren
            this.loadStreakData();
          })
          .catch(error => {
            console.error("Fehler beim Abhaken:", error);
          });
    },

    loadHabits() {
      const API = "http://localhost:8080/api";
      fetch(`${API}/habits`)
          .then(response => response.json())
          .then(data => {
            this.habits = data
                .filter(habit => habit.id && habit.id > 0)
                .map(habit => ({
                  ...habit,
                  progress: 50
                }));
            // Streak-Daten nach dem Laden der Habits aktualisieren
            this.loadStreakData();
          })
          .catch(error => {
            console.error("Fehler beim Laden der Habits:", error);
          });
    },

    // NEUE STREAK-METHODEN
    loadStreakData() {
      const API = "http://localhost:8080/api";
      fetch(`${API}/habits/streaks/all`)
          .then(response => response.json())
          .then(data => {
            this.habitStreaks = data;
          })
          .catch(error => {
            console.error("Fehler beim Laden der Streak-Daten:", error);
          });
    },

    getHabitStreak(habitId) {
      return this.habitStreaks[habitId] || {
        currentStreak: 0,
        bestStreak: 0,
        isCheckedToday: false
      };
    }
  }
};
</script>

<style scoped>
/* Main Layout */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #fae8ff 25%, #ede9fe 50%, #e0f2fe 75%, #f0fdfa 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 0 2rem;
  box-sizing: border-box;
}

.app-header {
  text-align: center;
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(147, 51, 234, 0.1);
  margin: 0 -2rem;
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1);
}

.app-title {
  font-size: 3rem;
  font-weight: 700;
  color: #7c3aed;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(124, 58, 237, 0.2);
}

.app-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
}

.main-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 2rem;
  padding: 2rem;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  height: fit-content;
  border: 1px solid rgba(147, 51, 234, 0.1);
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
}

.sidebar-title {
  color: #7c3aed;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(147, 51, 234, 0.1);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.15);
}

.category-item.active {
  background: rgba(147, 51, 234, 0.1);
  border-color: #a855f7;
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.2);
}

.category-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.all-icon {
  background: #a78bfa !important;
}

.category-icon {
  font-size: 1.25rem;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.category-info {
  flex: 1;
}

.category-name {
  display: block;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.category-count {
  color: #6b7280;
  font-size: 0.8rem;
  background: rgba(147, 51, 234, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  margin-top: 2px;
  display: inline-block;
}

/* Content Area */
.content-area {
  flex: 1;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  color: #374151;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.motivational-quote {
  color: #6b7280;
  font-style: italic;
  font-size: 1rem;
  margin: 0;
}

/* Cards */
.new-habit-card,
.calendar-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(147, 51, 234, 0.1);
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
}

.card-title {
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

/* Forms */
.habit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-input,
.form-select {
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 0.75rem;
  color: #374151;
  font-size: 0.95rem;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Habits Grid */
.habits-grid {
  display: grid;
  gap: 1.5rem;
}

.habit-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(147, 51, 234, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.08);
}

.habit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(147, 51, 234, 0.15);
  border-color: rgba(168, 85, 247, 0.3);
}

.habit-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.habit-category {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.habit-info {
  flex: 1;
}

.habit-name {
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.habit-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.habit-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.category-tag {
  background: rgba(147, 51, 234, 0.1);
  color: #7c3aed;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.streak-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.streak-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.streak-badge.current {
  background: rgba(249, 115, 22, 0.15);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.streak-badge.best {
  background: rgba(234, 179, 8, 0.15);
  color: #ca8a04;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.habit-status {
  flex-shrink: 0;
}

.status-completed {
  background: rgba(34, 197, 94, 0.15);
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* Progress */
.progress-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(147, 51, 234, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.progress-text {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 40px;
}

/* Actions */
.habit-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.check-btn {
  background: rgba(34, 197, 94, 0.15);
  color: #059669;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.check-btn:hover {
  background: rgba(34, 197, 94, 0.25);
  transform: translateY(-1px);
}

.edit-btn {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.25);
  transform: translateY(-1px);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-1px);
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input,
.edit-select {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 0.5rem;
  color: #374151;
}

.edit-input:focus,
.edit-select:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: #9ca3af;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

/* Calendar Section */
.calendar-card {
  height: fit-content;
}

.completed-today {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(147, 51, 234, 0.1);
}

.completed-title {
  color: #059669;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.completed-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.completed-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 0.75rem;
}

.completed-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.completed-name {
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .category-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .category-item {
    min-width: 200px;
  }
}
</style>