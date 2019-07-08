# Dyslexic Character Sheets Schema

Describes a JSON document format for requesting character sheets.

This schema is used by [the Dyslexic Character Sheets library](https://github.com/dyslexic-charactersheets/lib-charactersheets), which builds character sheets for Pathfinder 2nd Edition.

## Purpose

This standard describes a JSON document format which details a client request for a character sheet. A server is expected to use this data to create and deliver a character sheet file on request. It also describes a second JSON document format for listing game data in a way that enables clients to generate valid character sheet requests.

The key goals of this standard are:

1. To decouple the process of character sheet creation, separating clients from the technical details of generation.

2. To enable more flexible ways of storing, sharing and using character sheets.

Further criteria include:

3. It should be agnostic to technology and platform, so it can be easily used and implemented with a variety of programming languages and contexts.

4. It should be stable, so that a document should continue to be usable years later.

5. It should be scalable enough to fit unanticipated use cases, both new options internally and new ways of using the documents externally.

6. It must be compatible with the project's open source license.

### Decoupled

Dyslexic Character Sheets now has two different back ends creating character sheets; the older one that produces PDFs, and the newer one that produces HTML files. The front-end website is also likely to be changed some day, and other clients that use the library in different ways are anticipated.

### Flexible

A set of form fields is transient; it only exists for as long as a request. A document can be stored, passed around, modified, version controlled, compared and logged. A document format unlocks new possibilities, such as the ability to save, load, combine and exchange character sheet requests.

Combined, these goals will allow multiple tools, written in a variety of languages, to work together in the production of awesome character sheets for various role-playing games, including but not limited to Pathfinder and D&D. They enable the expansion of the tools to cover more new games, and new ways of building and consuming character sheets.

### Technology agnostic

The data format should not be tied to any specific application, platform, programming language or execution context.

A natural result of this is a decision to avoid proprietary technology, and instead work with open standards throughout.

### Stable

Storing a document is useless if you cannot safely use the document later. The format should be stable enough that, even as it evolves, old documents should continue to be useful.

### Scalable

Roleplaying games grow and evolve over time. It's anticipated that, as new games and new options are added, this standard will need to evolve to cover new use cases. The format should be flexible and scalable enough that it can cope with these new options without needing a major overhaul.

### Open Source

Dyslexic Character Sheets are published under the Artistic License 2.0. Any technologies I use must be compatible with this license.


# Design

There are two steps to validating a document:

1. A schema to check basic structure.

2. Checking fields and values against the game data.

The schema is defined using [JSON Schema](http://json-schema.org/). It uses a convention similar to that used by [JSON-API](https://jsonapi.org/).

## Nouns

This schema uses the following terms:

### Game

A set of game rules and options. Games evolve and grow over time, so these options should not be seen as exclusive.

### Character

A description of a single character. Consists of a number of keyed data items.
A character is tied to a specific game, because many the values that make it up depend on the game.

### Party

A group of characters that play the same game together.

### Character Sheet

The end product: a file that can be used to play the game. The format of this file is not specified (it may be an HTML file, a PDF, a zip of other files, etc). Also not specified is whether this file is saved to disk, delivered over the net or consumed in some other way.

### Attachment

Any item too large to fit into a single value. Examples include images, fonts, and other documents.

## Data types

This schema specified the following document formats:

### Game Data

Describes information about a game: what classes and options are available, and how the relate to each other. This format is intended to be provided to clients to enable them to build character requests 

Read more: [Game Data Document](./game-data-schema).

### Character Sheet Request

A request to build a character sheet. Not all character sheets are related to a single character; others may relate to a party or GM pages.

Read more: [Character Sheet Request Schema](./request-schema).

# Testing

To test this schema with your own document:

1. Put a document into `test/in`.

2. Run:

```bash
$ npm install
$ npm test
```
