import dayjs from 'dayjs'

const generateId = () => crypto.randomUUID()

export const GOAL_ID = 'goal-ielts-7'
export const GOAL_ID_2 = 'goal-react-mastery'

export const mockGoals = [
  {
    id: GOAL_ID,
    name: 'IELTS 7.0',
    description: 'Achieve IELTS band 7.0 through consistent daily study and practice.',
    targetHours: 500,
    currentHours: 120,
    deadline: '2026-12-31',
    createdAt: dayjs().subtract(60, 'day').format('YYYY-MM-DD'),
  },
  {
    id: GOAL_ID_2,
    name: 'React Mastery',
    description: 'Build production-ready React apps and master modern frontend patterns.',
    targetHours: 300,
    currentHours: 85,
    deadline: '2026-09-30',
    createdAt: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  },
]

export const mockRoutines = [
  {
    id: 'routine-gym',
    activity: 'Gym',
    category: 'Health',
    plannedHours: 1,
    goalId: null,
    createdAt: dayjs().subtract(60, 'day').toISOString(),
  },
  {
    id: 'routine-ielts',
    activity: 'IELTS Listening',
    category: 'Study',
    plannedHours: 2,
    goalId: GOAL_ID,
    createdAt: dayjs().subtract(60, 'day').toISOString(),
  },
  {
    id: 'routine-react',
    activity: 'React Study',
    category: 'Study',
    plannedHours: 3,
    goalId: GOAL_ID_2,
    createdAt: dayjs().subtract(60, 'day').toISOString(),
  },
  {
    id: 'routine-reading',
    activity: 'Reading',
    category: 'Study',
    plannedHours: 1,
    goalId: GOAL_ID,
    createdAt: dayjs().subtract(60, 'day').toISOString(),
  },
]

const triggers = ['YouTube', 'Social Media', 'Fatigue', 'Procrastination', 'Gaming', 'Friends']
const activities = ['YouTube', 'Gaming', 'Sleeping', 'Facebook', 'Chatting']

export const generateMockLogs = () => {
  const logs = []

  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')

    mockRoutines.forEach((routine, idx) => {
      const isFailed = (i + idx) % 5 === 0
      const plannedHours = routine.plannedHours

      if (isFailed) {
        logs.push({
          id: generateId(),
          date,
          routineId: routine.id,
          status: 'failed',
          plannedHours,
          actualHours: 0,
          actualActivity: activities[(i + idx) % activities.length],
          trigger: triggers[(i + idx) % triggers.length],
          note: '',
        })
      } else {
        const variance = [0, 0.5, -0.5, 0][(i + idx) % 4]
        const actualHours = Math.max(0, plannedHours + variance)
        logs.push({
          id: generateId(),
          date,
          routineId: routine.id,
          status: 'completed',
          plannedHours,
          actualHours,
          actualActivity: null,
          trigger: null,
          note: '',
        })
      }
    })
  }

  return logs
}

export const mockData = {
  goals: mockGoals,
  routines: mockRoutines,
  logs: generateMockLogs(),
}
