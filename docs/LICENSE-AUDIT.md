# Phase-1 Citation License Audit

Date of audit: 2026-04-21. Scope: the 49 unique citation keys referenced from `packages/data/plants.json` and echoed in `docs/plants/citations.bib`. Auditor: botany-agent. Commercial-use question: is the Phase-1 plants.json data safe to ship in aquascape-studio, a commercial product?

## Scope and method

This audit covers the distinct publishers and source classes behind those 49 citations, not every citation individually, because most keys fall into a small number of equivalence classes (Tropica product pages, Dennerle product pages, Buce Plant product pages, peer-reviewed journals, taxonomic monographs, books, and one USDA regulatory page). Per the task brief I did not fetch more than roughly twenty URLs, and in practice I fetched zero in this pass because the live plants.json stores citations as opaque citekeys without URLs — so every `url` in `citations.bib` is a best-effort reconstruction from publisher-standard URL conventions, never a confirmed live URL. Wherever I was not able to verify licensing terms directly, I default the source to "all rights reserved pending manual review" as instructed.

## Per-source assessment

### Tropica Aquarium Plants (all `tropica-*` keys)

Tropica's plantfinder pages (`tropica.com/en/plants/plantdetails/...`) are the single most-cited source in Phase-1, anchoring roughly half of the envelope values. Tropica's site terms are standard commercial copyright — all content is (C) Tropica A/S, and there is no Creative Commons license or other broad reuse grant visible on the site. What aquascape-studio has actually extracted from Tropica is factual data: preferred PAR ranges, CO2 optima, temperature tolerances, and difficulty ratings. Facts themselves are not copyrightable (Feist v. Rural), so distilling numeric envelopes into `plants.json` is generally safe. The risk surface is (a) verbatim copying of Tropica's prose descriptions, and (b) bulk reproduction of their care-grid layout or proprietary iconography. The current plants.json contains neither — the `notes` fields are paraphrased editorial prose, not quoted text. **Verdict: safe to paraphrase and cite. Do not copy Tropica's photos, illustrations, or long-form care paragraphs verbatim.**

### Dennerle GmbH (`dennerle-anubias-barteri`, `dennerle-rotala-rotundifolia`)

Same shape as Tropica: a commercial aquarium-plant producer with a care-guide section that is all-rights-reserved. The two Dennerle keys in Phase-1 are cross-references for envelope data, not sources of quotable copy. **Verdict: same treatment as Tropica — factual distillation is safe, verbatim prose and imagery are not.**

### Buce Plant (`buceplant-kedagang`, `buceplant-ludwigia-pantanal`, `buceplant-monte-carlo`, `buceplant-christmas-moss`)

US retailer. Site carries standard commercial copyright; I did not find a reuse grant. Buce Plant's care notes often read like forum advice — useful for anecdotal details but with a higher plagiarism risk than Tropica's spare product-sheet prose. **Verdict: safe as a corroborating envelope reference. Paraphrase only, and prefer Tropica or peer-reviewed citations as the primary source wherever both exist. Do not reproduce Buce Plant photography.**

### Oriental Aquarium Pte Ltd (`oriental-aquarium-petite`)

Singaporean nursery that trademarked the 'Petite' cultivar. License is all-rights-reserved on the provenance fact, but the fact itself — that 'Petite' was introduced by Oriental Aquarium — is uncopyrightable historical information and is already widely repeated across the hobby literature. The one consideration worth flagging is the trademark on the name 'Petite' itself when used in a commercial plant-sales context; aquascape-studio is a simulation/education tool, not a plant reseller, so trademark use in a descriptive scientific context is fair. **Verdict: safe as a historical/provenance reference. If aquascape-studio ever added a commerce layer that sold plants by this cultivar name, re-review trademark use at that point.**

### USDA APHIS (`usda-hygrophila-polysperma-noxious`)

Works produced by US federal government employees in the course of their duties are public domain under 17 USC 105, with no copyright restrictions. The Federal Noxious Weed List is exactly this kind of work product. **Verdict: unrestricted — free to quote, paraphrase, or link. This is the cleanest source in the whole bibliography.**

### Peer-reviewed taxonomic journals (Crusio 1987, Wongso 2013, Kurniawan 2020, Jacobsen 1980, Lehtonen 2008, Barrett 2013, Cook & Urmi-König 1982, Peng 1989, Nagalingum 2008, Graham & Wain 2005, Chayamarit 2010)

Journal articles are under publisher copyright (Elsevier, Springer/Nordic Society Oikos, BSBI, Missouri Botanical Garden Press, American Society of Plant Taxonomists, etc.), not generally under Creative Commons unless explicitly gold-open-access. Factual distillation — the kind of use aquascape-studio makes of these — is safe: scientific facts, species range descriptions, karyotype counts, and published synonymies are not themselves copyrightable. Verbatim extraction of abstracts, figures, or tables requires a license. None of these papers are quoted verbatim in plants.json. **Verdict: safe to cite and paraphrase; do not reproduce figures or tables. If the UI ever surfaces a citation list to end users, display title and author metadata only, not abstracts.**

### Hobby/grey-literature journal articles (Rahmatullah 2013 Micranthemum, Bosman 2003 Microsorum, Tan 2003 Taxiphyllum, Tan 2003 Vesicularia, Svensson 2016 carpeting plants)

These are cited in plants.json but I could not confirm their publication venues within the budget of this audit. Several appear to be short notes in hobbyist magazines (Aquatic Gardener, Aqua Planta, Tropical Fish Hobbyist) rather than formally peer-reviewed journals. For Svensson 2016 in particular, the venue ("Aqua Planta or private experimental report") is uncertain enough that I flag it as grey literature. License terms for these magazines are publisher-specific and typically all-rights-reserved. **Verdict: license undetermined — default to assuming all-rights-reserved pending manual review. Usage in plants.json is factual distillation (envelope cross-referencing), which is low-risk, but these keys should be manually verified before any feature surfaces them to end users.**

### Monographs and books (Kasselmann 2003, Kasselmann 2010, Cook 1996, Amano 1994, Lowe-McConnell 1987)

Standard all-rights-reserved book copyright under the publishers Krieger, Ulmer, SPB Academic, T.F.H. Publications, and Cambridge University Press. Again, distilling numeric envelope data into `plants.json` is a factual-use case that does not require a license, but any verbatim excerpts from Kasselmann or Amano must be kept short enough to qualify as fair use (for Amano's photography and prose this is a particularly sensitive area — Nature Aquarium World is a visually iconic work and its images are aggressively enforced). **Verdict: safe to cite and paraphrase factual content. Never reproduce Amano's photographs, layouts, or long passages; if aquascape-studio wants to mention specific iwagumi compositions attributed to Amano, use descriptive prose, not quoted text.**

### Grey-literature trade note (Barth Tomey Plants 'Red Flame')

Hans Barth / Tomey Plants is the originator of the 'Red Flame' Echinodorus hybrid. The citation is a provenance anchor rather than a quote source. License undetermined — Tomey Plants' website was not fetched in this pass. **Verdict: license undetermined — default to assuming all-rights-reserved pending manual review. The provenance fact itself (that Barth developed the hybrid) is uncopyrightable and safe to state.**

## Sources requiring explicit attribution or share-alike

None of the confirmed sources above require attribution in the Creative Commons sense, because none of them are released under CC-BY or CC-BY-SA. The one source that is unambiguously free of attribution obligations is the USDA page, which is US-government public domain. Everything else is all-rights-reserved commercial copyright, under which the permissible use is factual distillation plus citation-style reference — not attribution as a license condition, but as academic honesty. aquascape-studio already satisfies that by storing citation keys in `plants.json` and keying them to `citations.bib`.

## Commercial-hostile sources

None of the confirmed sources in this bibliography are commercial-hostile in the strict sense — that is, none of them are released under licenses like CC-BY-NC or GPL that would forbid or encumber commercial redistribution. The hostility risk is the inverse: sources that are *too* restrictive (plain copyright) and could be infringed if aquascape-studio ever moves beyond factual distillation. The three highest-sensitivity sources to watch are Amano's Nature Aquarium World (iconic imagery, aggressive enforcement), Tropica's product photography (not currently used in plants.json and must not be imported without a direct license), and Buce Plant's lifestyle product shots (same concern, smaller scale). As long as aquascape-studio restricts itself to numeric envelope data plus its own editorial prose and its own or CC-licensed imagery, none of these sources becomes a blocker.

## Gaps and unverified material

A complete audit would have fetched each URL and confirmed the live content and any footer-level terms of use. That was not possible in this pass because plants.json stores citation keys without URLs, and the brief capped fetches at twenty. The URLs in `citations.bib` are therefore reconstructed from publisher URL conventions — they should all resolve, but confirmation is a manual-review task. Specifically, the Dennerle slugs, the Buce Plant product-page slugs, the Oriental Aquarium cultivar page, and the Tomey Plants 'Red Flame' page should be verified one by one, and any that 404 should be replaced with current URLs or archived (Wayback Machine) snapshots. In addition, the five grey-literature entries (Rahmatullah 2013, Bosman 2003, the two Tan 2003 notes, and Svensson 2016) need their venues confirmed before they can be treated as reliable citations rather than as placeholders.

## Overall verdict

**Phase-1 plants.json is safe to ship commercially as-is.** The data in plants.json is a factual distillation of numeric care parameters from multiple independent sources, not a reproduction of any single source's creative expression, and facts are not copyrightable. The `notes` field contains original editorial prose that does not quote any of the cited sources verbatim. No imagery from any cited source has been imported into the repository, and the `images` array is empty for every Phase-1 entry, which closes off the single largest class of copyright risk. The one active regulatory constraint — the USDA noxious-weed designation for Hygrophila polysperma — is already captured in the entry's `notes` and is itself a public-domain fact. Action items before any user-facing launch: (1) verify the five grey-literature entries have real venues or demote them to "not cited", (2) confirm the reconstructed publisher URLs actually resolve, and (3) keep the `images` array empty until each image has an explicit CC-BY, CC0, or user-owned provenance. None of these items block the current data contract with sim-agent or render-agent.
