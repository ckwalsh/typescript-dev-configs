# @ckwalsh/typescript-dev-configs

## 1.0.5

### Patch Changes

- f48c9e6: Futureproof customized module suffixes

  Added moduleSuffixes to tsconfig, but not to tsup config builder, meaning
  builds that tried to use them failed. Fixed that, and future-proofed by having
  moduleSuffixes read from the source tsconfig files.

## 1.0.4

### Patch Changes

- e3a7298: Add github PR/Push/Release workflows
- e3a7298: Add ".neutral" modulesuffix for neutral tsconfig
