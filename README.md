# daily-done-frontend

Eine moderne Vue.js 3 Single-Page-Application für 
Habit Tracking mit ansprechendem UI und Kalender-Integration.

## Live Demo

Production: https://daily-done-frontend.onrender.com

## Übersicht

Daily-Done Frontend ist eine intuitive Web-Anwendung zur 
Verwaltung und Verfolgung täglicher Gewohnheiten. Mit einem modernen, 
responsiven Design hilft sie Nutzern dabei, positive Routinen zu entwickeln und beizubehalten.

### Features

- Habit Management - Erstellen, Bearbeiten und Löschen von Gewohnheiten
- Kategorisierung - Organisierung in 6 vordefinierte Kategorien
- Streak-Tracking - Verfolgung von aktuellen und besten Serien
- Kalender-Integration - Monatsübersicht mit v-calendar
- Fortschrittsanzeige - Visuelle Darstellung des Habit-Fortschritts
- Responsive Design - Optimiert für Desktop und Mobile
- Moderne Animationen - Smooth Transitions und Hover-Effekte
- Real-time Updates - Sofortige UI-Aktualisierungen

## Technologie-Stack

- Framework: Vue.js 3.2.13
- Build Tool: Vue CLI 5.0
- Routing: Vue Router 4.0
- Kalender: v-calendar 3.1.2
- Styling: Vanilla CSS3 mit modernen Features
- Testing: Jest + Vue Test Utils
- CI/CD: GitHub Actions

---

## Installation und Setup
Voraussetzungen

- Node.js 16+
- npm oder yarn
- Git


### 1. Repository klonen
git clone: https://github.com/MahmudiIsnije/daily-done-frontend.git

### 2. Dependencies installieren (npm install)
npm install

### 3. Environment Variables einrichten
VUE_APP_API_URL=http://localhost:8080/api

### 4. Development Server starten
npm run serve

Die App läuft auf: http://localhost:3000

## Build & Deployment

### Production Build
npm run build

### Tests ausführen
npm run test:unit

---

## API Integration
Das Frontend kommuniziert mit dem Spring Boot Backend über REST API:

### Endpoints
- GET /api/habits - Alle Habits abrufen
- POST /api/habits - Neues Habit erstellen
- PUT /api/habits/{id} - Habit aktualisieren
- DELETE /api/habits/{id} - Habit löschen
- POST /api/habits/{id}/check - Habit abhaken
- GET /api/categories - Kategorien laden
- GET /api/habits/streaks/all - Streak-Daten

---

# Autor 
Isnije Mahmudi