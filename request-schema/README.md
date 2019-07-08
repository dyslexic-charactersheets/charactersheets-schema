# Character Sheet Request Schema

A document format for conveying a request to generate a character sheet. This is based on the [JSON-API standard](https://jsonapi.org/format/).

The format is open-ended, allowing new fields to be added as the game evolves. Details depend on the specific game. See [the game data schema](../game-data.schema) and specific game systems for more details:

- [Pathfinder 2nd Edition](./pathfinder2)

## Wrapper

The schema starts with the JSON-API wrapper, which allows a number of data types to be delivered in a single document.

```json
{
    "version": 0,
    "data": { },
    "included": [ ]
}
```

- The `data` field contains the main item of the request. It may be a single object, or an array of objects. These must be valid resource objects, described below.
- The optional `included` field contains any number of attachments, each of which should also be valid resource objects.
- The `version` number should be incremented whenever the file is modified.

If the `data` field is an array, then each item within it will be considered a separate request, grouped together for efficiency since they share the included attachments, but not linked together. If you wish to send a request for a group of linked items, use a grouping item.

For example, to make character sheets for a party of characters that belong together, use a single `party` instance that links.

## Resource Objects

Each resource has certain fields in common:

```json
{
    "type": "character",
    "id": "cac32e7",
    "attributes": {
        "game": "pathfinder2",
        "name": "Jerome Khaliq",
        "language": "en-US"
    },
    "relationships": { },
}
```

- The `type` field tells us what type of data instance this is. The options include:
    - `"character"` for a single character (either a PC or an NPC)
    - `"party"` for a group of characters
    - `"gm"` for a set of GM pages
    - `"starship"` for a party's starship (if playing Starfinder)
    - `"attachment"` for attached data, eg pictures
    - other types may be added for specific cases
- The `id` field is a unique identifer for this item. This may be any valid string, but when generating IDs a random hex string of at least 7 digits is recommended. Two objects may not have the same ID (but see versioning, below).
- The `attributes` section contains all the specific data for this object.
- The optional `relationships` section has links to other resource objects.

The attributes and relationships are collectively known as "fields". Field names should be camel case (`wordWord`). 

Much of a request depends on the game data, which specifies the fields that it expects to see in a character, party etc. Very few of these fields are strictly required: a server is expected to produce _something_ as long as the document is correclty formatted, even if its content is meaningless. At the same time, the field list is not exhaustive: if a request includes data in a field unknown to the server, that data is simply discarded. This is essential to keeping the format flexible as clients, servers and game data inevitably change.

### Attributes

Whenever possible, attributes should be a single value or an array of values. Avoid making attributes any more complicated than necessary. Values may be any string and depend on the game data, but when possible they should be identiers defined in the game data, which are usually kebab case (`word-word`).

Common attributes include:

- The `game` field is required on resource objects in `data`. It can be omitted from resource objects in `included`, since it can be inferred.
- `language` defines the desired language of the output. This can be either a two-letter language code, eg `"pt"`, or a locale code, eg `"pt-BR"`. If the locale is omitted, the server will pick the most likely locale. Like `game`, this can be omitted from included resources since it can be inferred.
- Print attributes:
    - `printColor`: A colour that is used to replace
    - `accentColor`: A second colour used to accent the first
- Optional pages:
    - `optionPermission`: A page that declares that the character sheet may be legally printed
    - `optionBuild`: A page to assist a player in building their character
    - `optionPartyFunds`: A page that lists all the equipment and assets owned by a party

The order of attributes does not matter.

### Relationships

Resources can link to other resources, either in the `included` list or elsewhere. Objects may be omitted if they're listed in the game data or known to exist, but be aware that taking a linked resource for granted can result in it being lost.

```json
{
    "relationships": {
        "members": {
            "data": [
                {
                    "type": "character",
                    "id": "8fa82c7"
                },
                {
                    "type": "character",
                    "id": "9a944c2"
                },
                {
                    "type": "character",
                    "id": "cac32e7"
                }
            ]
        }
    }
}
```

Relationships are grouped by type. In this case, `"members"` is the name of a relationship. The `data` field lists the linked resources, and it may be either a single item or an array of items. Each item must has a `type` and an `id`.

### Custom Fields

Fields that are not part of the schema may also be used by clients, for example to store information specific to the client. These fields should be prefixed with an underscore `_`, the name of the client, and another underscore.

```json
{
    "type": "character",
    "id": "cac32e7",
    "attributes": {
        "game": "pathfinder2",
        "name": "Jerome Khaliq",
        "language": "en-US",
        "_electronApp_pageNumber": 3,
        "_electronApp_theme": "dark"
    },
}
```

### Versioning

Version tracking may be added in the future.

## Characters

A character has many fields defined by the game. Here are a representative sample, but refer to game data for full details.

```json
{
    "type": "character",
    "id": "cac32e7",
    "attributes": {
        "name": "Jerome Khaliq",
        "gender": "male",
        "age": "27"
    }
}
```

- `name`: the character's name
- `gender`: either `male`, `female` or any other string
- `age`: the character's age


### Class

Most games have a class field, representing the type of character you wish to play. Many classes unlock further fields:

- a specialisation to pick, such as a sorcerer's bloodline or a bard's muse
- a class variant or archetype
- a number of selectables, such as class-specific feats

These fields should be prefixed with the class name.

```json
{
    "class": "class-druid",
    "druidOrder": "druid-order-leaf"
}
```

### Feats

Most games have a concept of "feats", perks which provide a variety of bonus abilities. They may have different names (talents, perks, etc), and there may be multiple sets of them. A key feature is that they are gained at a specific level.

Feat lists should be an array of objects, each listing `level` and `feat`. This is true even if the ability is not called a feat in this game system.

```json
{
    "feats": [
        { "level": 1, "feat": "iron-will" },
        { "level": 3, "feat": "alertness" }
    ],
    "rogueTalents": [
        { "level": 2, "feat": "nimble-dodge" }
    ]
}
```

Feats are always optional. Not all feats may be entered into the game data, and users may wish not to list them on the form when building a character. Do not assume feats levels are contiguous.

## Parties

A party is mostly defined by its members. All the characters in a party must be playing the same game, though they may use different expansions.

```json
{
    "type": "party",
    "id": "c9cba67",
    "attributes": {
        "game": "pathfinder2",
        "name": "The Shady Bunch",
        "language": "en-US"
    },
    "relationships": {
        "partyMembers": {
            "data": [
                {
                    "type": "character",
                    "id": "8fa82c7"
                }
            ]
        }
    }
}
```

- `name`: the party's name
- `partyMembers`: the members

The character IDs should correspond to `included` character resources.

## GM

The GM or "game master" may request a miscellaneous download, such as maps or NPCs. Note that some games refer to the GM by other terms, such as "dungeon master" or "storyteller". This does not change the code `gm` used to request these pages.

GM requests are not considered worth persisting, so the `id` field is optional.

A `gmRequest` field identifies the pages or assets needed. This may be a single string or an array of strings.

```json
{
    "type": "gm",
    "attributes": {
        "gmRequest": [ "maps" ],
        "gmMaps3D": false
    }
}
```

The details of what pages are available and what flags they take depends on game data.


# Examples

## Example character

```json
{
    "data": {
        "type": "character",
        "id": "8fa82c7",
        "attributes": {
            "game": "pathfinder2",
            "name": "Estrelle del Eyre",
            "language": "en-US",
            "gender": "female",
            "ancestry": "ancestry-human",
            "ancestryHeritage": "heritage-human-half-elf",
            "ancestryFeats": [
                { "level": 1, "feat": "" }
            ],
            "background": "background-traveler",
            "class": "class-druid",
            "druidOrder": "leaf",
            "druidFeats": [
                { "level": 1, "feat": "" }
            ],
            "feats": [
                { "level": 1, "feat": "" }
            ],
            "skillFeats": [
                { "level": 1, "feat": "" }
            ]
        },
        "relationships": {
            "portrait": {
                "data": {
                    "type": "attachment",
                    "id": "54b6bca"
                }
            }
        }
    },
    "included": [
        {
            "type": "attachment",
            "data": ""
        }
    ]
}
```

## Example party

```json
{
    "data": {
        "type": "party",
        "id": "c9cba67",
        "attributes": {
            "game": "pathfinder2",
            "name": "The Shady Bunch",
            "language": "en-US"
        },
        "relationships": {
            "party-members": {
                "data": [
                    {
                        "type": "character",
                        "id": "8fa82c7"
                    },
                    {
                        "type": "character",
                        "id": "cac32e7"
                    },
                    {
                        "type": "character",
                        "id": "9a944c2"
                    },
                    {
                        "type": "character",
                        "id": "dde02b1"
                    },
                    {
                        "type": "character",
                        "id": "fc833e2"
                    }
                ]
            }
        }
    },
    "included": [
        {
            "type": "character",
            "id": "8fa82c7",
            "attributes": {
                "name": "Estrelle del Eyre"
            }
        },
        {
            "type": "character",
            "id": "cac32e7",
            "attributes": {
                "name": "Jerome Khaliq"
            }
        },
        {
            "type": "character",
            "id": "9a944c2",
            "attributes": {
                "name": "Shahir Qualtos"
            }
        },
        {            
            "type": "character",
            "id": "dde02b1",
            "attributes": {
                "name": "Talos Farchent"
            }
        },
        {            
            "type": "character",
            "id": "fc833e2",
            "attributes": {
                "name": "Malissia Farchent"
            }
        }
    ]
}
```

## Example GM

```json
{
    "type": "gm",
    "attributes": {
        "gmRequest": [ "maps", "npcs" ],
        "gmMaps3D": false,
        "gmNPCsCount": 8
    }
}
```


More examples can be found in the `test/examples` folder.
