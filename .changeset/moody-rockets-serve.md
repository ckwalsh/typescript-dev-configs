---
'@ckwalsh/typescript-dev-configs': patch
---

Futureproof customized module suffixes

Added moduleSuffixes to tsconfig, but not to tsup config builder, meaning builds
that tried to use them failed. Fixed that, and future-proofed by having
moduleSuffixes read from the source tsconfig files.
