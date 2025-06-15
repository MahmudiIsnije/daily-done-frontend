import { mount } from '@vue/test-utils'
import HabitList from '@/components/HabitList.vue'

// Mock für fetch
global.fetch = jest.fn()

// Mock für v-calendar
jest.mock('v-calendar', () => ({
    Calendar: {
        name: 'Calendar',
        template: '<div>Mocked Calendar</div>'
    }
}))

describe('HabitList.vue - Erweiterte Tests', () => {
    let wrapper

    beforeEach(() => {
        fetch.mockClear()

        // Standard Mock-Responses
        fetch
            .mockResolvedValueOnce({
                json: () => Promise.resolve([
                    { id: 1, name: 'Gesundheit', icon: '💪', color: '#10B981' },
                    { id: 2, name: 'Produktivität', icon: '🧠', color: '#3B82F6' }
                ])
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve([
                    {
                        id: 1,
                        name: 'Wasser trinken',
                        description: 'Trinke 2 Liter Wasser täglich',
                        category: { id: 1, name: 'Gesundheit', icon: '💪', color: '#10B981' }
                    }
                ])
            })
            .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
            .mockResolvedValueOnce({ json: () => Promise.resolve({}) })

        wrapper = mount(HabitList)
    })

    afterEach(() => {
        wrapper.unmount()
    })

    describe('Grundlegende Komponenten-Tests', () => {
        it('rendert die App-Struktur korrekt', () => {
            expect(wrapper.find('.app-container').exists()).toBe(true)
            expect(wrapper.find('.app-header').exists()).toBe(true)
            expect(wrapper.find('.main-layout').exists()).toBe(true)
            expect(wrapper.find('.sidebar').exists()).toBe(true)
            expect(wrapper.find('.content-area').exists()).toBe(true)
        })

        it('zeigt den korrekten App-Titel und Untertitel', () => {
            expect(wrapper.find('.app-title').text()).toBe('Daily Done 🎯')
            expect(wrapper.find('.app-subtitle').text()).toBe('Erreiche deine Ziele, Schritt für Schritt')
        })

        it('hat die richtige Seitenleisten-Struktur', () => {
            expect(wrapper.find('.sidebar-title').text()).toBe('Kategorien')
            expect(wrapper.find('.category-list').exists()).toBe(true)
        })

        it('zeigt das neue Habit-Formular', () => {
            expect(wrapper.find('.new-habit-card').exists()).toBe(true)
            expect(wrapper.find('.habit-form').exists()).toBe(true)
        })
    })

    describe('Formular-Tests', () => {
        it('hat alle erforderlichen Eingabefelder', () => {
            const nameInput = wrapper.find('input[placeholder="Habit Name"]')
            const descInput = wrapper.find('input[placeholder="Beschreibung"]')
            const categorySelect = wrapper.find('.form-select')
            const submitBtn = wrapper.find('.submit-btn')

            expect(nameInput.exists()).toBe(true)
            expect(descInput.exists()).toBe(true)
            expect(categorySelect.exists()).toBe(true)
            expect(submitBtn.exists()).toBe(true)
        })

        it('aktualisiert die Datenmodelle bei Eingabe', async () => {
            const nameInput = wrapper.find('input[placeholder="Habit Name"]')
            const descInput = wrapper.find('input[placeholder="Beschreibung"]')

            await nameInput.setValue('Test Habit')
            await descInput.setValue('Test Beschreibung')

            expect(wrapper.vm.newHabit.name).toBe('Test Habit')
            expect(wrapper.vm.newHabit.description).toBe('Test Beschreibung')
        })
    })

    describe('Daten-Management Tests', () => {
        it('hat korrekte Anfangsdaten', () => {
            expect(wrapper.vm.habits).toEqual([])
            expect(wrapper.vm.categories).toEqual([])
            expect(wrapper.vm.selectedCategory).toBe(null)
            expect(wrapper.vm.checkedToday).toEqual([])
            expect(wrapper.vm.habitStreaks).toEqual({})
        })

        it('lädt Kategorien beim Mount', () => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/categories')
        })

        it('lädt Habits beim Mount', () => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/habits')
        })
    })
})