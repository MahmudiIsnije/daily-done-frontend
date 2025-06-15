import { mount } from '@vue/test-utils'
import HabitList from '@/components/HabitList.vue'

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([])
    })
)

describe('HabitList.vue', () => {
    beforeEach(() => {
        fetch.mockClear()
    })

    it('renders Daily Done app correctly', () => {
        const wrapper = mount(HabitList)
        expect(wrapper.find('.app-title').text()).toBe('Daily Done 🎯')
        expect(wrapper.find('.app-subtitle').text()).toBe('Erreiche deine Ziele, Schritt für Schritt')
        expect(wrapper.find('.sidebar-title').text()).toBe('Kategorien')
    })

    it('shows new habit form with all inputs', () => {
        const wrapper = mount(HabitList)
        expect(wrapper.find('.new-habit-card').exists()).toBe(true)
        expect(wrapper.find('input[placeholder="Habit Name"]').exists()).toBe(true)
        expect(wrapper.find('input[placeholder="Beschreibung"]').exists()).toBe(true)
        expect(wrapper.find('.form-select').exists()).toBe(true)
        expect(wrapper.find('.submit-btn').text()).toContain('Hinzufügen')
    })

    it('has correct initial data structure', () => {
        const wrapper = mount(HabitList)
        const vm = wrapper.vm

        expect(vm.habits).toEqual([])
        expect(vm.categories).toEqual([])
        expect(vm.selectedCategory).toBe(null)
        expect(vm.habitStreaks).toEqual({})
        expect(vm.newHabit).toEqual({
            name: "",
            description: "",
            categoryId: ""
        })
        expect(vm.checkedToday).toEqual([])
    })
})
