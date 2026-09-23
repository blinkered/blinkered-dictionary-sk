/**
 * The collections that attest Slovak, and where each comes from.
 *
 * Slovak has a 287,672-word candidate list, thirteen times Czech's, most of it inflected forms
 * that only a large corpus ever sees. Expect the small families to be the ceiling.
 *
 * Czech is the neighbour to watch. The two languages share much of their vocabulary and a Czech
 * text would confirm every Slovak candidate that happens to be spelled the Czech way, so every
 * collection here is Slovak by construction: the Slovak Wikipedia, Leipzig's Slovak news and
 * `.sk` web, Slovak Tatoeba, a Slovak New Testament, and Archive books whose metadata says
 * Slovak and whose text agrees (see `archive-sk/rejected.tsv` for what was turned away).
 *
 * Every URL here was probed before it was written down. A collection that 404s does not fail
 * loudly; the build skips it with a warning and reports a healthy number over fewer families.
 */
import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import {
  fileDocuments,
  harvestDocuments,
  leipzigLocators,
  leipzigSentences,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'sk'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

/** A Leipzig package, with its sentence-to-URL index resolved up front. */
function leipzig(pkg) {
  const base = `${CACHE}${pkg}/${pkg}`
  const locators = leipzigLocators(
    readFileSync(`${base}-inv_so.txt`, 'utf8'),
    readFileSync(`${base}-sources.txt`, 'utf8'),
  )
  const lines = createInterface({
    input: createReadStream(`${base}-sentences.txt`),
    crlfDelay: Infinity,
  })
  return leipzigSentences(lines, locators)
}

// News and `.sk` web. Leipzig has no Slovak news package newer than 2020 and that one is 100K
// sentences, so the 2016 newscrawl and the 2016 web package carry the volume. The Leipzig
// Wikipedia packages are deliberately absent: they are Wikipedia text wearing a Leipzig label,
// so including one would corroborate `wiki:sk` while looking like another family.
const LEIPZIG = ['slk_news_2020_100K', 'slk_newscrawl_2016_1M', 'slk-sk_web_2016_1M']

const ALL = [
  {
    id: 'wiki:sk',
    what: 'Slovak Wikipedia; modern encyclopedic prose',
    needs: `${CACHE}skwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}skwiki.xml.bz2`),
  },
  {
    id: 'wikisource:sk',
    what: 'Slovak Wikisource; same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}skwikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}skwikisource.xml.bz2`),
  },
  ...LEIPZIG.map((pkg) => ({
    id: `lz:${pkg}`,
    from: `https://downloads.wortschatz-leipzig.de/corpora/${pkg}.tar.gz`,
    what: `Leipzig ${pkg}; news and web, cited by the page each sentence came from`,
    needs: `${CACHE}${pkg}`,
    documents: () => leipzig(pkg),
  })),
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/slk/slk_sentences.tsv.bz2',
    what: 'Tatoeba Slovak; contemporary and conversational',
    needs: `${CACHE}slk_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}slk_sentences.tsv`),
  },
  {
    id: 'ebible:slk',
    from: 'https://ebible.org/Scriptures/slk_vpl.zip',
    what: 'Biblica Nádej pre každého, a Slovak New Testament; a family nothing else here belongs to',
    needs: `${CACHE}ebible-slk/slk_vpl.txt`,
    documents: () => verseDocuments(`${CACHE}ebible-slk/slk_vpl.txt`),
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst Archive scans score 1%. Below this
    // floor a book is not legible enough to attest anything.
    legible: 0.35,
    what: 'Internet Archive Slovak books; literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-sk`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+%28language%3A%22Slovak%22+OR+language%3Aslo+OR+language%3Aslk%29',
    documents: () => {
      const dir = `${CACHE}archive-sk`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // Percent-encoded: two thirds of Archive filenames contain spaces, and the evidence
        // format spends spaces as separators.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (source.needs === undefined || existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Slovak publishers, for the harvest.
 *
 * Chosen because they publish in Slovak rather than because they are large. A harvester reads
 * whatever it fetches and has no idea what language it is in, and for Slovak the danger is
 * Czech: a Czech page would confirm every candidate the two languages spell alike. The last group
 * is literary and cultural, for a register the dailies never reach.
 */
export const DOMAINS = [
  'pravda.sk', 'aktuality.sk', 'hnonline.sk', 'stvr.sk', 'tasr.sk',
  'topky.sk', 'noviny.sk', 'sita.sk',
  'litcentrum.sk',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 17000
