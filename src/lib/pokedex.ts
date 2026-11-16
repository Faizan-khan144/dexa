const BASE = 'https://pokeapi.co/api/v2'
const ART = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
const SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
const INDEX_KEY = 'dexa:index:v1'
const TTL = 30 * 60 * 1000

export const artworkUrl = (id: number) => `${ART}/${id}.png`
export const spriteUrl = (id: number) => `${SPRITE}/${id}.png`

export const TYPE_META: Record<string, { a: string; b: string; ink: string }> = {
  normal: { a: '#a8a77a', b: '#c9c8a3', ink: '#14121a' },
  fire: { a: '#ee8130', b: '#ffb47d', ink: '#fffdf8' },
  water: { a: '#6390f0', b: '#9cbaf7', ink: '#fffdf8' },
  electric: { a: '#f7d02c', b: '#ffe27a', ink: '#14121a' },
  grass: { a: '#7ac74c', b: '#aee083', ink: '#14121a' },
  ice: { a: '#96d9d6', b: '#c6f0ee', ink: '#14121a' },
  fighting: { a: '#c22e28', b: '#e26763', ink: '#fffdf8' },
  poison: { a: '#a33ea1', b: '#c97ac8', ink: '#fffdf8' },
  ground: { a: '#e2bf65', b: '#f0dca0', ink: '#14121a' },
  flying: { a: '#a98ff3', b: '#c9b8f8', ink: '#14121a' },
  psychic: { a: '#f95587', b: '#ff9ab6', ink: '#fffdf8' },
  bug: { a: '#a6b91a', b: '#c8d85a', ink: '#14121a' },
  rock: { a: '#b6a136', b: '#d8c76e', ink: '#14121a' },
  ghost: { a: '#735797', b: '#9d85bd', ink: '#fffdf8' },
  dragon: { a: '#6f35fc', b: '#9d7bff', ink: '#fffdf8' },
  dark: { a: '#705746', b: '#9a8272', ink: '#fffdf8' },
  steel: { a: '#b7b7ce', b: '#d4d4e2', ink: '#14121a' },
  fairy: { a: '#d685ad', b: '#f0b3cc', ink: '#14121a' },
}

export const TYPE_ORDER = Object.keys(TYPE_META)

export const GENERATIONS = [
  { id: 1, label: 'I', region: 'Kanto', from: 1, to: 151 },
  { id: 2, label: 'II', region: 'Johto', from: 152, to: 251 },
  { id: 3, label: 'III', region: 'Hoenn', from: 252, to: 386 },
  { id: 4, label: 'IV', region: 'Sinnoh', from: 387, to: 493 },
  { id: 5, label: 'V', region: 'Unova', from: 494, to: 649 },
  { id: 6, label: 'VI', region: 'Kalos', from: 650, to: 721 },
  { id: 7, label: 'VII', region: 'Alola', from: 722, to: 809 },
  { id: 8, label: 'VIII', region: 'Galar', from: 810, to: 905 },
  { id: 9, label: 'IX', region: 'Paldea', from: 906, to: 1025 },
]

export type RarityTier = 'Mythical' | 'Legendary' | 'Rare' | 'Uncommon' | 'Common'

export const RARITY_META: Record<RarityTier, { a: string; b: string; ink: string; note: string }> = {
  Mythical: { a: '#7c3aed', b: '#e879f9', ink: '#fff', note: 'Event-only or mythical species' },
  Legendary: { a: '#b45309', b: '#fbbf24', ink: '#1b1206', note: 'Legendary species' },
  Rare: { a: '#1d4ed8', b: '#60a5fa', ink: '#fff', note: 'Hard to catch in the main games' },
  Uncommon: { a: '#0f766e', b: '#5eead4', ink: '#04211d', note: 'A little harder to find' },
  Common: { a: '#78716c', b: '#c7c3bb', ink: '#fff', note: 'Commonly encountered' },
}

export const MYTHICAL_IDS = new Set([
  151, 251, 385, 386, 489, 490, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809, 893, 1025,
])

export const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 480, 481, 482, 483, 484, 485,
  486, 487, 488, 491, 638, 639, 640, 641, 642, 643, 644, 645, 646, 716, 717, 718, 772, 773, 785, 786, 787, 788, 789,
  790, 791, 792, 800, 888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905, 1001, 1002, 1003, 1004, 1007, 1008,
  1014, 1015, 1016, 1020, 1021, 1022, 1023, 1024,
])

export function staticRarity(id: number): RarityTier | null {
  if (MYTHICAL_IDS.has(id)) return 'Mythical'
  if (LEGENDARY_IDS.has(id)) return 'Legendary'
  return null
}

export function rarityFromSpecies(species: Species): RarityTier {
  if (species.is_mythical) return 'Mythical'
  if (species.is_legendary) return 'Legendary'
  if (species.capture_rate <= 45) return 'Rare'
  if (species.capture_rate <= 120) return 'Uncommon'
  return 'Common'
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
}

export class DexError extends Error {
  status: number

  constructor(message: string, status = 0) {
    super(message)
    this.name = 'DexError'
    this.status = status
  }
}

export interface PokemonEntry {
  name: string
  id: number
}

export interface PokemonType {
  slot: number
  type: { name: string }
}

export interface PokemonStat {
  base_stat: number
  stat: { name: string }
}

export interface PokemonAbility {
  ability: { name: string }
  is_hidden: boolean
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  cries?: { latest?: string; legacy?: string }
  sprites: { other?: { 'official-artwork'?: { front_default?: string } } }
}

export interface Species {
  id: number
  name: string
  is_legendary: boolean
  is_mythical: boolean
  capture_rate: number
  base_happiness: number | null
  gender_rate: number
  habitat: { name: string } | null
  color: { name: string } | null
  generation: { name: string } | null
  growth_rate: { name: string } | null
  egg_groups: { name: string }[]
  evolution_chain: { url: string } | null
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  genera: { genus: string; language: { name: string } }[]
}

export interface EvolutionNode {
  species: { name: string; url: string }
  evolves_to: EvolutionNode[]
  evolution_details: {
    min_level: number | null
    trigger: { name: string }
    item: { name: string } | null
  }[]
}

export interface TypeInfo {
  pokemon: string[]
  doubleFrom: string[]
  halfFrom: string[]
  noneFrom: string[]
}

const cache = new Map<string, { at: number; value: unknown }>()

async function getJson<T>(url: string): Promise<T> {
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new DexError('The Pokédex is unreachable. Check your connection and try again.')
  }
  if (!res.ok) {
    if (res.status === 404) throw new DexError('That Pokémon is not in the dex.', 404)
    throw new DexError('The Pokédex API returned an error. Try again in a moment.', res.status)
  }
  return (await res.json()) as T
}

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL) return Promise.resolve(hit.value as T)
  return load().then((value) => {
    cache.set(key, { at: Date.now(), value })
    return value
  })
}

const idFromUrl = (url: string) => Number(url.replace(/\/$/, '').split('/').pop())

export async function getIndex(): Promise<PokemonEntry[]> {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { at: number; entries: PokemonEntry[] }
      if (Date.now() - parsed.at < 24 * 60 * 60 * 1000 && parsed.entries.length > 0) return parsed.entries
    }
  } catch {
    return loadIndex()
  }

  const entries = await loadIndex()
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify({ at: Date.now(), entries }))
  } catch {
    return entries
  }
  return entries
}

async function loadIndex(): Promise<PokemonEntry[]> {
  const data = await cached('index', () =>
    getJson<{ results: { name: string; url: string }[] }>(`${BASE}/pokemon?limit=1025`),
  )
  return data.results.map((entry) => ({ name: entry.name, id: idFromUrl(entry.url) }))
}

export function getPokemon(idOrName: number | string): Promise<PokemonDetail> {
  const key = String(idOrName).toLowerCase()
  return cached(`pokemon:${key}`, () => getJson<PokemonDetail>(`${BASE}/pokemon/${key}`))
}

export function getSpecies(id: number): Promise<Species> {
  return cached(`species:${id}`, () => getJson<Species>(`${BASE}/pokemon-species/${id}`))
}

export function getEvolution(url: string): Promise<EvolutionNode> {
  return cached(`evolution:${url}`, () => getJson<EvolutionNode>(url))
}

export function getType(name: string): Promise<TypeInfo> {
  return cached(`type:${name}`, async () => {
    const data = await getJson<{
      pokemon: { pokemon: { name: string } }[]
      damage_relations: {
        double_damage_from: { name: string }[]
        half_damage_from: { name: string }[]
        no_damage_from: { name: string }[]
      }
    }>(`${BASE}/type/${name}`)
    return {
      pokemon: data.pokemon.map((entry) => entry.pokemon.name),
      doubleFrom: data.damage_relations.double_damage_from.map((entry) => entry.name),
      halfFrom: data.damage_relations.half_damage_from.map((entry) => entry.name),
      noneFrom: data.damage_relations.no_damage_from.map((entry) => entry.name),
    }
  })
}

export async function getMany(ids: number[]): Promise<PokemonDetail[]> {
  return Promise.all(ids.map((id) => getPokemon(id)))
}

export function pickRandomIds(entries: PokemonEntry[], count: number): number[] {
  const picked = new Set<number>()
  while (picked.size < count && picked.size < entries.length) {
    picked.add(entries[Math.floor(Math.random() * entries.length)].id)
  }
  return [...picked]
}

export function formatName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatDexId(id: number): string {
  return `#${String(id).padStart(4, '0')}`
}

export function flavorText(species: Species): string {
  const entry =
    species.flavor_text_entries.find((item) => item.language.name === 'en') ?? species.flavor_text_entries[0]
  if (!entry) return ''
  return entry.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function genus(species: Species): string {
  return species.genera.find((item) => item.language.name === 'en')?.genus ?? ''
}

export function evolutions(node: EvolutionNode): { depth: number; id: number; name: string }[] {
  const rows: { depth: number; id: number; name: string }[] = []
  const walk = (current: EvolutionNode, depth: number) => {
    rows.push({ depth, id: idFromUrl(current.species.url), name: current.species.name })
    current.evolves_to.forEach((next) => walk(next, depth + 1))
  }
  walk(node, 0)
  return rows
}

export function typeMultipliers(types: TypeInfo[]): { name: string; multiplier: number }[] {
  const map = new Map<string, number>()
  types.forEach((type) => {
    type.doubleFrom.forEach((name) => map.set(name, (map.get(name) ?? 1) * 2))
    type.halfFrom.forEach((name) => map.set(name, (map.get(name) ?? 1) * 0.5))
    type.noneFrom.forEach((name) => map.set(name, 0))
  })
  return [...map.entries()]
    .map(([name, multiplier]) => ({ name, multiplier }))
    .filter((entry) => entry.multiplier !== 1)
    .sort((a, b) => b.multiplier - a.multiplier)
}
