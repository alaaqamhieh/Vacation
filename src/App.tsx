import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import Itinerary, { type DragPayload } from './components/Itinerary'
import RestaurantGuide from './components/RestaurantGuide'
import ActivityLibrary from './components/ActivityLibrary'
import Essentials from './components/Essentials'
import Packing from './components/Packing'
import AddToDayModal, { type AddTarget } from './components/AddToDayModal'
import CustomEventModal from './components/CustomEventModal'
import LibraryItemModal from './components/LibraryItemModal'
import { ACTIVITIES, RESTAURANTS } from './data'
import { loadState, saveState } from './storage'
import { downloadICS } from './ics'
import { burstConfetti, burstFromElement } from './confetti'
import type { Activity, MealSlot, Restaurant, ScheduledItem, TripState } from './types'
import { TRIP } from './config'

type ModalState =
  | { type: 'none' }
  | { type: 'addToDay'; target: AddTarget }
  | { type: 'customEvent' }
  | { type: 'editEvent'; item: ScheduledItem }
  | { type: 'libraryItem'; kind: 'activity' | 'restaurant' }

export default function App() {
  const [state, setState] = useState<TripState>(loadState)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  useEffect(() => saveState(state), [state])

  // Theme: 'auto' follows the system; explicit choice wins.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = state.theme === 'dark' || (state.theme === 'auto' && mq.matches)
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [state.theme])

  const activities: Activity[] = useMemo(() => [...ACTIVITIES, ...state.customActivities], [state.customActivities])
  const restaurants: Restaurant[] = useMemo(() => [...RESTAURANTS, ...state.customRestaurants], [state.customRestaurants])
  const scheduledIds = useMemo(() => new Set(state.scheduled.map((s) => s.refId).filter((x): x is string => !!x)), [state.scheduled])

  const celebrate = () => {
    burstConfetti(window.innerWidth / 2, window.innerHeight * 0.35)
  }

  const addScheduled = (item: ScheduledItem) => {
    setState((s) => ({ ...s, scheduled: [...s.scheduled, item] }))
    setLastAddedId(item.id)
    celebrate()
  }

  const handleDropPayload = (payload: DragPayload, date: string) => {
    if (payload.type === 'move') {
      setState((s) => ({
        ...s,
        scheduled: s.scheduled.map((it) => (it.id === payload.id ? { ...it, date } : it)),
      }))
      setLastAddedId(payload.id)
      return
    }
    addScheduled({
      id: `sch-${Date.now()}`,
      date,
      kind: payload.kind,
      refId: payload.refId,
      meal: payload.kind === 'restaurant' ? 'dinner' : undefined,
    })
  }

  const handleRemove = (item: ScheduledItem) => {
    if (item.milestone) {
      const title = item.title ?? 'this event'
      if (!window.confirm(`"${title}" is one of the big ones — really remove it from the plan?`)) return
    }
    setState((s) => ({ ...s, scheduled: s.scheduled.filter((it) => it.id !== item.id) }))
  }

  const handleToggleMeal = (id: string) => {
    setState((s) => ({
      ...s,
      scheduled: s.scheduled.map((it) =>
        it.id === id ? { ...it, meal: (it.meal === 'lunch' ? 'dinner' : 'lunch') as MealSlot } : it,
      ),
    }))
  }

  const handleToggleShortlist = (id: string) => {
    setState((s) => ({
      ...s,
      shortlist: s.shortlist.includes(id) ? s.shortlist.filter((x) => x !== id) : [...s.shortlist, id],
    }))
  }

  const handleToggleVisited = (id: string, el: Element | null) => {
    setState((s) => {
      const adding = !s.visited.includes(id)
      if (adding) burstFromElement(el)
      return { ...s, visited: adding ? [...s.visited, id] : s.visited.filter((x) => x !== id) }
    })
  }

  const handleTogglePacked = (id: string) => {
    setState((s) => ({
      ...s,
      packed: s.packed.includes(id) ? s.packed.filter((x) => x !== id) : [...s.packed, id],
    }))
  }

  const cycleTheme = () => {
    setState((s) => ({
      ...s,
      theme: s.theme === 'auto' ? 'dark' : s.theme === 'dark' ? 'light' : 'auto',
    }))
  }

  return (
    <>
      <Hero theme={state.theme} onToggleTheme={cycleTheme} />

      <Itinerary
        scheduled={state.scheduled}
        activities={activities}
        restaurants={restaurants}
        lastAddedId={lastAddedId}
        onDropPayload={handleDropPayload}
        onEdit={(item) => setModal({ type: 'editEvent', item })}
        onRemove={handleRemove}
        onToggleMeal={handleToggleMeal}
        onExport={() => downloadICS(state.scheduled, { activities, restaurants })}
        onAddEvent={() => setModal({ type: 'customEvent' })}
      />

      <RestaurantGuide
        restaurants={restaurants}
        shortlist={state.shortlist}
        visited={state.visited}
        scheduledIds={scheduledIds}
        onToggleShortlist={handleToggleShortlist}
        onToggleVisited={handleToggleVisited}
        onPlan={(target) => setModal({ type: 'addToDay', target })}
        onAddCustom={() => setModal({ type: 'libraryItem', kind: 'restaurant' })}
        onDeleteCustom={(id) =>
          setState((s) => ({
            ...s,
            customRestaurants: s.customRestaurants.filter((r) => r.id !== id),
            scheduled: s.scheduled.filter((it) => it.refId !== id),
          }))
        }
      />

      <ActivityLibrary
        activities={activities}
        scheduledIds={scheduledIds}
        onPlan={(target) => setModal({ type: 'addToDay', target })}
        onAddCustom={() => setModal({ type: 'libraryItem', kind: 'activity' })}
        onDeleteCustom={(id) =>
          setState((s) => ({
            ...s,
            customActivities: s.customActivities.filter((a) => a.id !== id),
            scheduled: s.scheduled.filter((it) => it.refId !== id),
          }))
        }
      />

      <Essentials />
      <Packing packed={state.packed} onToggle={handleTogglePacked} />

      <footer>
        Made with ❤️ for {TRIP.travelers} · {TRIP.destination} · Everything lives in this browser — no accounts, no
        tracking, just us.
      </footer>

      {modal.type === 'addToDay' && (
        <AddToDayModal
          target={modal.target}
          onClose={() => setModal({ type: 'none' })}
          onAdd={(date, meal) => {
            addScheduled({
              id: `sch-${Date.now()}`,
              date,
              kind: modal.target.kind,
              refId: modal.target.refId,
              meal,
            })
            setModal({ type: 'none' })
          }}
        />
      )}
      {modal.type === 'customEvent' && (
        <CustomEventModal
          onClose={() => setModal({ type: 'none' })}
          onSave={(item) => {
            addScheduled(item)
            setModal({ type: 'none' })
          }}
        />
      )}
      {modal.type === 'editEvent' && (
        <CustomEventModal
          initial={modal.item}
          displayTitle={
            modal.item.kind === 'restaurant'
              ? restaurants.find((r) => r.id === modal.item.refId)?.name
              : activities.find((a) => a.id === modal.item.refId)?.title
          }
          onClose={() => setModal({ type: 'none' })}
          onSave={(item) => {
            setState((s) => ({ ...s, scheduled: s.scheduled.map((it) => (it.id === item.id ? item : it)) }))
            setModal({ type: 'none' })
          }}
        />
      )}
      {modal.type === 'libraryItem' && (
        <LibraryItemModal
          kind={modal.kind}
          onClose={() => setModal({ type: 'none' })}
          onSaveActivity={(a) => {
            setState((s) => ({ ...s, customActivities: [...s.customActivities, a] }))
            setModal({ type: 'none' })
          }}
          onSaveRestaurant={(r) => {
            setState((s) => ({ ...s, customRestaurants: [...s.customRestaurants, r] }))
            setModal({ type: 'none' })
          }}
        />
      )}
    </>
  )
}
