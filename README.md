# Blinkered dictionary: Slovak

The Slovak word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](https://github.com/blinkered/blinkered-attestation). The rule,
the evidence format and the reasoning live there; what lives here is Slovak.

**138,362 of 287,672 candidates proved (48.1%)**, across 21 independent
families, 20 of which a stranger could check by fetching.

## What is in this repository

```
sources.mjs        which collections attest Slovak, and why those
attestations/      the evidence: every candidate, what saw it, and where
words.txt          what survived, in Blinkered's own format
dropped.tsv        what did not, and how close it came
searched.tsv       the publisher harvest: per page, which candidates it held and how often
SATURATION.md      what each family was worth, measured from the evidence
COLLECTIONS.md     every collection read, and where to get it again
status.json        the numbers, whether this ships, and what the list is under
```

The evidence is a **directory** rather than one file because this language's runs past the fifty
megabytes GitHub warns at. Each shard is a complete, independently valid evidence file with its
own header and digest; `readEvidence` puts them back together and refuses a repository that
somehow holds both layouts. Nothing reads them by globbing.

`.cache/` holds the downloaded collections and is not tracked. Everything here is regenerable
with `pnpm build`.

## Where the words come from

Candidates come from Blinkered's Slovak list, which lives in
[`blinkered-attestation/candidates/sk`](https://github.com/blinkered/blinkered-attestation/tree/main/candidates/sk).
The dictionaries that built it are demoted to **proposing words worth looking up**. What earns a
word its place here is evidence that it occurs in the world: three independent collections, each
recorded with a locator somebody else can fetch.

`SATURATION.md` says what each family was worth. `COLLECTIONS.md` names every collection read and
where to get it again, which is what makes the downloads disposable.

## What is particular to Slovak

**Czech is the neighbour, and it is kept out on purpose.** 7,643 of Slovak's 287,672 candidates
(2.7%) are also words in Czech's shipped list, nearly all of them ordinary shared vocabulary (ALE,
TAK, JEHO, AUTO). A Czech text would confirm every one of those, so every collection here is Slovak
by construction: the Slovak Wikipedia, Leipzig's Slovak news and `.sk` web, Slovak Tatoeba, a
Slovak New Testament, and sixteen publishers that write in Slovak.

The Internet Archive shelf was the one place Czech could get in, because its language metadata is
loose. Every book was screened by counting function words that differ between the two languages
(`sa`, `som`, `ktorý`, `keď` against `se`, `jsem`, `který`, `když`), and a book with more Czech
than Slovak was removed before the build. That took out 102 of 380 books, a good share of them Slovene
journals and English manuals rather than Czech; **21 of them would have passed the legibility floor**, among them volumes
of the *Časopis Moravského musea* and the *Archiv český*. The floor alone is not a guard against a
neighbour this close. The list of what was removed is `archive-sk/rejected.tsv` in the shared cache.

In the shipped list, 7,037 words (5.1%) are also in Czech's list, and the top of it reads as Slovak
(SOM, BOL, BYŤ, VŠAK are Slovak spellings). A handful of English words made it through on English
phrases quoted in Slovak text: THE, AND, FOR, THAT, FROM, ARE, NAME, ONLINE. They are real
attestations of candidates somebody proposed, and they are noted rather than removed.

**Where the ceiling is.** 48.1% is a large, heavily inflected list against small families.
Leipzig's only Slovak news package after 2016 is 100K sentences from 2020. Of the 55,415 words
that came within one family of surviving, 22,576 were seen only by Leipzig and the Wikipedia and
21,003 only by the Archive and the Wikipedia. A FineWeb-2 shard (Common Crawl, a family nothing
here belongs to) is what the cs repository used for that and is what this one most needs next; it
was not fetched because the shared disk never had the fifteen gigabytes free that a 4.8GB shard
requires. The Archive downloader was stopped at 380 books for time, with 1,848 available.

The harvest read 6,727 pages from sixteen Slovak publishers. `teraz.sk` (TASR's portal) and
`zive.sk` (Aktuality's) were left out as sibling domains of publishers already listed.
Every letter of the Slovak alphabet spells some shipped word; the rarest is Ĺ, in 244 words.

## Rebuilding

```
pnpm install
pnpm build        # reads whatever collections are in .cache/raw, reuses the record for the rest
pnpm conform      # the list says only what the evidence supports
pnpm saturation   # recomputes the curve and status.json
```

A collection that is not on disk is skipped with a warning and its recorded testimony is reused,
so a rebuild after more books arrive is short rather than a re-read of everything.

## Before this ships

Nobody has blessed this list. `status.json` says `"ships": "pending"`, which means built and
conforming but not yet checked against Blinkered's usability floor or looked at on a board.
`COMMON_CUT` in `sources.mjs` is carried over from Blinkered's old calibration against a
differently sized list and has to be re-measured before this list reaches the game.

## Licensing

Three kinds of thing live here and they do not share terms. The distinction is the project: a
licence that claimed more than we can support would undo the argument the evidence is here to
make. [NOTICE](NOTICE) is the authority; this is the summary.

| | terms | what |
| --- | --- | --- |
| **Code and docs** | [Apache-2.0](LICENSE) | `build.mjs`, `sources.mjs`, `harvest.mjs`, `conform.mjs`, `saturation.mjs`, and the Markdown |
| **The list and its evidence** | [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/) | `words.txt`, the evidence, `status.json`, `SATURATION.md`, `COLLECTIONS.md`, `searched.tsv` |
| **The words we could not prove** | `LGPL-2.1-or-later` | `dropped.tsv`, which is **not ours to license** |

**Why the list is CC0.** A word ships because three independent collections of text were found to
contain it. The record of which collections, and where in them, is a statement of fact about those
texts rather than a copy of them, and nothing a licence governs was taken from the dictionary that
proposed the candidates.

**Why `dropped.tsv` is not.** It is the candidates that failed, and a candidate that failed is a
word we have nothing to say about except that somebody's dictionary proposed it. That makes the
file a subset of that dictionary and it carries that dictionary's terms: here `LGPL-2.1-or-later`.
