import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, RotateCcw, Sparkles, Trophy, X } from 'lucide-react'
import TypeBadge from '../components/TypeBadge'
import {
  artworkUrl,
  formatDexId,
  formatName,
  getIndex,
  getPokemon,
  type PokemonDetail,
  type PokemonEntry,
} from '../lib/pokedex'

interface Question {
  id: number
  name: string
  options: string[]
}

const pickOne = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

const buildQuestion = (index: PokemonEntry[]): Question | null => {
  if (index.length < 4) return null
  const target = pickOne(index)
  const options = new Set<string>([target.name])
  while (options.size < 4) options.add(pickOne(index).name)
  const shuffled = [...options]
  for (let position = shuffled.length - 1; position > 0; position -= 1) {
    const swap = Math.floor(Math.random() * (position + 1))
    ;[shuffled[position], shuffled[swap]] = [shuffled[swap], shuffled[position]]
  }
  return { id: target.id, name: target.name, options: shuffled }
}

const BEST_KEY = 'dexa:quiz-best'

const saveBest = (value: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(value))
  } catch {
    return
  }
}

export default function Quiz() {
  const [index, setIndex] = useState<PokemonEntry[]>([])
  const [question, setQuestion] = useState<Question | null>(null)
  const [detail, setDetail] = useState<PokemonDetail | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)
  const [round, setRound] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Quiz · Dexa'
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0)
    } catch {
      setBest(0)
    }
    let alive = true
    getIndex()
      .then((entries) => {
        if (!alive) return
        setIndex(entries)
        setQuestion(buildQuestion(entries))
      })
      .catch(() => {
        if (alive) setError('The quiz could not load the dex index.')
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!question) return
    let alive = true
    setDetail(null)
    getPokemon(question.id)
      .then((value) => {
        if (alive) setDetail(value)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [question])

  const choose = (name: string) => {
    if (!question || answer) return
    setAnswer(name)
    if (name === question.name) {
      setScore((value) => value + 1)
      const nextStreak = streak + 1
      setStreak(nextStreak)
      if (nextStreak > best) {
        setBest(nextStreak)
        saveBest(nextStreak)
      }
    } else {
      setStreak(0)
    }
  }

  const next = () => {
    if (index.length === 0) return
    setQuestion(buildQuestion(index))
    setAnswer(null)
    setRound((value) => value + 1)
  }

  const restart = () => {
    setScore(0)
    setStreak(0)
    setRound(1)
    setAnswer(null)
    if (index.length > 0) setQuestion(buildQuestion(index))
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!question) return
      if (!answer && ['1', '2', '3', '4'].includes(event.key)) {
        choose(question.options[Number(event.key) - 1])
      }
      if (answer && event.key === 'Enter') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const correct = Boolean(answer && question && answer === question.name)

  return (
    <div className="pop-in wrap py-9">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="kicker">Silhouette quiz</div>
          <h1 className="mt-3 max-w-3xl font-display text-[2.7rem] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[3.7rem]">
            Name that <span className="text-gradient">silhouette.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Four options, one shadow. Press 1–4 to answer, Enter for the next round.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'score', value: score },
            { label: 'streak', value: streak },
            { label: 'best', value: best },
          ].map((stat) => (
            <div key={stat.label} className="card px-3 py-2 text-center">
              <div className="font-display text-xl font-extrabold tracking-tight">{stat.value}</div>
              <div className="mono text-faint">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-[13px] text-accent">{error}</p>
      )}

      <div className="mt-7 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden p-6">
          <span className="pokeball-ring pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <span className="absolute left-4 top-4 mono text-faint">round {round}</span>
          <span className="absolute right-4 top-4 mono text-faint">{question ? formatDexId(question.id) : '—'}</span>

          {question ? (
            <img
              key={question.id}
              src={artworkUrl(question.id)}
              alt="Mystery Pokémon silhouette"
              className={`relative h-[240px] w-[240px] object-contain transition-all duration-700 ${
                answer ? 'scale-105' : 'brightness-0 contrast-125 drop-shadow-[0_22px_22px_rgba(24,13,16,0.3)]'
              }`}
            />
          ) : (
            <div className="skeleton h-56 w-56 rounded-full" />
          )}

          {answer && question && (
            <div className="panel-swap relative mt-3 text-center">
              <div className="font-display text-2xl font-extrabold tracking-tight">{formatName(question.name)}</div>
              <div className="mt-1.5 flex justify-center gap-1.5">
                {detail?.types.map((entry) => (
                  <TypeBadge key={entry.type.name} type={entry.type.name} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {(question?.options ?? ['', '', '', '']).map((option, position) => {
            const chosen = answer === option
            const isCorrect = question ? option === question.name : false
            const revealed = Boolean(answer)
            return (
              <button
                key={`${option}-${position}`}
                type="button"
                onClick={() => choose(option)}
                disabled={!question || Boolean(answer)}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all ${
                  revealed && isCorrect
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : chosen
                      ? 'border-accent/60 bg-accent/10'
                      : 'border-line bg-surface hover:-translate-y-0.5 hover:border-accent/40'
                } ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ animationDelay: `${position * 50}ms` }}
              >
                <span className="mono w-4 text-faint">{position + 1}</span>
                <span className="flex-1 font-display text-[15px] font-bold tracking-tight">
                  {option ? formatName(option) : '—'}
                </span>
                {revealed && isCorrect && <Check className="h-4 w-4 text-emerald-600" />}
                {revealed && chosen && !isCorrect && <X className="h-4 w-4 text-accent" />}
              </button>
            )
          })}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {answer ? (
              <button type="button" onClick={next} className="btn-ink">
                Next round <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="mono text-faint">Pick one to reveal the species</span>
            )}
            <button type="button" onClick={restart} className="btn-quiet">
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </button>
            {answer && question && (
              <Link to={`/pokemon/${question.id}`} className="btn-quiet">
                Dossier
              </Link>
            )}
          </div>

          {answer && (
            <div
              className={`panel-swap mt-1 rounded-xl border px-4 py-3 text-[13px] ${
                correct ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-800' : 'border-accent/30 bg-accent/5 text-accent'
              }`}
            >
              <span className="inline-flex items-center gap-2 font-semibold">
                {correct ? <Trophy className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {correct ? 'Correct — streak intact.' : `Close. That was ${formatName(question?.name ?? '')}.`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
