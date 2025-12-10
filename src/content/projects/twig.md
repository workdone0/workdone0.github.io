---
title: Twig
description: A modern terminal-based JSON explorer that makes huge, nested data actually usable. Fast, local, and privacy-first.
repo: https://github.com/workdone0/twig
tags: ["Python", "Textual", "TUI", "JSON", "CLI"]
heroImage: "" 
pubDate: 2025-12-01
---

## Overview

**Twig** is a terminal-based JSON explorer designed for developers who deal with large, complex nested data structures. Unlike simply `cat`ing a file or piping to `jq`, Twig provides an interactive, Miller-columns style navigation interface (similar to macOS Finder) directly in your terminal.

### Key Features

- **Interactive Navigation**: Traverse deep JSON structures with arrow keys.
- **Privacy First**: Everything runs locally; no data leaves your machine.
- **Fast**: Handles large JSON files with ease.
- **Search**: Built-in search for keys and values.

I built this because I was tired of getting lost in 10,000-line JSON responses from APIs. `jq` is powerful but hard to "browse" with. Twig bridges that gap.
