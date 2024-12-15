# Streaming Providers
### This repo is no longer maintained. copy codes from Scrape repo [Here](https://github.com/Toasty360/Junk) if you like!

This project integrates various streaming providers to fetch video sources for movies and TV shows. Below is a list of the providers currently used, along with their statuses.

## Providers

| Provider       | Status    | Notes                                                      |
|----------------|-----------|------------------------------------------------------------|
| **Vidlink.pro** | Online    | API working as expected, used for fetching movie and TV links. |
| **Vidsrc.net**  | Online    | Stable, primarily for TV shows and other media sources.    |
| **Upcloud (vidsrc.cc)** | Maintenance | Currently under maintenance, some links may not be available. |

## Features

- **Vidlink.pro**: AES-256-CBC encrypted video ID encoding and decryption.
- **Vidsrc.net**: Reliable provider with a large catalog.
- **Upcloud/vidsrc.cc**: Temporary downtime for maintenance, expected to resume soon.

## Usage

To use the provider services, you can call the `getSource` method, passing the required parameters like the media ID, whether it's a movie, and other optional parameters like season and episode numbers.

Example usage for Vidlink.pro:
```typescript
await getSource("957452", true);  // For movies
await getSource("123456", false, "1", "1");  // For TV shows (season 1, episode 1)
