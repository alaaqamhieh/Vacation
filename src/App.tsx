import { useEffect, useMemo, useRef, useState } from 'react'
import Hero from './components/Hero'
import StickyNav from './components/StickyNav'
import Itinerary, { type DragPayload } from './components/Itinerary'
import RestaurantGuide from './components/RestaurantGuide'
import ActivityLibrary from './components/ActivityLibrary'
import TripMap from './components/TripMap'
import Essentials from './components/Essentials'
import Packing from './components/Packing'
import AddToDayModal, { type AddTarget } from './components/AddToDayModal'
import CustomEventModal from './components/CustomEventModal'
import LibraryItemModal from './components/LibraryItemModal'
import SubscribeModal from './components/SubscribeModal'
import { ACTIVITIES, RESTAURANTS } from './data'
import { loadState, saveState } from './storage'
import { downloadICS } from './ics'
import { encodePlan, decodePlan, planFromLocation } from './sharePlan'
import { isSharingOn, fetchShared, pushShared, deviceId } from './sync'
import { burstConfetti, burstFromElement } from './confetti'
import type { Activity, MealSlot, Restaurant, ScheduledItem, TripState } from './types'
import { TRIP } from './config'

type ModalState =
  | { type: 'none' }
  | { type: 'addToDay'; target: AddTarget }
  | { type: 'customEvent' }
  | { type: 'editEvent'; item: ScheduledItem }
  | { type: 'libraryItem'; kind: 'activity' | 'restaurant' }
  | { type: 'subscribe' }

export default function App() {
  const [state, setState] = useState<TripState>(loadState)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => saveState(state), [state])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2800)
  }

  // --- Shared family sync (dormant unless SHARED_DB_URL is configured) ---
  const sharing = isSharingOn()
  const [synced, setSynced] = useState(false)
  // Version (updatedAt) of the last snapshot we pushed or adopted.
  const syncVersion = useRef(0)
  // The exact state object we last adopted from remote, so we don't echo it back.
  const adoptedState = useRef<TripState | null>(null)

  // On load: adopt the shared plan if it exists, else seed it with ours.
  useEffect(() => {
    if (!sharing) return
    let cancelled = false
    fetchShared().then((remote) => {
      if (cancelled) return
      if (remote) {
        const { _meta, ...rest } = remote
        syncVersion.current = _meta.updatedAt
        adoptedState.current = rest
        setState(rest)
        setSynced(true)
      } else {
        pushShared(state).then((ts) => {
          if (ts) {
            syncVersion.current = ts
            setSynced(true)
          }
        })
      }
    })
    return () => {
      cancelled = true
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Push local edits (debounced). Skip the object we just adopted from remote.
  useEffect(() => {
    if (!sharing || state === adoptedState.current) return
    const t = setTimeout(() => {
      pushShared(state).then((ts) => {
        if (ts) {
          syncVersion.current = ts
          setSynced(true)
        }
      })
    }, 1200)
    return () => clearTimeout(t)
  }, [state, sharing])

  // Poll for other people's edits.
  useEffect(() => {
    if (!sharing) return
    const id = setInterval(() => {
      fetchShared().then((remote) => {
        if (!remote) return
        if (remote._meta.updatedAt > syncVersion.current && remote._meta.deviceId !== deviceId()) {
          const { _meta, ...rest } = remote
          syncVersion.current = _meta.updatedAt
          adoptedState.current = rest
          setState(rest)
        }
      })
    }, 10000)
    return () => clearInterval(id)
  }, [sharing])

  // Load a plan shared via #plan=... link (from the "Share plan" button).
  useEffect(() => {
    const encoded = planFromLocation()
    if (!encoded) return
    decodePlan(encoded).then((plan) => {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      if (!plan) return
      if (window.confirm('Load the shared plan from this link? It replaces the plan saved on this device.')) {
        setState((s) => ({
          ...s,
          scheduled: plan.scheduled,
          customActivities: plan.customActivities,
          customRestaurants: plan.customRestaurants,
        }))
      }
    })
  }, [])

  const sharePlan = async () => {
    const encoded = await encodePlan(state)
    const url = `${window.location.origin}${window.location.pathname}#plan=${encoded}`
    try {
      if (navigator.share) {
        await navigator.share({ title: TRIP.title, url })
        return
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast('🔗 Link copied — paste it in the family chat!')
    } catch {
      window.prompt('Copy this link and share it:', url)
    }
  }

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
    const next: Record<MealSlot, MealSlot> = { breakfast: 'lunch', lunch: 'dinner', dinner: 'breakfast' }
    setState((s) => ({
      ...s,
      scheduled: s.scheduled.map((it) => (it.id === id && it.meal ? { ...it, meal: next[it.meal] } : it)),
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
      <span id="top" />
      <StickyNav theme={state.theme} onToggleTheme={cycleTheme} sharing={sharing} synced={synced} />
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
        onOpenCalendar={() => setModal({ type: 'subscribe' })}
        onSharePlan={sharePlan}
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

      <TripMap activities={activities} restaurants={restaurants} />

      <Essentials />
      <Packing packed={state.packed} onToggle={handleTogglePacked} />

      <footer>
        Made with ❤️ for {TRIP.couple}'s wedding · {TRIP.destination} · Hosted by {TRIP.travelers}
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}

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
      {modal.type === 'subscribe' && (
        <SubscribeModal
          onClose={() => setModal({ type: 'none' })}
          onDownload={() => downloadICS(state.scheduled, { activities, restaurants })}
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
